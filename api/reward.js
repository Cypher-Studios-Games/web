import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: "https://cypher-studios-default-rtdb.firebaseio.com" 
  });
}

export default async function handler(req, res) {
  // Theorem Reach sends a 'sig' or 'security_token' parameter
  const { user_id, reward, sig } = req.query;

  // 🛡️ SECURITY GATEKEEPER
  // This checks if the 'sig' in the URL matches the secret in your Vercel settings
  if (!sig || sig !== process.env.THEOREMREACH_SECRET) {
    console.warn("Unauthorized attempt to add points!");
    return res.status(403).send("0"); // Rejects the "hacker"
  }

  if (!user_id || !reward) {
    return res.status(400).send("0");
  }

  try {
    const db = admin.database();
    const userPointsRef = db.ref(`users/${user_id}/points`);
    const rewardAmount = parseInt(reward, 10);

    await userPointsRef.transaction((currentPoints) => {
      return (currentPoints || 0) + rewardAmount;
    });

    return res.status(200).send("1");
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).send("0");
  }
}