import admin from 'firebase-admin';

// Initialize Firebase Admin (Vercel uses Environment Variables for security)
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
  const { user_id, reward } = req.query;

  if (!user_id || !reward) {
    return res.status(400).send("0");
  }

  try {
    const db = admin.database();
    const userPointsRef = db.ref(`users/${user_id}/points`);

    await userPointsRef.transaction((currentPoints) => {
      return (currentPoints || 0) + parseInt(reward, 10);
    });

    return res.status(200).send("1");
  } catch (error) {
    console.error(error);
    return res.status(500).send("0");
  }
}