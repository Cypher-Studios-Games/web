document.addEventListener("DOMContentLoaded", function() {
        const popup = document.getElementById("consent-popup");
        const acceptBtn = document.getElementById("accept-consent");

        // Check if user already agreed
        if (!localStorage.getItem("cypher_consent_accepted")) {
            popup.classList.remove("consent-hidden");
        }

        // When user clicks "I Agree"
        acceptBtn.addEventListener("click", function() {
            localStorage.setItem("cypher_consent_accepted", "true");
            popup.classList.add("consent-hidden");
        });
    });