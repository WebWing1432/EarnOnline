import { Client, Databases, Query, ID } from 'node-appwrite';

export default async ({ req, res, log }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const dbId = process.env.APPWRITE_DATABASE_ID;

  try {
    const body = JSON.parse(req.body || '{}');
    const { action, userId, campaignId, answerSubmitted } = body;

    const [participation] = (await databases.listDocuments(
      dbId,
      process.env.CAMPAIGN_PARTICIPATION_ID,
      [Query.equal('userId', userId), Query.equal('campaignId', campaignId)]
    )).documents;

    if (!participation) {
      return res.json({ success: false, error: 'Participation not found' }, 404);
    }

    if (action === 'submitAnswer') {
      const campaign = await databases.getDocument(dbId, process.env.CAMPAIGNS_ID, campaignId);
      const isCorrect = campaign.correctAnswer.trim().toLowerCase() === answerSubmitted.trim().toLowerCase();

      await databases.updateDocument(
        dbId,
        process.env.CAMPAIGN_PARTICIPATION_ID,
        participation.$id,
        {
          answerSubmitted,
          isCorrect
        }
      );
      return res.json({ success: true, isCorrect });
    }

    if (action === 'creditReward') {
      if (!participation.isCorrect || participation.watchDuration < 30) {
        throw new Error('Not eligible for reward');
      }

      const campaign = await databases.getDocument(dbId, process.env.CAMPAIGNS_ID, campaignId);

      await databases.updateDocument(
        dbId,
        process.env.CAMPAIGN_PARTICIPATION_ID,
        participation.$id,
        { rewardCredited: true }
      );

      await databases.createDocument(
        dbId,
        process.env.PAYOUTS_ID,
        ID.unique(),
        {
          userId,
          campaignId,
          amount: campaign.rewardPerUser,
          method: 'upi',
          status: 'pending'
        }
      );

      return res.json({ success: true });
    }

    return res.json({ success: false, message: 'Unknown action' }, 400);
  } catch (err) {
    log(err.message);
    return res.json({ success: false, error: err.message }, 500);
  }
};
