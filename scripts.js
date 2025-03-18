document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animations on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .download-card, .faq-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialize card states
    const cards = document.querySelectorAll('.feature-card, .download-card, .faq-item');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run on initial load
    setTimeout(animateOnScroll, 100);
    
    // Add scroll listener
    window.addEventListener('scroll', animateOnScroll);
    
    // Version update based on date
    const versionElement = document.querySelector('.footer-copyright p');
    if (versionElement) {
        const currentYear = new Date().getFullYear();
        versionElement.textContent = `© ${currentYear} FLAC Converter. MIT License.`;
    }
});
