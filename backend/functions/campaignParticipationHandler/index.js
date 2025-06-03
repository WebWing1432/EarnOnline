import { Client, Databases, ID, Query } from 'node-appwrite';

export default async ({ req, res, log }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const dbId = process.env.APPWRITE_DATABASE_ID;

  try {
    const body = JSON.parse(req.body || '{}');
    const { userId, campaignId } = body;

    if (!userId || !campaignId) {
      return res.json({ success: false, message: 'Missing userId or campaignId' }, 400);
    }

    // Check if user already started this campaign
    const existing = await databases.listDocuments(
      dbId,
      process.env.CAMPAIGN_PARTICIPATION_ID,
      [
        Query.equal('userId', userId),
        Query.equal('campaignId', campaignId)
      ]
    );

    if (existing.total > 0) {
      return res.json({
        success: true,
        message: 'User already participating',
        participation: existing.documents[0]
      });
    }

    // Create new participation entry
    const participation = await databases.createDocument(
      dbId,
      process.env.CAMPAIGN_PARTICIPATION_ID,
      ID.unique(),
      {
        userId,
        campaignId,
        watchDuration: 0,
        isCorrect: false,
        rewardCredited: false
      }
    );

    return res.json({
      success: true,
      message: 'Campaign participation started',
      participation
    });

  } catch (err) {
    log(err.message);
    return res.json({ success: false, error: err.message }, 500);
  }
};
