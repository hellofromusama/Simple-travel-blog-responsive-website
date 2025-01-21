/* Debugging Explanation in JavaScript */

/* gallery.js */
/*
1. Console logs each gallery item loaded to ensure correct assets are linked.
2. Adds an event listener for image click to enable a lightbox display.
3. Validates the image source and logs errors if images are missing.
*/

document.addEventListener("DOMContentLoaded", () => {
  const galleryItems = document.querySelectorAll(".gallery-item img");

  galleryItems.forEach((item) => {
    console.log(`Gallery item loaded: ${item.src}`);

    item.addEventListener("click", () => {
      const lightbox = document.createElement("div");
      lightbox.classList.add("lightbox");
      const img = document.createElement("img");
      img.src = item.src;

      lightbox.appendChild(img);
      document.body.appendChild(lightbox);

      lightbox.addEventListener("click", () => {
        document.body.removeChild(lightbox);
      });
    });

    if (!item.complete || item.naturalWidth === 0) {
      console.error(`Image failed to load: ${item.src}`);
    }
  });
});
