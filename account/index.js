import { auth, db, ref, get } from "/scripts/firebase.js";

const accountContainer = document.getElementById("account-info");

// Wait until the auth state is ready
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    accountContainer.innerHTML = "<p>You are not logged in. <a href='/login/'>Log in here</a>.</p>";
    return;
  }

  try {
    // Fetch user data from Realtime Database
    const userSnapshot = await get(ref(db, `users/${user.uid}`));
    if (!userSnapshot.exists()) {
      accountContainer.innerHTML = "<p>User data not found.</p>";
      return;
    }

    const userData = userSnapshot.val();

    // Format the creation date
    const date = new Date(userData.createdAt);
    const formattedDate = date.toLocaleDateString() + " " + date.toLocaleTimeString();

    accountContainer.innerHTML = `
      <h1>Account Info</h1>
      <p><strong>Username:</strong> ${userData.username}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
      <p><strong>Account Created:</strong> ${formattedDate}</p>
    `;
  } catch (err) {
    console.error(err);
    accountContainer.innerHTML = "<p>Error loading account info.</p>";
  }
});
