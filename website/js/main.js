// Medical Transportation Business Website - JavaScript Functions

// Mobile Navigation Toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    navMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu if open
                document.querySelector('.nav-menu').classList.remove('active');
            }
        });
    });
}

// Update Active Navigation
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = '#' + section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    });
}

// Countdown Timer for Funding Deadline
function initCountdownTimer() {
    const deadline = new Date('2026-01-15T23:59:59').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = deadline - now;

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            if (timeLeft > 0) {
                countdownElement.innerHTML = `
                    <div class="countdown-item">
                        <span class="countdown-number">${days}</span>
                        <span class="countdown-label">Days</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number">${hours}</span>
                        <span class="countdown-label">Hours</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number">${minutes}</span>
                        <span class="countdown-label">Minutes</span>
                    </div>
                `;
            } else {
                countdownElement.innerHTML = '<div class="countdown-expired">Deadline has passed</div>';
            }
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
}

// Progress Tracking for Startup Guide
function initProgressTracking() {
    const checkboxes = document.querySelectorAll('.progress-checkbox');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');

    if (checkboxes.length === 0) return;

    // Load saved progress
    const savedProgress = localStorage.getItem('medicalTransportProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        checkboxes.forEach((checkbox, index) => {
            if (progress[index]) {
                checkbox.checked = true;
                updateStepVisual(checkbox);
            }
        });
    }

    // Update progress when checkboxes change
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateProgress();
            updateStepVisual(this);
            saveProgress();
        });
    });

    function updateProgress() {
        const total = checkboxes.length;
        const completed = Array.from(checkboxes).filter(cb => cb.checked).length;
        const percentage = Math.round((completed / total) * 100);

        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }

        if (progressText) {
            progressText.textContent = `${completed}/${total} completed (${percentage}%)`;
        }
    }

    function updateStepVisual(checkbox) {
        const stepItem = checkbox.closest('.step-item');
        if (stepItem) {
            if (checkbox.checked) {
                stepItem.style.opacity = '0.7';
                stepItem.style.backgroundColor = '#d4edda';
            } else {
                stepItem.style.opacity = '1';
                stepItem.style.backgroundColor = '';
            }
        }
    }

    function saveProgress() {
        const progress = Array.from(checkboxes).map(cb => cb.checked);
        localStorage.setItem('medicalTransportProgress', JSON.stringify(progress));
    }

    updateProgress();
}

// Animated Number Counting
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        counter.textContent = formatNumber(target);
                        clearInterval(timer);
                    } else {
                        counter.textContent = formatNumber(Math.floor(current));
                    }
                }, 16);

                observer.unobserve(counter);
            }
        });
    });

    counters.forEach(counter => {
        const originalText = counter.textContent;
        const number = originalText.replace(/[^0-9]/g, '');
        if (number) {
            counter.setAttribute('data-target', number);
            counter.textContent = '0';
            observer.observe(counter);
        }
    });
}

// Format Numbers with Commas and Suffixes
function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// ROI Calculator
function initROICalculator() {
    const calculator = document.getElementById('roi-calculator');
    if (!calculator) return;

    const investmentInput = document.getElementById('investment');
    const vehicleCountInput = document.getElementById('vehicle-count');
    const resultsDiv = document.getElementById('calculator-results');

    function calculateROI() {
        const investment = parseFloat(investmentInput.value) || 0;
        const vehicles = parseInt(vehicleCountInput.value) || 1;

        const revenuePerVehicle = 86400; // Conservative estimate
        const annualRevenue = revenuePerVehicle * vehicles;
        const operatingCosts = 73900 * vehicles; // Conservative estimate
        const netIncome = annualRevenue - operatingCosts;
        const roi = investment > 0 ? (netIncome / investment) * 100 : 0;

        resultsDiv.innerHTML = `
            <div class="calculator-result">
                <strong>Annual Revenue:</strong> $${annualRevenue.toLocaleString()}
            </div>
            <div class="calculator-result">
                <strong>Operating Costs:</strong> $${operatingCosts.toLocaleString()}
            </div>
            <div class="calculator-result">
                <strong>Net Income:</strong> $${netIncome.toLocaleString()}
            </div>
            <div class="calculator-result roi-highlight">
                <strong>ROI:</strong> ${roi.toFixed(1)}%
            </div>
        `;
    }

    investmentInput.addEventListener('input', calculateROI);
    vehicleCountInput.addEventListener('input', calculateROI);
    calculateROI(); // Initial calculation
}

// Contact Form Handler
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill out all fields.', 'warning');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'warning');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification('Thank you! Your message has been received.', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Email Validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#27ae60';
            break;
        case 'warning':
            notification.style.backgroundColor = '#f39c12';
            break;
        case 'error':
            notification.style.backgroundColor = '#e74c3c';
            break;
        default:
            notification.style.backgroundColor = '#3498db';
    }

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Hide notification after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScrolling();
    updateActiveNav();
    initCountdownTimer();
    initProgressTracking();
    initAnimatedCounters();
    initROICalculator();
    initContactForm();

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const navMenu = document.querySelector('.nav-menu');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Add fade-in animation to cards when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });

    document.querySelectorAll('.card, .timeline-item, .alert').forEach(el => {
        observer.observe(el);
    });
});

// Print function for specific sections
function printSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (!section) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>Medical Transportation Business - ${section.querySelector('h1, h2, h3')?.textContent || 'Report'}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                .card { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
                .table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                .table th, .table td { padding: 8px 12px; border: 1px solid #ddd; }
                .table th { background: #f5f5f5; }
                .alert { padding: 15px; margin: 15px 0; border-left: 4px solid #007bff; background: #f8f9fa; }
                h1, h2, h3 { color: #333; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>${section.innerHTML}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Export progress as text file
function exportProgress() {
    const checkboxes = document.querySelectorAll('.progress-checkbox:checked');
    const completedTasks = Array.from(checkboxes).map(cb => {
        return cb.nextElementSibling?.textContent || 'Task completed';
    });

    const report = `Medical Transportation Business Startup Progress Report
Generated: ${new Date().toLocaleDateString()}

Completed Tasks (${completedTasks.length}):
${completedTasks.map((task, index) => `${index + 1}. ${task}`).join('\n')}

Next Steps:
- Continue following the startup guide
- Monitor federal funding deadlines
- Maintain compliance documentation
- Track key performance metrics

For more information, visit: https://github.com/mikah33/medical
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-transport-progress-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Share functionality
function shareWebsite() {
    if (navigator.share) {
        navigator.share({
            title: 'Medical Transportation Business Analysis',
            text: 'Comprehensive business analysis for starting a medical transportation company in South Carolina',
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Website URL copied to clipboard!', 'success');
        });
    }
}