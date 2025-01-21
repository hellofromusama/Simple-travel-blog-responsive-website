document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const alertContainer = document.getElementById('alertContainer');
    const charCount = document.getElementById('charCount');
    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    // Form validation patterns
    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    };

    // Setup map interaction
    setupMap();

    // Add real-time validation
    contactForm.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => {
            validateField(field);
            if (field.id === 'message') {
                updateCharCount(field);
            }
        });

        field.addEventListener('blur', () => {
            validateField(field, true);
        });
    });

    // Handle form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        const fields = contactForm.querySelectorAll('input, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!validateField(field, true)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showAlert('Please fix the errors in the form.', 'error');
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            // Simulate API call
            await submitForm();
            
            // Show success message
            showAlert('Message sent successfully! We\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            charCount.textContent = '0/500';
            
            // Clear validation states
            fields.forEach(field => {
                field.classList.remove('valid');
                field.classList.remove('invalid');
            });

        } catch (error) {
            showAlert('Failed to send message. Please try again.', 'error');
        } finally {
            setLoadingState(false);
        }
    });

    function validateField(field, showError = false) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.id) {
            case 'name':
                isValid = patterns.name.test(value);
                errorMessage = 'Please enter a valid name (letters and spaces only)';
                break;

            case 'email':
                isValid = patterns.email.test(value);
                errorMessage = 'Please enter a valid email address';
                break;

            case 'message':
                isValid = value.length >= 10 && value.length <= 500;
                errorMessage = 'Message must be between 10 and 500 characters';
                break;
        }

        // Update field styling
        field.classList.toggle('valid', isValid);
        field.classList.toggle('invalid', !isValid && showError);

        // Show/hide error message
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = !isValid && showError ? errorMessage : '';
        }

        return isValid;
    }

    function updateCharCount(field) {
        const maxLength = 500;
        const currentLength = field.value.length;
        charCount.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength) {
            charCount.classList.add('exceed');
        } else {
            charCount.classList.remove('exceed');
        }
    }

    function setLoadingState(isLoading) {
        submitBtn.disabled = isLoading;
        btnText.textContent = isLoading ? 'Sending...' : 'Send Message';
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

    function submitForm() {
        return new Promise((resolve) => {
            // Simulate API delay
            setTimeout(() => {
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value,
                    timestamp: new Date().toISOString()
                };
                console.log('Form submitted:', formData);
                resolve(formData);
            }, 1500);
        });
    }

    function setupMap() {
        const mapOverlay = document.querySelector('.map-overlay');
        const mapContainer = document.querySelector('.map-container');
        
        if (mapOverlay && mapContainer) {
            mapOverlay.addEventListener('click', function() {
                this.style.display = 'none';
                const iframe = mapContainer.querySelector('iframe');
                if (iframe) {
                    iframe.style.pointerEvents = 'auto';
                }
            });
        }
    }
});