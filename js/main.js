// ===== Main JavaScript File =====

// Global variables
let currentTheme = 'light';
let cart = JSON.parse(localStorage.getItem('aldobiz-cart')) || [];

// ===== Theme Management =====
function initializeTheme() {
    const savedTheme = localStorage.getItem('aldobiz-theme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aldobiz-theme', theme);
    
    // Update theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// ===== Navigation Management =====
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.querySelector('i').className = 
                navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        });
        
        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.querySelector('i').className = 'fas fa-bars';
            });
        });
    }
}

// ===== Cart Management =====
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('aldobiz-cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('aldobiz-cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartItemQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
        }
        localStorage.setItem('aldobiz-cart', JSON.stringify(cart));
        updateCartCount();
    }
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    return colors[type] || '#3498db';
}

// ===== Timer Functionality =====
function initializeTimer() {
    const timerElement = document.querySelector('.timer');
    if (!timerElement) return;
    
    // Set end date (3 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);
    
    function updateTimer() {
        const now = new Date().getTime();
        const distance = endDate - now;
        
        if (distance < 0) {
            // Timer expired
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    }
    
    // Update immediately and every minute
    updateTimer();
    setInterval(updateTimer, 60000);
}

// ===== Newsletter Form =====
function initializeNewsletter() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        // Simple email validation
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Thank you for subscribing!', 'success');
            this.reset();
        }, 1000);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== FAQ Functionality =====
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ===== Contact Form Validation =====
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm()) {
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            setTimeout(() => {
                showNotification('Your message has been sent successfully!', 'success');
                contactForm.reset();
                document.getElementById('form-success').style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    document.getElementById('form-success').style.display = 'none';
                }, 5000);
            }, 2000);
        }
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            clearError(input);
        });
    });
}

function validateContactForm() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${field.id}-error`);
    
    // Clear previous error
    clearError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, errorElement, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, errorElement, 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

function showFieldError(field, errorElement, message) {
    field.style.borderColor = 'var(--error-color)';
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearError(field) {
    field.style.borderColor = '';
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// ===== Scroll Animations =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.category-card, .product-card, .value-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== Utility Functions =====
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    updateCartCount();
    initializeTimer();
    initializeNewsletter();
    initializeFAQ();
    initializeContactForm();
    initializeScrollAnimations();
    
    // Theme toggle event
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Update cart count on all pages
    updateCartCount();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        formatPrice
    };
}