document.addEventListener('DOMContentLoaded', () => {
  const blogForm = document.getElementById('blogForm');
  const blogPosts = document.getElementById('blogPosts');
  const blogFormContainer = document.getElementById('blogFormContainer');
  const alertContainer = document.getElementById('alertContainer');

  // Check authentication
  function checkAuth() {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
          blogFormContainer.classList.remove('hidden');
      } else {
          blogFormContainer.classList.add('hidden');
          window.location.href = 'login.html';
      }
  }

  // Check auth on load
  checkAuth();

  // Handle form submission
  blogForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Check auth again before posting
      if (localStorage.getItem('isLoggedIn') !== 'true') {
          window.location.href = 'login.html';
          return;
      }

      const title = document.getElementById('title').value.trim();
      const content = document.getElementById('content').value.trim();

      if (!title || !content) {
          showAlert('Please fill in all fields.', 'error');
          return;
      }

      // Get user info
      const userEmail = JSON.parse(localStorage.getItem('user'))?.email;
      if (!userEmail) {
          showAlert('Please log in again.', 'error');
          window.location.href = 'login.html';
          return;
      }

      const newPost = {
          id: Date.now(),
          title,
          content,
          author: userEmail,
          date: new Date().toLocaleString(),
          likes: 0
      };

      // Get existing posts or initialize empty array
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      
      // Add new post to beginning of array
      posts.unshift(newPost);
      
      // Save updated posts
      localStorage.setItem('posts', JSON.stringify(posts));

      // Show success message
      showAlert('Blog post published successfully!', 'success');

      // Reset form
      blogForm.reset();

      // Refresh posts display
      displayPosts();
  });

  // Function to display posts
  function displayPosts() {
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      
      if (posts.length === 0) {
          blogPosts.innerHTML = '<p>No posts yet. Be the first to share your story!</p>';
          return;
      }

      blogPosts.innerHTML = posts.map(post => `
          <article class="post" data-post-id="${post.id}">
              <div class="post-meta">
                  <span>By ${post.author}</span>
                  <span>• ${post.date}</span>
              </div>
              <h3>${post.title}</h3>
              <p>${post.content}</p>
          </article>
      `).join('');
  }

  // Function to show alerts
  function showAlert(message, type) {
      const alert = document.createElement('div');
      alert.className = `alert alert-${type}`;
      alert.textContent = message;
      
      // Clear existing alerts
      alertContainer.innerHTML = '';
      alertContainer.appendChild(alert);

      // Remove alert after 3 seconds
      setTimeout(() => {
          alert.remove();
      }, 3000);
  }

  // Initial display of posts
  displayPosts();
});