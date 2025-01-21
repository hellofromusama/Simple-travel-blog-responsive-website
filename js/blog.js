/* Debugging Explanation in JavaScript */

/* blog.js */
/*
1. Logs user authentication status to console when loading the blog page.
2. Ensures only logged-in users can post blogs. Redirects unauthorized user to login page.
3. Displays console errors if localStorage data is corrupted, or not available.
*/

document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    console.log("User not logged in. Redirecting to login page.");
    alert("Please log in to access the blog.");
    window.location.href = "login.html";
  } else {
    console.log("User authenticated. Blog page accessible.");
  }

  const blogForm = document.getElementById("blogForm");
  const blogPosts = document.getElementById("blogPosts");

  blogForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    if (!title || !content) {
      console.error("Form validation failed: Title or Content missing.");
      alert("Please fill in both the title and content.");
      return;
    }

    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.push({ title, content });
    localStorage.setItem("posts", JSON.stringify(posts));
    console.log("Blog posted successfully.", { title, content });
    displayPosts();
    blogForm.reset();
  });

  const displayPosts = () => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    blogPosts.innerHTML = posts
      .map(
        (post) => `
                <div class="post">
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                </div>`
      )
      .join("");
  };

  displayPosts();
});
