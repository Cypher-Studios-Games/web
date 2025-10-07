import { auth, signInWithEmailAndPassword } from "/scripts/firebase.js";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    loginForm.reset();
    // redirect or show logged-in UI
    window.location.href = "/";
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});
