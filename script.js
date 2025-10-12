document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay'); // Get the new overlay element
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    const contactForm = document.getElementById('contactForm');

    // --- Header Scroll Effect ---
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Hero Content Animation ---
    const heroContent = document.querySelector('.hero-content');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 1s ease-out';
            }
        });
    });

    if (heroContent) {
        observer.observe(heroContent);
    }
    
    // --- Modern Mobile Navigation Logic (NEW) ---
    function openMenu() {
        navLinks.classList.add('active');
        mobileToggle.classList.add('active');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevents scrolling of the page behind
    }

    function closeMenu() {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enables scrolling
    }

    mobileToggle.addEventListener('click', () => {
        // Check if the menu is already active to decide whether to open or close
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when clicking on the overlay or a nav link
    navOverlay.addEventListener('click', closeMenu);
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = header.classList.contains('scrolled') ? 70 : 82;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Product Carousel Logic ---
    let currentIndex = 0;
    const products = document.querySelectorAll('.product-card');
    const totalProducts = products.length;
    let productsPerView = getProductsPerView();

    function getProductsPerView() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    let totalSlides = Math.ceil(totalProducts / productsPerView);

    function createDots() {
        dotsContainer.innerHTML = '';
        totalSlides = Math.ceil(totalProducts / productsPerView); // Recalculate total slides
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function updateCarousel() {
        const cardWidth = products[0].offsetWidth + 20; // +20 for margin
        const offset = -currentIndex * cardWidth * productsPerView;
        carouselTrack.style.transform = `translateX(${offset}px)`;
        updateDots();
    }

    function goToSlide(index) {
        currentIndex = index;
        if (currentIndex >= totalSlides) {
            currentIndex = totalSlides -1;
        }
        if (currentIndex < 0) {
            currentIndex = 0;
        }
        updateCarousel();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    let autoplayInterval = setInterval(nextSlide, 4000);
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carouselContainer.addEventListener('mouseleave', () => autoplayInterval = setInterval(nextSlide, 4000));

    window.addEventListener('resize', () => {
        productsPerView = getProductsPerView();
        currentIndex = 0;
        createDots();
        updateCarousel();
    });

    createDots();

    // --- Contact Form Submission ---
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        alert(`Thank you, ${name}! Your inquiry has been received. We'll get back to you at ${email} soon.`);
        contactForm.reset();
    });

    // --- Fade-in Animations for Sections ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const newobserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-card, .product-card, .contact-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        newobserver.observe(el);
    });

    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.stat-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.stat-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
});



document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault(); // prevent default form submission

    const phoneNumber = '+919681850870'; // your WhatsApp number with country code (India example)
    const name = encodeURIComponent(document.getElementById('name').value.trim());
    const email = encodeURIComponent(document.getElementById('email').value.trim());
    const message = encodeURIComponent(document.getElementById('message').value.trim());

    const whatsappMessage = `*New Inquiry from Website*%0AName: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

    // Open WhatsApp chat in new tab or redirect
    window.open(whatsappURL, '_blank');
});
