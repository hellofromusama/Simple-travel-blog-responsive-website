/* Debugging Explanation in JavaScript */

/* contact.js */
/*
1. Logs input validation steps to ensure correct data entry.
2. Handles errors in form submission and logs them to the console.
3. Alerts the user if any required field is missing.
*/

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    if (!name || !email || !message) {
      console.error("Form submission error: Missing fields.");
      alert("Please fill out all fields before submitting.");
      return;
    }

    console.log("Form submitted successfully:", { name, email, message });
    alert("Thank you for contacting us! We'll get back to you soon.");
    contactForm.reset();
  });
});
