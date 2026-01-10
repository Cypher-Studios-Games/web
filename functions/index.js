const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

exports.theoremReachReward = onRequest(async (req, res) => {
    const { user_id, reward } = req.query;

    if (!user_id || !reward) {
        return res.status(400).send("0");
    }

    try {
        const db = admin.database();
        const userPointsRef = db.ref(`users/${user_id}/points`);

        // Use a transaction to safely add points
        await userPointsRef.transaction((currentPoints) => {
            return (currentPoints || 0) + parseInt(reward);
        });

        res.status(200).send("1"); // Tells Theorem Reach "Got it!"
    } catch (error) {
        console.error("Reward error:", error);
        res.status(500).send("0");
    }
});