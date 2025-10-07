import { auth, db, ref, set, createUserWithEmailAndPassword } from "/scripts/firebase.js";

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const username = signupForm.username.value;
  const password = signupForm.password.value;

  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user info in Realtime DB
    await set(ref(db, `users/${user.uid}`), {
      email,
      username,
      createdAt: Date.now()
    });

    alert("Account created successfully!");
    signupForm.reset();
    // redirect or show logged-in UI
    window.location.href = "/games/";
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});