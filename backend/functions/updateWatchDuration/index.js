import { Client, Databases, Query } from 'node-appwrite';

export default async ({ req, res, log }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const { userId, campaignId, duration } = JSON.parse(req.body);

  try {
    const documents = await databases.listDocuments(
      process.env.DB_ID,
      process.env.CAMPAIGN_PARTICIPATION_ID,
      [
        Query.equal('userId', userId),
        Query.equal('campaignId', campaignId)
      ]
    );

    const doc = documents.documents[0];
    if (!doc) throw new Error('Participation record not found');

    const updated = await databases.updateDocument(
      process.env.DB_ID,
      process.env.CAMPAIGN_PARTICIPATION_ID,
      doc.$id,
      { watchDuration: doc.watchDuration + duration }
    );

    return res.json({ success: true, updated });
  } catch (err) {
    log(err.message);
    return res.json({ success: false, error: err.message });
  }
};
