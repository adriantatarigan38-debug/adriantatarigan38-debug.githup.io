

// 1.- Animasi halus saat klik menu
document.addEventListener('DOMContentLoaded', function() {
    // Ambil semua link navigasi yang punya href dimulai dengan #
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Smooth scroll ke target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// 2.- Elemen muncul perlahan saat discroll
function revealOnScroll() {
    const elements = document.querySelectorAll('.portfolio-item, .skill-card, .edu-item, .hobby-card, .contact-item');
    
    elements.forEach(element => {
        // Posisi elemen relatif terhadap viewport
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        
        // Cek apakah elemen terlihat di layar
        if (elementTop < windowHeight - 50 && elementBottom > 0) {
            element.classList.add('revealed');
        }
    });
}

// 3. NAVBAR BERUBAH SAAT SCROLL
function handleNavbarOnScroll() {
    const navbar = document.querySelector('.navbar');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
}

// 4. HIGHLIGHT MENU AKTIF BERDASARKAN SCROLL POSITION
function highlightActiveMenu() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // Offset
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            // Hapus class active dari semua menu
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Tambah class active ke menu yang sesuai
            const activeLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// 5. ANIMASI LOADING AWAL
function initialAnimation() {
    // Hero section fade in
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButton = document.querySelector('.btn-primary');
    
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        setTimeout(() => {
            heroTitle.style.transition = 'all 1s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 200);
    }
    
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(30px)';
        setTimeout(() => {
            heroSubtitle.style.transition = 'all 1s ease';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 400);
    }
    
    if (heroButton) {
        heroButton.style.opacity = '0';
        setTimeout(() => {
            heroButton.style.transition = 'all 1s ease';
            heroButton.style.opacity = '1';
        }, 600);
    }
}

// 6. BACK TO TOP BUTTON (Opsional)
function createBackToTopButton() {
    // Buat tombol jika belum ada
    if (!document.querySelector('.back-to-top')) {
        const btn = document.createElement('button');
        btn.innerHTML = '↑';
        btn.className = 'back-to-top';
        btn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(btn);
        
        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Tampilkan/sembunyikan tombol berdasarkan scroll
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
}

// 7. INITIALIZE SEMUA FUNCTION SAAT HALAMAN DIMUAT
window.addEventListener('load', function() {
    // Set initial state untuk scroll reveal
    const elements = document.querySelectorAll('.portfolio-item, .skill-card, .edu-item, .hobby-card, .contact-item');
    elements.forEach(element => {
        element.classList.add('reveal-init');
    });
    
    // Jalankan animasi awal
    initialAnimation();
    
    // Cek elemen yang terlihat saat pertama kali load
    setTimeout(revealOnScroll, 100);
    
    // Buat back to top button
    createBackToTopButton();
});

// 8. EVENT LISTENER UNTUK SCROLL
window.addEventListener('scroll', function() {
    revealOnScroll();
    handleNavbarOnScroll();
    highlightActiveMenu();
    createBackToTopButton();
});

// 9. EVENT LISTENER UNTUK RESIZE (Responsive)
window.addEventListener('resize', function() {
    // Re-check reveal on resize
    revealOnScroll();
});