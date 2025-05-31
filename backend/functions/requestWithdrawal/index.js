import { Client, Databases, ID, InputFile } from "node-appwrite";

// Utility to validate UPI ID
function isValidUpiId(upiId) {
  return /^[\w.-]+@[\w]+$/.test(upiId);
}

export default async ({ req, res, log }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  const collectionId = "withdrawals";

  try {
    const { userId, amount, upiId } = JSON.parse(req.body);

    // ✅ Validations
    if (!userId || !amount || !upiId) {
      return res.json({ success: false, message: "Missing required fields" }, 400);
    }

    if (amount < 10) {
      return res.json({ success: false, message: "Minimum withdrawal is ₹10" }, 400);
    }

    if (!isValidUpiId(upiId)) {
      return res.json({ success: false, message: "Invalid UPI ID" }, 400);
    }

    const result = await databases.createDocument(databaseId, collectionId, ID.unique(), {
      userId,
      amount,
      upiId,
      status: "pending",
      requestedAt: new Date().toISOString()
    });

    return res.json({ success: true, message: "Withdrawal requested", data: result });

  } catch (error) {
    log(error);
    return res.json({ success: false, message: "Server error", error: error.message }, 500);
  }
};
