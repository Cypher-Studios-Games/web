import { auth } from "/scripts/firebase.js";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Elements
const loginForm = document.getElementById("loginForm");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const resetForm = document.getElementById("resetForm");
const resetEmail = document.getElementById("resetEmail");
const cancelReset = document.getElementById("cancelReset");
const message = document.getElementById("message");

// ===== Login =====
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginForm.email.value.trim();
  const password = loginForm.password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    message.style.color = "#0ff";
    message.textContent = "Login successful!";
    window.location.href = "/account/";
  } catch (err) {
    console.error(err);
    message.style.color = "#f55";
    message.textContent = err.message;
  }
});

// ===== Show reset form =====
forgotPasswordLink.addEventListener("click", (e) => {
  e.preventDefault();
  resetForm.style.display = "block";
  loginForm.style.display = "none";
  forgotPasswordLink.style.display = "none";
  message.textContent = "";
});

// ===== Cancel reset =====
cancelReset.addEventListener("click", (e) => {
  e.preventDefault();
  resetForm.style.display = "none";
  loginForm.style.display = "block";
  forgotPasswordLink.style.display = "inline";
  message.textContent = "";
});

// ===== Reset password =====
resetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = resetEmail.value.trim();

  if (!email) {
    message.style.color = "#f55";
    message.textContent = "Please enter your email.";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    message.style.color = "#0ff";
    message.textContent = "Password reset email sent! Check your inbox.";
    resetForm.style.display = "none";
    loginForm.style.display = "block";
    forgotPasswordLink.style.display = "inline";
  } catch (err) {
    console.error(err);
    message.style.color = "#f55";
    message.textContent = err.message;
  }
});
