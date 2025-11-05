// Navbar JavaScript - Mobile Menu Toggle and Scroll Effects

// Toggle mobile menu
window.toggleMobileMenu = function() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const body = document.body;
    
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.classList.toggle('active');
    }
    
    // Prevent body scroll when menu is open
    body.classList.toggle('menu-open');
};

// Mobile dropdown toggle
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (toggle) {
            toggle.addEventListener('click', function(e) {
                // Only toggle on mobile
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-links a:not(.dropdown-toggle)');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                const navLinksContainer = document.querySelector('.nav-links');
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                
                if (navLinksContainer) {
                    navLinksContainer.classList.remove('active');
                }
                if (mobileMenuBtn) {
                    mobileMenuBtn.classList.remove('active');
                }
                document.body.classList.remove('menu-open');
            }
        });
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Close mobile menu when resizing to desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const dropdowns = document.querySelectorAll('.dropdown');
        
        if (navLinks) {
            navLinks.classList.remove('active');
        }
        if (mobileMenuBtn) {
            mobileMenuBtn.classList.remove('active');
        }
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        document.body.classList.remove('menu-open');
    }
});
