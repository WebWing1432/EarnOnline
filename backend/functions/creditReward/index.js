import { Client, Databases, Query, ID } from 'node-appwrite';

export default async ({ req, res, log }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const { userId, campaignId } = JSON.parse(req.body);

  try {
    const [participation] = (await databases.listDocuments(
      process.env.DB_ID,
      process.env.CAMPAIGN_PARTICIPATION_ID,
      [
        Query.equal('userId', userId),
        Query.equal('campaignId', campaignId)
      ]
    )).documents;

    if (!participation || !participation.isCorrect || participation.watchDuration < 30) {
      throw new Error('Not eligible for reward');
    }

    const campaign = await databases.getDocument(
      process.env.DB_ID,
      process.env.CAMPAIGNS_ID,
      campaignId
    );

    await databases.updateDocument(
      process.env.DB_ID,
      process.env.CAMPAIGN_PARTICIPATION_ID,
      participation.$id,
      { rewardCredited: true }
    );

    await databases.createDocument(
      process.env.DB_ID,
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
  } catch (err) {
    log(err.message);
    return res.json({ success: false, error: err.message });
  }
};
