// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initSmoothScrolling();
    initScrollSpy();
    initAnalytics();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Handle navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for cards
                if (entry.target.classList.contains('leadership-grid') || 
                    entry.target.classList.contains('portfolio-grid') ||
                    entry.target.classList.contains('insights-grid')) {
                    
                    const cards = entry.target.querySelectorAll('.leadership-card, .portfolio-card, .insight-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToObserve = document.querySelectorAll(
        '.section-header, .leadership-grid, .transformation-grid, .portfolio-grid, .insights-grid, .about-content, .connect-content'
    );
    
    elementsToObserve.forEach(el => {
        observer.observe(el);
    });

    // Initial setup for cards
    const cards = document.querySelectorAll('.leadership-card, .portfolio-card, .insight-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Add loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Log form data for demo purposes
                console.log('Executive Contact Form Submission:', formObject);
                
                // Track form submission
                trackEvent('Contact Form', 'Submit', formObject.role || 'Unknown');
                
                // Show success message
                showFormSuccess();
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
                
            }, 2000);
        });
    }
    
    // Download executive brief functionality
    const downloadLinks = document.querySelectorAll('.download-link');
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Track download
            trackEvent('Executive Brief', 'Download', 'PDF');
            
            // Generate and download executive brief
            generateExecutiveBrief();
        });
    });
    
    // Calendar link functionality
    const calendarLinks = document.querySelectorAll('.calendar-link');
    calendarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default for external Calendly links
            if (link.href && link.href.includes('calendly.com')) {
                // Track calendar click and let it open normally
                trackEvent('Calendar', 'Click', 'Calendly Executive Meeting');
                return;
            }
            
            e.preventDefault();
            // Track calendar click
            trackEvent('Calendar', 'Click', 'Executive Meeting');
            
            // Show modal for other calendar links
            showCalendarModal();
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Track navigation
                trackEvent('Navigation', 'Scroll', targetId);
            }
        });
    });
}

// Scroll spy for active navigation
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section's nav link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });
}

// Analytics and tracking
function initAnalytics() {
    // Track page view
    trackEvent('Page', 'View', 'Executive Website');
    
    // Track scroll depth
    let maxScrollDepth = 0;
    let scrollDepthTracked = {
        25: false,
        50: false,
        75: false,
        100: false
    };
    
    window.addEventListener('scroll', function() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollDepth = Math.round((window.scrollY / scrollHeight) * 100);
        
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
        }
        
        // Track scroll milestones
        Object.keys(scrollDepthTracked).forEach(milestone => {
            if (scrollDepth >= milestone && !scrollDepthTracked[milestone]) {
                scrollDepthTracked[milestone] = true;
                trackEvent('Scroll Depth', `${milestone}%`, window.location.pathname);
            }
        });
    });
    
    // Track time on page
    let startTime = Date.now();
    let timeTracked = {
        30: false,
        60: false,
        120: false,
        300: false
    };
    
    setInterval(() => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        
        Object.keys(timeTracked).forEach(milestone => {
            if (timeOnPage >= milestone && !timeTracked[milestone]) {
                timeTracked[milestone] = true;
                trackEvent('Time on Page', `${milestone}s`, window.location.pathname);
            }
        });
    }, 10000);
    
    // Track section engagement
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionName = entry.target.id || entry.target.className;
                trackEvent('Section View', sectionName, 'Engagement');
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });
}

// Helper functions
function showFormSuccess() {
    // Create success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = 'Thank you! Your message has been sent successfully.';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function generateExecutiveBrief() {
    // In a real implementation, this would generate a PDF
    // For demo purposes, we'll create a detailed text summary
    
    const briefContent = `
EXECUTIVE BRIEF - Ramesh Nampelly

LEADERSHIP PROFILE
Engineering executive with 23+ years scaling global teams and driving innovation at Palo Alto Networks, Cisco, and Cohesity. Proven leader in cloud infrastructure, AI/ML platforms, and cybersecurity with 12 patents portfolio.

KEY ACHIEVEMENTS
• Global Team Leadership: Scaled organizations from startup to 110+ engineers across four countries
• Platform Innovation: 75% cost reduction and 400% performance improvements in enterprise platforms
• Executive Recognition: Cisco CEO Award and Outstanding Engineering Leadership Award
• Security Leadership: 12 patents (5 issued, 7 pending) and Acting CISO experience
• Operational Excellence: 99.9% SLA achievement across global infrastructure

CORE COMPETENCIES
• Platform Engineering & AI/ML Infrastructure
• Global Team Scaling & Leadership Development
• Cloud Infrastructure & DevSecOps
• Cost Optimization & Operational Excellence
• Digital Transformation Strategy

COMPANY EXPERIENCE
• Palo Alto Networks: AI/ML infrastructure and platform engineering leadership
• Cisco: Network automation and intent-based networking solutions
• Cohesity: Cloud infrastructure and dynamic provisioning platforms
• Advisory: Acting CISO and technical advisory positions

RECOGNITION
• Cisco CEO Award (2017) and Outstanding Engineering Leadership Award (2018)
• 12 Patents Portfolio in identity security and cloud platforms
• Bachelor of Engineering, Computer Science

TARGET OPPORTUNITIES
• Chief Technology Officer / VP Engineering roles
• Chief Information Security Officer positions
• Board advisor and technical advisory roles

CONTACT
Email: rnampell9@gmail.com | Phone: (+1) 408.636.3069
LinkedIn: linkedin.com/in/rameshnampelly | Calendar: calendly.com/rnampell9/30min
    `;
    
    // Create and download text file (in real implementation, this would be a PDF)
    const blob = new Blob([briefContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Ramesh_Nampelly_Executive_Brief.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show download notification
    showDownloadNotification();
}

function showDownloadNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.innerHTML = '<i class="fas fa-download"></i> Executive Brief downloaded successfully!';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

function showCalendarModal() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 16px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <h3 style="color: #2c3e50; margin-bottom: 1rem;">Schedule Executive Discussion</h3>
        <p style="color: #5a6c7d; margin-bottom: 2rem;">
            I'm available for strategic conversations about executive opportunities, 
            product leadership roles, and advisory positions.
        </p>
        <div style="margin-bottom: 2rem;">
            <strong>Available Meeting Types:</strong><br>
            • Executive Role Discussions (30-45 min)<br>
            • Board Advisory Consultations (60 min)<br>
            • Strategic Planning Sessions (90 min)
        </div>
        <p style="color: #5a6c7d; margin-bottom: 2rem;">
            <strong>Email:</strong> rnampell9@gmail.com<br>
            <strong>Phone:</strong> (+1) 408.636.3069<br>
            <strong>LinkedIn:</strong> linkedin.com/in/rameshnampelly<br>
            <strong>Calendar:</strong> <a href="https://calendly.com/rnampell9/30min" target="_blank" style="color: #ffd700; text-decoration: none;">calendly.com/rnampell9/30min</a>
        </p>
        <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
                style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                       color: white; border: none; padding: 12px 24px; 
                       border-radius: 8px; cursor: pointer; font-weight: 500;">
            Close
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
    
    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Analytics tracking function
function trackEvent(category, action, label) {
    // In a real implementation, this would integrate with Google Analytics, Mixpanel, etc.
    console.log('Analytics Event:', {
        category: category,
        action: action,
        label: label,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    });
    
    // Example integration with Google Analytics (uncomment when GA is set up)
    /*
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            custom_map: { dimension1: 'Executive Website' }
        });
    }
    */
}

// Performance optimization
function optimizeImages() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizeImages);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    trackEvent('Error', 'JavaScript', e.error.message);
});

// Export functions for testing (if in test environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initScrollAnimations,
        initContactForm,
        trackEvent
    };
}
