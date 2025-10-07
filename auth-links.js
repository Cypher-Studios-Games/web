// auth-links.js
import { auth, signOut } from "/scripts/firebase.js";

const loginLink = document.getElementById("loginLink");
const signupLink = document.getElementById("signupLink");

auth.onAuthStateChanged(user => {
  if (user) {
    // User is logged in → change links
    loginLink.textContent = "Account";
    loginLink.href = "/account/";

    signupLink.textContent = "Log Out";
    signupLink.href = "#"; // prevent default
    signupLink.addEventListener("click", async (e) => {
      e.preventDefault();
      await signOut(auth);
      // refresh the page or redirect
      window.location.reload();
    });
  } else {
    // User is logged out → reset links
    loginLink.textContent = "Log In";
    loginLink.href = "/login/";

    signupLink.textContent = "Sign Up";
    signupLink.href = "/signup/";
  }
});
