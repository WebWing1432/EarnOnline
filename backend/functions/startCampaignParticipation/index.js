import { Client, Databases, ID } from 'node-appwrite';

export default async ({ req, res, log }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const { userId, campaignId } = JSON.parse(req.body);

  try {
    const result = await databases.createDocument(
      process.env.DB_ID,
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
    return res.json({ success: true, result });
  } catch (err) {
    log(err.message);
    return res.json({ success: false, error: err.message });
  }
};
