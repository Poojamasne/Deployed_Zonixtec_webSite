// /* ============================================================= */
// /* navbar.js – Mobile menu + dropdown handling (no hover on mobile) */
// /* ============================================================= */
// document.addEventListener("DOMContentLoaded", () => {
//   const mobileBtn = document.querySelector(".mobile-menu-btn");
//   const navLinks = document.querySelector(".nav-links");
//   const hamburger = mobileBtn?.querySelectorAll(".hamburger-line") || [];
//   const dropdowns = document.querySelectorAll(".dropdown");
//   const body = document.body;

//   /* ---------- 1. Mobile menu toggle ---------- */
//   const toggleMenu = () => {
//     const open = navLinks.classList.toggle("active");
//     mobileBtn?.setAttribute("aria-expanded", open);
//     body.classList.toggle("mobile-menu-open", open);

//     // Hamburger → X
//     hamburger.forEach((line, i) => {
//       if (i === 0)
//         line.style.transform = open ? "rotate(45deg) translate(6px,6px)" : "";
//       if (i === 1) line.style.opacity = open ? "0" : "1";
//       if (i === 2)
//         line.style.transform = open ? "rotate(-45deg) translate(7px,-7px)" : "";
//     });
//   };
//   mobileBtn?.addEventListener("click", toggleMenu);

//   /* ---------- 2. Close menu on link click (mobile) ---------- */
//   document.querySelectorAll(".nav-links a").forEach((a) => {
//     a.addEventListener("click", () => {
//       if (window.innerWidth <= 768 && navLinks.classList.contains("active")) {
//         navLinks.classList.remove("active");
//         mobileBtn?.setAttribute("aria-expanded", "false");
//         body.classList.remove("mobile-menu-open");
//         resetHamburger();
//       }
//     });
//   });

//   /* ---------- 3. Mobile dropdown (click) ---------- */
//   dropdowns.forEach((d) => {
//     const toggle = d.querySelector(".dropdown-toggle") || d.querySelector("a");
//     toggle?.addEventListener("click", (e) => {
//       if (window.innerWidth <= 768) {
//         e.preventDefault();
//         const isActive = d.classList.toggle("active");
//         // close others
//         dropdowns.forEach((o) => {
//           if (o !== d) o.classList.remove("active");
//         });
//       }
//     });
//   });

//   /* ---------- 4. Close dropdowns when clicking outside ---------- */
//   document.addEventListener("click", (e) => {
//     if (
//       !e.target.closest(".dropdown") &&
//       !e.target.closest(".mobile-menu-btn")
//     ) {
//       dropdowns.forEach((d) => d.classList.remove("active"));
//     }
//   });

//   /* ---------- 5. Reset hamburger ---------- */
//   const resetHamburger = () => {
//     hamburger.forEach((l) => {
//       l.style.transform = "";
//       l.style.opacity = "1";
//     });
//   };

//   /* ---------- 6. Resize handling ---------- */
//   let rTimer;
//   window.addEventListener("resize", () => {
//     clearTimeout(rTimer);
//     rTimer = setTimeout(() => {
//       if (window.innerWidth > 768) {
//         navLinks.classList.remove("active");
//         body.classList.remove("mobile-menu-open");
//         dropdowns.forEach((d) => d.classList.remove("active"));
//         resetHamburger();
//       }
//     }, 150);
//   });

//   /* ---------- 7. ESC key closes everything ---------- */
//   document.addEventListener("keydown", (e) => {
//     if (e.key === "Escape") {
//       navLinks.classList.remove("active");
//       body.classList.remove("mobile-menu-open");
//       dropdowns.forEach((d) => d.classList.remove("active"));
//       resetHamburger();
//     }
//   });
// });

// // ZONIXTEC NAVBAR JAVASCRIPT - FIXED VERSION

// document.addEventListener("DOMContentLoaded", function () {
//   // Get navbar elements
//   const header = document.getElementById("header");
//   const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
//   const navLinks = document.querySelector(".nav-links");
//   const dropdowns = document.querySelectorAll(".dropdown");
//   const body = document.body;

//   // Create and append mobile overlay
//   const mobileOverlay = document.createElement("div");
//   mobileOverlay.classList.add("mobile-overlay");
//   body.appendChild(mobileOverlay);

//   // Header scroll effect
//   window.addEventListener("scroll", function () {
//     if (window.scrollY > 50) {
//       header.classList.add("scrolled");
//     } else {
//       header.classList.remove("scrolled");
//     }
//   });

//   // Toggle mobile menu function
//   function toggleMobileMenu() {
//     const isActive = navLinks.classList.contains("active");

//     if (isActive) {
//       // Close menu
//       navLinks.classList.remove("active");
//       mobileMenuBtn.classList.remove("active");
//       mobileOverlay.classList.remove("active");
//       body.classList.remove("menu-open");

//       // Close all dropdowns when menu closes
//       dropdowns.forEach((dropdown) => {
//         dropdown.classList.remove("active");
//       });
//     } else {
//       // Open menu
//       navLinks.classList.add("active");
//       mobileMenuBtn.classList.add("active");
//       mobileOverlay.classList.add("active");
//       body.classList.add("menu-open");
//     }
//   }

//   // Mobile menu button click
//   if (mobileMenuBtn) {
//     mobileMenuBtn.addEventListener("click", function (e) {
//       e.stopPropagation();
//       toggleMobileMenu();
//     });
//   }

//   // Close menu when clicking overlay
//   mobileOverlay.addEventListener("click", function () {
//     toggleMobileMenu();
//   });

//   // Close menu when clicking outside (on mobile)
//   document.addEventListener("click", function (e) {
//     if (window.innerWidth <= 768) {
//       const isClickInsideNav = navLinks.contains(e.target);
//       const isClickOnMenuBtn = mobileMenuBtn.contains(e.target);
//       const isMenuOpen = navLinks.classList.contains("active");

//       if (isMenuOpen && !isClickInsideNav && !isClickOnMenuBtn) {
//         toggleMobileMenu();
//       }
//     }
//   });

//   // Mobile dropdown toggle
//   dropdowns.forEach((dropdown) => {
//     const dropdownToggle = dropdown.querySelector(".dropdown-toggle");

//     if (dropdownToggle) {
//       dropdownToggle.addEventListener("click", function (e) {
//         if (window.innerWidth <= 768) {
//           e.preventDefault();
//           e.stopPropagation();

//           // Close other dropdowns
//           dropdowns.forEach((otherDropdown) => {
//             if (otherDropdown !== dropdown) {
//               otherDropdown.classList.remove("active");
//             }
//           });

//           // Toggle current dropdown
//           dropdown.classList.toggle("active");
//         }
//       });
//     }
//   });

//   // Close menu when clicking on a link (except dropdown toggles)
//   const menuLinks = navLinks.querySelectorAll("a:not(.dropdown-toggle)");
//   menuLinks.forEach((link) => {
//     link.addEventListener("click", function () {
//       if (window.innerWidth <= 768) {
//         toggleMobileMenu();
//       }
//     });
//   });

//   // Handle window resize
//   let resizeTimer;
//   window.addEventListener("resize", function () {
//     clearTimeout(resizeTimer);
//     resizeTimer = setTimeout(function () {
//       if (window.innerWidth > 768) {
//         // Close mobile menu on desktop
//         navLinks.classList.remove("active");
//         mobileMenuBtn.classList.remove("active");
//         mobileOverlay.classList.remove("active");
//         body.classList.remove("menu-open");

//         // Close all dropdowns
//         dropdowns.forEach((dropdown) => {
//           dropdown.classList.remove("active");
//         });
//       }
//     }, 250);
//   });

//   // Prevent dropdown content clicks from closing menu
//   const dropdownContents = document.querySelectorAll(".dropdown-content");
//   dropdownContents.forEach((content) => {
//     content.addEventListener("click", function (e) {
//       e.stopPropagation();
//     });
//   });

//   // Keyboard navigation - ESC to close menu
//   document.addEventListener("keydown", function (e) {
//     if (e.key === "Escape") {
//       if (navLinks.classList.contains("active")) {
//         toggleMobileMenu();
//       }
//     }
//   });

//   // Make toggleMobileMenu globally accessible
//   window.toggleMobileMenu = toggleMobileMenu;

//   console.log("✅ Navbar initialized successfully");
// });

// // Smooth scroll for anchor links
// document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
//   anchor.addEventListener("click", function (e) {
//     const href = this.getAttribute("href");

//     // Only prevent default if it's a valid anchor (not just #)
//     if (href !== "#" && href !== "javascript:void(0);") {
//       e.preventDefault();
//       const target = document.querySelector(href);

//       if (target) {
//         const headerHeight = document.getElementById("header").offsetHeight;
//         const targetPosition =
//           target.getBoundingClientRect().top +
//           window.pageYOffset -
//           headerHeight;

//         window.scrollTo({
//           top: targetPosition,
//           behavior: "smooth",
//         });
//       }
//     }
//   });
// });


/* ============================================================ */
/* ZONIXTEC NAVBAR JS - COMPLETE FIXED VERSION */
/* ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
    // ========== Get Elements ==========
    const header = document.getElementById('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');
    const body = document.body;
    const hamburgerLines = document.querySelectorAll('.hamburger-line');

    // ========== Create Mobile Overlay ==========
    let mobileOverlay = document.querySelector('.mobile-overlay');
    if (!mobileOverlay) {
        mobileOverlay = document.createElement('div');
        mobileOverlay.classList.add('mobile-overlay');
        body.appendChild(mobileOverlay);
    }

    // ========== Header Scroll Effect ==========
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });

    // ========== Toggle Mobile Menu Function ==========
    function toggleMobileMenu() {
        const isActive = navLinks?.classList.contains('active');
        
        if (isActive) {
            // Close menu
            navLinks?.classList.remove('active');
            mobileMenuBtn?.classList.remove('active');
            mobileOverlay?.classList.remove('active');
            body.classList.remove('menu-open');
            mobileMenuBtn?.setAttribute('aria-expanded', 'false');
            
            // Close all dropdowns
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        } else {
            // Open menu
            navLinks?.classList.add('active');
            mobileMenuBtn?.classList.add('active');
            mobileOverlay?.classList.add('active');
            body.classList.add('menu-open');
            mobileMenuBtn?.setAttribute('aria-expanded', 'true');
        }
    }

    // ========== Mobile Menu Button Click ==========
    mobileMenuBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // ========== Close Menu - Overlay Click ==========
    mobileOverlay?.addEventListener('click', function() {
        if (navLinks?.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // ========== Close Menu - Click Outside ==========
    document.addEventListener('click', function(e) {
        // Only on mobile
        if (window.innerWidth <= 768) {
            const isClickInsideNav = navLinks?.contains(e.target);
            const isClickOnMenuBtn = mobileMenuBtn?.contains(e.target);
            const isMenuOpen = navLinks?.classList.contains('active');

            if (isMenuOpen && !isClickInsideNav && !isClickOnMenuBtn) {
                toggleMobileMenu();
            }
        }
    });

    // ========== Dropdown Handling ==========
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        
        if (dropdownToggle) {
            // Desktop: Hover (CSS handles showing)
            // Mobile: Click to toggle
            dropdownToggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    // Mobile: Toggle dropdown
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('active');
                } else {
                    // Desktop: Allow navigation to Services.html
                    const href = dropdownToggle.getAttribute('href');
                    if (href && href !== '#' && href !== 'javascript:void(0);') {
                        // Let the link navigate naturally
                        window.location.href = href;
                    }
                }
            });

            // Desktop: Show dropdown on hover (additional JS support)
            if (window.innerWidth > 768) {
                dropdown.addEventListener('mouseenter', function() {
                    dropdown.classList.add('hover');
                });

                dropdown.addEventListener('mouseleave', function() {
                    dropdown.classList.remove('hover');
                });
            }
        }
    });

    // ========== Close Menu on Link Click (Mobile) ==========
    const menuLinks = navLinks?.querySelectorAll('a:not(.dropdown-toggle)');
    menuLinks?.forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('href');
            const isValidLink = href && href !== '#' && href !== 'javascript:void(0);';
            
            if (window.innerWidth <= 768 && isValidLink) {
                // Small delay to allow click to register
                setTimeout(() => {
                    toggleMobileMenu();
                }, 100);
            }
        });
    });

    // ========== Prevent Dropdown Content Clicks from Closing Menu ==========
    // const dropdownContents = document.querySelectorAll('.dropdown-content');
    // dropdownContents.forEach(content => {
    //     content.addEventListener('click', function(e) {
    //         e.stopPropagation();
    //     });
    // });

    // ========== Window Resize Handler ==========
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                // Reset everything on desktop
                navLinks?.classList.remove('active');
                mobileMenuBtn?.classList.remove('active');
                mobileOverlay?.classList.remove('active');
                body.classList.remove('menu-open');
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            }
        }, 150);
    });

    // ========== ESC Key - Close Everything ==========
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (navLinks?.classList.contains('active')) {
                toggleMobileMenu();
            }
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });

    // ========== Make Toggle Function Global ==========
    window.toggleMobileMenu = toggleMobileMenu;

    console.log('✅ Navbar initialized successfully');
});

/* ============================================================ */
/* SMOOTH SCROLL FOR ANCHOR LINKS */
/* ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only handle valid anchors
        if (href && href !== '#' && href !== 'javascript:void(0);' && !href.includes('javascript:')) {
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});