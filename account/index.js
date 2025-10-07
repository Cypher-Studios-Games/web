import { auth, db, ref, get, set } from "/scripts/firebase.js";
import { sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const accountContainer = document.getElementById("accountContainer");

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    accountContainer.innerHTML = "<p>Please log in first.</p>";
    return;
  }

  try {
    // 🔄 Refresh user to get latest emailVerified
    await user.reload();

    const userSnapshot = await get(ref(db, `users/${user.uid}`));
    if (!userSnapshot.exists()) {
      accountContainer.innerHTML = "<p>User data not found!</p>";
      return;
    }

    const userData = userSnapshot.val();

    if (user.emailVerified) {
      // ✅ Update database if emailVerified is false
      if (!userData.emailVerified) {
        await set(ref(db, `users/${user.uid}/emailVerified`), true);
      }

      // Show account info
      accountContainer.innerHTML = `
        <h1>Account Info</h1>
        <p><strong>Username:</strong> ${userData.username}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Account Created:</strong> ${new Date(userData.createdAt).toLocaleString()}</p>
      `;
    } else {
      accountContainer.innerHTML = `
        <h1>Email Verification Required</h1>
        <p>You need to verify your email before accessing your account.</p>
        <button id="resendBtn">Resend Verification Email</button>
      `;

      document.getElementById("resendBtn").addEventListener("click", async () => {
        await sendEmailVerification(user);
        alert("Verification email resent! Check your inbox.");
      });
    }
  } catch (err) {
    console.error(err);
    accountContainer.innerHTML = "<p>Error loading account info.</p>";
  }
});
