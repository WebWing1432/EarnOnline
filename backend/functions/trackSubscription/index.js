import { Client, Databases, ID } from "node-appwrite";

export default async ({ req, res, log }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  const collectionId = "subscriptions";

  try {
    const { userId, campaignId, channelId, proofUrl } = JSON.parse(req.body);

    if (!userId || !campaignId || !channelId) {
      return res.json({ success: false, message: "Missing required fields" }, 400);
    }

    const document = await databases.createDocument(databaseId, collectionId, ID.unique(), {
      userId,
      campaignId,
      channelId,
      proofUrl: proofUrl || null,
      status: "pending",
      verifiedAt: null
    });

    return res.json({ success: true, message: "Subscription recorded", data: document });

  } catch (error) {
    log(error);
    return res.json({ success: false, message: "Server error", error: error.message }, 500);
  }
};
