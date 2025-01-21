document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const authLink = document.getElementById("authLink");

  // Handle Signup Form
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;

      if (!email || !password) {
        console.error("Signup failed: Missing email or password.");
        alert("Please fill in all fields.");
        return;
      }

      localStorage.setItem("user", JSON.stringify({ email, password }));
      console.log("User signed up:", { email });
      alert("Signup successful! Please log in.");
      window.location.href = "login.html";
    });
  }

  // Handle Login Form
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      const user = JSON.parse(localStorage.getItem("user"));

      if (user && user.email === email && user.password === password) {
        localStorage.setItem("isLoggedIn", "true");
        console.log("Login successful:", { email });
        alert("Login successful! Redirecting to blog page.");
        window.location.href = "blog.html";
      } else {
        console.error("Login failed: Incorrect credentials.");
        alert("Incorrect email or password. Please try again.");
      }
    });
  }

  // Check Authentication State
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (authLink) {
    if (isLoggedIn) {
      authLink.innerHTML = '<a href="#" id="logoutButton">Logout</a>';
      const logoutButton = document.getElementById("logoutButton");
      logoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
      });
    } else {
      authLink.innerHTML = '<a href="login.html">Login</a>';
    }
  }

  // Logout Function
  function logout() {
    localStorage.removeItem("isLoggedIn"); // Only clear login session
    console.log("User logged out.");
    alert("You have been logged out.");
    window.location.href = "index.html"; // Redirect to homepage or login page
  }

  // Protect Blog Page
  if (window.location.pathname.includes("blog.html")) {
    if (!isLoggedIn) {
      alert("You must log in to access this page.");
      window.location.href = "login.html";
    }
  }
});
