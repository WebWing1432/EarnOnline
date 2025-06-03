import { Client, Databases, ID } from 'node-appwrite';
import { validateUpiId } from '../../utils/validateUpiId.js';

export default async ({ req, res, log }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const dbId = process.env.APPWRITE_DATABASE_ID;

  try {
    const body = JSON.parse(req.body || '{}');
    const { action, userId, username, email, upiId, role = 'viewer', amount } = body;

    if (action === 'register') {
      if (!userId || !username || !email || !upiId) {
        return res.json({ success: false, message: 'Missing required fields' }, 400);
      }

      if (!validateUpiId(upiId)) {
        return res.json({ success: false, error: 'Invalid UPI ID format' }, 400);
      }

      const result = await databases.createDocument(
        dbId,
        process.env.USERS_COLLECTION_ID,
        userId,
        {
          username,
          email,
          upiId,
          role,
          totalRewards: 0
        }
      );
      return res.json({ success: true, result });
    }

    if (action === 'withdraw') {
      if (!userId || !upiId || !amount) {
        return res.json({ success: false, message: 'Missing required fields' }, 400);
      }

      if (!validateUpiId(upiId)) {
        return res.json({ success: false, message: 'Invalid UPI ID' }, 400);
      }

      if (amount < 10) {
        return res.json({ success: false, message: 'Minimum withdrawal is ₹10' }, 400);
      }

      const result = await databases.createDocument(
        dbId,
        process.env.WITHDRAWALS_COLLECTION_ID,
        ID.unique(),
        {
          userId,
          upiId,
          amount,
          status: 'pending',
          requestedAt: new Date().toISOString()
        }
      );
      return res.json({ success: true, result });
    }

    return res.json({ success: false, message: 'Unknown action' }, 400);

  } catch (err) {
    log(err.message);
    return res.json({ success: false, error: err.message }, 500);
  }
};