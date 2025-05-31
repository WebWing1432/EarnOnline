import { Client, Databases, Query, ID } from 'node-appwrite';

export default async ({ res, log }) => {
  try {
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);

    const participants = await databases.listDocuments(
      process.env.DB_ID,
      process.env.CAMPAIGN_PARTICIPATION_ID,
      []
    );

    // Group by userId and sum watch durations
    const leaderboardMap = {};

    participants.documents.forEach(({ userId, watchDuration }) => {
      leaderboardMap[userId] = (leaderboardMap[userId] || 0) + watchDuration;
    });

    const leaderboardEntries = Object.entries(leaderboardMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50); // Top 50

    // Clear old leaderboard
    const oldEntries = await databases.listDocuments(process.env.DB_ID, process.env.LEADERBOARD_ID, []);
    await Promise.all(oldEntries.documents.map(entry =>
      databases.deleteDocument(process.env.DB_ID, process.env.LEADERBOARD_ID, entry.$id)
    ));

    // Add new leaderboard
    await Promise.all(leaderboardEntries.map(([userId, totalWatchDuration], rank) =>
      databases.createDocument(
        process.env.DB_ID,
        process.env.LEADERBOARD_ID,
        ID.unique(),
        {
          userId,
          totalWatchDuration,
          rank: rank + 1
        }
      )
    ));

    return res.json({ success: true, message: 'Leaderboard updated' });

  } catch (err) {
    log(err.message);
    return res.json({ success: false, error: err.message }, 500);
  }
};
