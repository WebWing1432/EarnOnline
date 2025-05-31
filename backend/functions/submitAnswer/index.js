import { Client, Databases, Query } from 'node-appwrite';

export default async ({ req, res, log }) => {
  try {
    if (req.method !== 'POST') {
      return res.json({ success: false, error: 'Invalid HTTP method' }, 405);
    }

    const { userId, campaignId, answerSubmitted } = JSON.parse(req.body || '{}');

    if (!userId || !campaignId || !answerSubmitted) {
      return res.json({ success: false, error: 'Missing required fields' }, 400);
    }

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    const campaign = await databases.getDocument(
      process.env.DB_ID,
      process.env.CAMPAIGNS_ID,
      campaignId
    );

    if (!campaign || !campaign.correctAnswer) {
      return res.json({ success: false, error: 'Campaign not found or invalid' }, 404);
    }

    const isCorrect = campaign.correctAnswer.trim().toLowerCase() === answerSubmitted.trim().toLowerCase();

    const documents = await databases.listDocuments(
      process.env.DB_ID,
      process.env.CAMPAIGN_PARTICIPATION_ID,
      [
        Query.equal('userId', userId),
        Query.equal('campaignId', campaignId)
      ]
    );

    const participation = documents.documents[0];

    if (!participation) {
      return res.json({ success: false, error: 'Participation not found' }, 404);
    }

    await databases.updateDocument(
      process.env.DB_ID,
      process.env.CAMPAIGN_PARTICIPATION_ID,
      participation.$id,
      {
        answerSubmitted,
        isCorrect
      }
    );

    return res.json({ success: true, isCorrect });

  } catch (err) {
    log(err.message || err);
    return res.json({ success: false, error: 'Server error' }, 500);
  }
};
