document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.querySelector('.gallery-grid');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeLightbox = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.prev');
    const nextBtn = lightbox.querySelector('.next');

    let currentImageIndex = 0;
    let galleryItems = [];

    // Initialize gallery
    initGallery();

    function initGallery() {
        // Get all gallery items
        galleryItems = document.querySelectorAll('.gallery-item');

        // Add click listeners to gallery items
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        // Add click listeners to category buttons
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => filterGallery(btn.dataset.category));
        });

        // Setup lightbox listeners
        setupLightbox();

        // Setup lazy loading
        setupLazyLoading();
    }

    function filterGallery(category) {
        // Update active button
        categoryBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        // Filter items
        galleryItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
                // Add animation class
                item.classList.add('fade-in');
            } else {
                item.style.display = 'none';
                item.classList.remove('fade-in');
            }
        });
    }

    function openLightbox(index) {
        currentImageIndex = index;
        const currentItem = galleryItems[index];
        const img = currentItem.querySelector('img');

        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        
        // Update caption
        const title = currentItem.querySelector('h3').textContent;
        const description = img.dataset.description;
        lightboxCaption.querySelector('h3').textContent = title;
        lightboxCaption.querySelector('p').textContent = description;

        // Show lightbox with fade effect
        lightbox.classList.remove('hidden');
        setTimeout(() => lightbox.classList.add('active'), 10);

        // Disable body scroll
        document.body.style.overflow = 'hidden';
    }

    function setupLightbox() {
        // Close button
        closeLightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        });

        // Navigation buttons
        prevBtn.addEventListener('click', () => navigateLightbox('prev'));
        nextBtn.addEventListener('click', () => navigateLightbox('next'));

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyPress);

        // Close on overlay click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox.click();
            }
        });
    }

    function navigateLightbox(direction) {
        let newIndex;
        if (direction === 'prev') {
            newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : galleryItems.length - 1;
        } else {
            newIndex = currentImageIndex < galleryItems.length - 1 ? currentImageIndex + 1 : 0;
        }

        // Add transition effect
        lightboxImage.style.opacity = '0';
        setTimeout(() => {
            openLightbox(newIndex);
            lightboxImage.style.opacity = '1';
        }, 300);
    }

    function handleKeyPress(e) {
        if (lightbox.classList.contains('hidden')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox.click();
                break;
            case 'ArrowLeft':
                navigateLightbox('prev');
                break;
            case 'ArrowRight':
                navigateLightbox('next');
                break;
        }
    }

    function setupLazyLoading() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, options);

        // Observe all gallery images
        document.querySelectorAll('.gallery-item img[data-src]').forEach(img => {
            observer.observe(img);
        });
    }

    // Handle image load errors
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('error', () => {
            img.src = 'assets/images/placeholder.jpg';
            img.alt = 'Image failed to load';
        });
    });
});