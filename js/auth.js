document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const alertContainer = document.getElementById('alertContainer');
  const passwordToggles = document.querySelectorAll('.toggle-password');
  const authLink = document.getElementById('authLink');

  // Validation Patterns
  const patterns = {
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  };

  // Initialize auth state
  initializeAuth();

  // Setup event listeners
  if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
      setupFormValidation(loginForm);
  }

  if (signupForm) {
      signupForm.addEventListener('submit', handleSignup);
      setupFormValidation(signupForm);
  }

  // Setup password toggles
  passwordToggles.forEach(toggle => {
      toggle.addEventListener('click', togglePassword);
  });

  // Auth initialization
  function initializeAuth() {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (authLink) {
          if (isLoggedIn) {
              const user = JSON.parse(localStorage.getItem('user'));
              authLink.innerHTML = `
                  <div class="user-menu">
                      <span>${user.email}</span>
                      <button id="logoutBtn" class="btn btn-secondary">Logout</button>
                  </div>
              `;
              document.getElementById('logoutBtn').addEventListener('click', handleLogout);
          } else {
              authLink.innerHTML = '<a href="login.html">Login</a>';
          }
      }

      // Redirect if already logged in
      if (isLoggedIn && (window.location.href.includes('login.html') || 
                        window.location.href.includes('signup.html'))) {
          window.location.href = 'index.html';
      }
  }

  // Form Validation
  function setupFormValidation(form) {
      const inputs = form.querySelectorAll('input');
      
      inputs.forEach(input => {
          input.addEventListener('input', () => validateField(input));
          input.addEventListener('blur', () => validateField(input, true));
      });
  }

  function validateField(field, showError = false) {
      const value = field.value.trim();
      let isValid = true;
      let errorMessage = '';

      switch(field.type) {
          case 'email':
              isValid = patterns.email.test(value);
              errorMessage = 'Please enter a valid email address';
              break;

          case 'password':
              isValid = patterns.password.test(value);
              errorMessage = 'Password must be at least 8 characters with letters and numbers';
              break;
      }

      field.classList.toggle('valid', isValid);
      field.classList.toggle('invalid', !isValid && showError);

      const errorElement = field.nextElementSibling;
      if (errorElement && errorElement.classList.contains('error-message')) {
          errorElement.textContent = !isValid && showError ? errorMessage : '';
      }

      return isValid;
  }

  // Login Handler
  async function handleLogin(e) {
      e.preventDefault();
      
      const emailInput = document.getElementById('loginEmail');
      const passwordInput = document.getElementById('loginPassword');
      const rememberMe = document.getElementById('rememberMe');
      
      if (!validateField(emailInput, true) || !validateField(passwordInput, true)) {
          showAlert('Please fix the errors in the form.', 'error');
          return;
      }

      setLoadingState(true);

      try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Check credentials
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const user = users.find(u => u.email === emailInput.value && 
                                    u.password === hashPassword(passwordInput.value));

          if (!user) {
              throw new Error('Invalid email or password');
          }

          // Set auth state
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', JSON.stringify({ email: user.email }));
          if (rememberMe.checked) {
              localStorage.setItem('rememberMe', 'true');
          }

          showAlert('Login successful! Redirecting...', 'success');
          setTimeout(() => window.location.href = 'index.html', 1500);

      } catch (error) {
          showAlert(error.message, 'error');
          setLoadingState(false);
      }
  }

  // Signup Handler
  async function handleSignup(e) {
      e.preventDefault();

      const emailInput = document.getElementById('signupEmail');
      const passwordInput = document.getElementById('signupPassword');

      if (!validateField(emailInput, true) || !validateField(passwordInput, true)) {
          showAlert('Please fix the errors in the form.', 'error');
          return;
      }

      setLoadingState(true);

      try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          const users = JSON.parse(localStorage.getItem('users') || '[]');
          
          if (users.some(u => u.email === emailInput.value)) {
              throw new Error('Email already registered');
          }

          // Add new user
          users.push({
              email: emailInput.value,
              password: hashPassword(passwordInput.value)
          });
          
          localStorage.setItem('users', JSON.stringify(users));

          showAlert('Registration successful! Please log in.', 'success');
          setTimeout(() => window.location.href = 'login.html', 1500);

      } catch (error) {
          showAlert(error.message, 'error');
          setLoadingState(false);
      }
  }

  // Logout Handler
  function handleLogout() {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
      window.location.href = 'login.html';
  }

  // Utility Functions
  function hashPassword(password) {
      // In a real app, use proper password hashing
      return btoa(password);
  }

  function togglePassword(e) {
      const button = e.currentTarget;
      const input = button.previousElementSibling;
      const icon = button.querySelector('i');

      if (input.type === 'password') {
          input.type = 'text';
          icon.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
          input.type = 'password';
          icon.classList.replace('fa-eye-slash', 'fa-eye');
      }
  }

  function setLoadingState(isLoading) {
      const submitBtn = document.querySelector('button[type="submit"]');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');

      submitBtn.disabled = isLoading;
      btnText.style.opacity = isLoading ? '0' : '1';
      btnLoader.classList.toggle('hidden', !isLoading);
  }

  function showAlert(message, type) {
      const alert = document.createElement('div');
      alert.className = `alert alert-${type}`;
      alert.textContent = message;

      alertContainer.innerHTML = '';
      alertContainer.appendChild(alert);

      setTimeout(() => {
          alert.classList.add('fade-out');
          setTimeout(() => alert.remove(), 300);
      }, 3000);
  }
});