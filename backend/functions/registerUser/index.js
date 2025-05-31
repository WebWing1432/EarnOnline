import { Client, Databases, ID } from 'node-appwrite';
import { validateUpiId } from '../../utils/validateUpiId.js';


export default async ({ req, res, log }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const { userId, username, upiId, email, role = 'viewer' } = JSON.parse(req.body);

  try {
    const result = await databases.createDocument(
      process.env.DB_ID,
      process.env.USERS_COLLECTION_ID,
      userId,
      {
        username,
        upiId,
        email,
        role,
        totalRewards: 0
      }
    );
      if (!validateUpiId(upiId)) {
          return res.json({ success: false, error: 'Invalid UPI ID format' }, 400);
      }
    return res.json({ success: true, result });
  } catch (err) {
    log(err.message);
    return res.json({ success: false, error: err.message });
  }
};
