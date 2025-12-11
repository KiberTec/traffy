// ===== TRAFFY Website JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initAnimations();
    initContactForm();
    initCounters();
});

// ===== Header Scroll Effect =====
function initHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const burger = document.getElementById('burger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Scroll Animations =====
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger animation for children
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    child.style.animationDelay = `${index * 0.1}s`;
                    child.classList.add('animate-in');
                });
            }
        });
    }, observerOptions);
    
    // Add animation classes to elements
    const animatedElements = [
        '.service-card',
        '.step',
        '.case-card',
        '.about-feature',
        '.faq-item',
        '.section-header',
        '.monetize-text',
        '.earnings-card',
        '.contact-info',
        '.contact-form'
    ];
    
    animatedElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('animate-element');
            observer.observe(el);
        });
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-element {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-element.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .service-card:nth-child(1) { transition-delay: 0s; }
        .service-card:nth-child(2) { transition-delay: 0.1s; }
        .service-card:nth-child(3) { transition-delay: 0.2s; }
        .service-card:nth-child(4) { transition-delay: 0.3s; }
        .service-card:nth-child(5) { transition-delay: 0.4s; }
        .service-card:nth-child(6) { transition-delay: 0.5s; }
        .service-card:nth-child(7) { transition-delay: 0.6s; }
        .service-card:nth-child(8) { transition-delay: 0.7s; }
        
        .step:nth-child(1) { transition-delay: 0s; }
        .step:nth-child(2) { transition-delay: 0.15s; }
        .step:nth-child(3) { transition-delay: 0.3s; }
        .step:nth-child(4) { transition-delay: 0.45s; }
        
        .case-card:nth-child(1) { transition-delay: 0s; }
        .case-card:nth-child(2) { transition-delay: 0.15s; }
        .case-card:nth-child(3) { transition-delay: 0.3s; }
        
        .about-feature:nth-child(1) { transition-delay: 0s; }
        .about-feature:nth-child(2) { transition-delay: 0.1s; }
        .about-feature:nth-child(3) { transition-delay: 0.2s; }
        .about-feature:nth-child(4) { transition-delay: 0.3s; }
    `;
    document.head.appendChild(style);
}

// ===== Contact Form =====
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = `
                <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32">
                        <animate attributeName="stroke-dashoffset" dur="1s" values="32;0" repeatCount="indefinite"/>
                    </circle>
                </svg>
                <span>Отправляем...</span>
            `;
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Заявка отправлена!</span>
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            
            // Reset form
            form.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });
    }
}

// ===== Animated Counters =====
function initCounters() {
    const counters = document.querySelectorAll('.stat-number, .case-stat-value');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const text = element.innerText;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const hasDollar = text.includes('$');
    const hasRuble = text.includes('₽');
    const hasM = text.includes('M');
    const hasK = text.includes('K');
    
    // Extract number
    let number = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(number)) return;
    
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (number - startValue) * easeProgress;
        
        let displayValue = currentValue;
        
        // Format number
        if (hasM || hasK) {
            displayValue = currentValue.toFixed(currentValue < 10 ? 1 : 0);
        } else if (hasDollar && currentValue < 1) {
            displayValue = currentValue.toFixed(2);
        } else if (hasPercent) {
            displayValue = Math.round(currentValue);
        } else {
            displayValue = Math.round(currentValue).toLocaleString();
        }
        
        // Reconstruct text
        let result = '';
        if (hasDollar) result += '$';
        result += displayValue;
        if (hasM) result += 'M';
        if (hasK) result += 'K';
        if (hasRuble) result += '₽';
        if (hasPercent) result += '%';
        if (hasPlus) result += '+';
        
        element.innerText = result;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ===== Parallax Effect =====
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 20;
        const xOffset = (x - 0.5) * speed;
        const yOffset = (y - 0.5) * speed;
        shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
});

// ===== FAQ Accordion Enhancement =====
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
        if (item.open) {
            // Close other items
            document.querySelectorAll('.faq-item').forEach(other => {
                if (other !== item && other.open) {
                    other.open = false;
                }
            });
        }
    });
});

// ===== Typing Effect for Hero Title =====
function initTypingEffect() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    
    // Optional: Add typing cursor effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ===== Service Cards Tilt Effect =====
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== Preloader (optional) =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

