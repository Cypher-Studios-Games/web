import { auth, db, ref, set, get, createUserWithEmailAndPassword } from "/scripts/firebase.js";

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = signupForm.email.value.trim();
  const username = signupForm.username.value.trim();
  const password = signupForm.password.value;

  if (!email || !username || !password) {
    alert("Please fill out all fields.");
    return;
  }

  // ✅ Validate username characters
  const usernamePattern = /^[a-zA-Z0-9_-]+$/;
  if (!usernamePattern.test(username)) {
    alert("Username can only contain letters, numbers, dashes (-) and underscores (_).");
    return;
  }
  
  // ✅ Validate username length
  if (username.length < 3 || username.length > 20) {
    alert("Username must be between 3 and 20 characters.");
    return;
  }

  try {
    const usernameLower = username.toLowerCase();

    // 1️⃣ Check if username is already taken
    const usernameSnapshot = await get(ref(db, `usernames/${usernameLower}`));
    if (usernameSnapshot.exists()) {
      alert("Username already taken. Please choose another.");
      return;
    }

    // 2️⃣ Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 3️⃣ Write user info under users/$uid
    await set(ref(db, `users/${user.uid}`), {
      email: email,
      username: username,
      createdAt: Date.now()
    });

    // 4️⃣ Add username to index
    await set(ref(db, `usernames/${usernameLower}`), {
      uid: user.uid
    });

    alert("Signup successful!");
    signupForm.reset();
    window.location.href = "/";

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});
