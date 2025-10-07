// signup.js
import { auth, db, ref, set, get, createUserWithEmailAndPassword } from "/scripts/firebase.js";
import { sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = signupForm.email.value.trim();
  const username = signupForm.username.value.trim();
  const password = signupForm.password.value;

  // 1️⃣ Basic empty field check
  if (!email || !username || !password) {
    alert("Please fill out all fields.");
    return;
  }

  // 2️⃣ Username validation: characters only
  const usernamePattern = /^[a-zA-Z0-9_-]+$/;
  if (!usernamePattern.test(username)) {
    alert("Username can only contain letters, numbers, dashes (-) and underscores (_).");
    return;
  }

  // 3️⃣ Username validation: length
  if (username.length < 3 || username.length > 20) {
    alert("Username must be between 3 and 20 characters.");
    return;
  }

  try {
    const usernameLower = username.toLowerCase();

    // 4️⃣ Check if username already exists
    const usernameSnapshot = await get(ref(db, `usernames/${usernameLower}`));
    if (usernameSnapshot.exists()) {
      alert("Username already taken. Please choose another.");
      return;
    }

    // 5️⃣ Create Firebase Auth user (email uniqueness handled automatically)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 6️⃣ Save user info in Realtime Database
    await set(ref(db, `users/${user.uid}`), {
      email: email,
      username: username,
      createdAt: Date.now()
    });

    // 7️⃣ Save username index for uniqueness
    await set(ref(db, `usernames/${usernameLower}`), {
      uid: user.uid
    });

    // 8️⃣ Send email verification
    await sendEmailVerification(user);
    alert("Signup successful! A verification email has been sent to your inbox.");

    // 9️⃣ Reset form & redirect
    signupForm.reset();
    window.location.href = "/";

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});