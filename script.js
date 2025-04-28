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


    function matchMainItemHeights() {
        const container = document.querySelector('.main-items-container');
        if (!container) {
            return;
         }

        const firstImageItem = container.querySelector('.main-image-item');
        const videoItem = container.querySelector('.main-video-item');

        if (firstImageItem && videoItem) {
            const targetHeight = firstImageItem.offsetHeight;

            if (targetHeight > 0) {
                 videoItem.style.height = `${targetHeight}px`;
            } else {
                // Target image height is 0px, likely not rendered/loaded yet.
                // Image load listener should handle this.
            }
        } else {
             // Could not find reference image item or video item.
        }
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

    const debouncedMatchHeights = debounce(matchMainItemHeights, 150);

    window.addEventListener('resize', debouncedMatchHeights);

    const crucialImages = document.querySelectorAll('.main-image-item .project-main-img');
    let imagesToLoad = crucialImages.length;

    if (imagesToLoad === 0) {
        matchMainItemHeights();
    } else {
        crucialImages.forEach(img => {
            if (img.complete) {
                imagesToLoad--;
            } else {
                img.addEventListener('load', () => {
                    imagesToLoad--;
                    if (imagesToLoad === 0) {
                        matchMainItemHeights();
                    }
                }, { once: true });

                 img.addEventListener('error', () => {
                     // Image failed to load, proceed anyway
                     imagesToLoad--;
                      if (imagesToLoad === 0) {
                        matchMainItemHeights();
                     }
                 }, { once: true });
            }
        });

        if (imagesToLoad === 0) {
             matchMainItemHeights();
        }
    }

});