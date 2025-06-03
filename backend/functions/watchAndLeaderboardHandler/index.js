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
    const { action, userId, campaignId, duration } = body;

    if (action === 'updateWatchDuration') {
      const docs = await databases.listDocuments(dbId, process.env.CAMPAIGN_PARTICIPATION_ID, [
        Query.equal('userId', userId),
        Query.equal('campaignId', campaignId)
      ]);

      const doc = docs.documents[0];
      if (!doc) throw new Error('Participation record not found');

      const updated = await databases.updateDocument(
        dbId,
        process.env.CAMPAIGN_PARTICIPATION_ID,
        doc.$id,
        { watchDuration: doc.watchDuration + duration }
      );

      return res.json({ success: true, data: updated });
    }

    if (action === 'updateLeaderboard') {
      const participants = await databases.listDocuments(
        dbId,
        process.env.CAMPAIGN_PARTICIPATION_ID,
        []
      );

      const leaderboardMap = {};
      participants.documents.forEach(({ userId, watchDuration }) => {
        leaderboardMap[userId] = (leaderboardMap[userId] || 0) + watchDuration;
      });

      const topUsers = Object.entries(leaderboardMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50);

      const oldEntries = await databases.listDocuments(dbId, process.env.LEADERBOARD_ID, []);
      await Promise.all(oldEntries.documents.map(entry =>
        databases.deleteDocument(dbId, process.env.LEADERBOARD_ID, entry.$id)
      ));

      await Promise.all(topUsers.map(([uid, duration], rank) =>
        databases.createDocument(
          dbId,
          process.env.LEADERBOARD_ID,
          ID.unique(),
          { userId: uid, totalWatchDuration: duration, rank: rank + 1 }
        )
      ));

      return res.json({ success: true, message: 'Leaderboard updated' });
    }

    return res.json({ success: false, message: 'Unknown action' }, 400);
  } catch (err) {
    log(err.message);
    return res.json({ success: false, error: err.message }, 500);
  }
};
