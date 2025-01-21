document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections and cards for fade in
    document.querySelectorAll('.mission-content, .value-card, .team-member, .stat-card').forEach(element => {
        element.classList.add('fade-in');
        fadeObserver.observe(element);
    });

    // Stats counter animation
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all stat numbers
    document.querySelectorAll('.stat-card h3').forEach(stat => {
        statObserver.observe(stat);
    });

    // Function to animate statistics
    function animateStats(element) {
        const value = parseInt(element.textContent);
        const suffix = element.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const duration = 2000; // 2 seconds
        const increment = value / (duration / 16); // 60fps

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                element.textContent = value + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 16);
    }

    // Add hover effect to team member social links
    document.querySelectorAll('.team-member').forEach(member => {
        const socialLinks = member.querySelector('.social-links');
        
        member.addEventListener('mouseenter', () => {
            socialLinks.style.opacity = '1';
            socialLinks.style.transform = 'translateY(0)';
        });

        member.addEventListener('mouseleave', () => {
            socialLinks.style.opacity = '0';
            socialLinks.style.transform = 'translateY(10px)';
        });
    });
});