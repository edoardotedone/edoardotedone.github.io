document.addEventListener('DOMContentLoaded', () => {

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => { revealObserver.observe(el); });
    }


    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const triggerImages = document.querySelectorAll('.project-main-img, .project-secondary-img');
    if (lightboxOverlay && lightboxImage && lightboxClose && triggerImages.length > 0) {
        const openLightbox = (src) => {
             if (!src) return;
             lightboxImage.setAttribute('src', src);
             lightboxOverlay.style.display = 'flex';
        };
        const closeLightbox = () => {
            lightboxOverlay.style.display = 'none';
            lightboxImage.setAttribute('src', '');
        };
        triggerImages.forEach(img => {
             img.addEventListener('click', (e) => {
                 e.preventDefault();
                 openLightbox(e.currentTarget.getAttribute('src'));
             });
        });
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxOverlay.addEventListener('click', (e) => {
             if (e.target === lightboxOverlay) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
             if (e.key === 'Escape' && lightboxOverlay.style.display === 'flex') closeLightbox();
        });
    } else { console.warn("Lightbox elements not found or no trigger images present."); }

});