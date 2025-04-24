document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll Reveal Code ---
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
    // --- End Scroll Reveal Code ---


    // --- Lightbox Code ---
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.getElementById('lightbox-close');
    const triggerImages = document.querySelectorAll('.project-main-img, .project-secondary-img');
    if (lightboxOverlay && lightboxImage && lightboxClose && triggerImages.length > 0) {
        const openLightbox = (src) => { /* ... (lightbox open logic) ... */
             if (!src) return;
             lightboxImage.setAttribute('src', src);
             lightboxOverlay.style.display = 'flex';
        };
        const closeLightbox = () => { /* ... (lightbox close logic) ... */
            lightboxOverlay.style.display = 'none';
            lightboxImage.setAttribute('src', '');
        };
        triggerImages.forEach(img => { /* ... (lightbox trigger logic) ... */
             img.addEventListener('click', (e) => {
                 e.preventDefault();
                 openLightbox(e.currentTarget.getAttribute('src'));
             });
        });
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxOverlay.addEventListener('click', (e) => { /* ... (overlay close logic) ... */
             if (e.target === lightboxOverlay) closeLightbox();
        });
        document.addEventListener('keydown', (e) => { /* ... (escape key logic) ... */
             if (e.key === 'Escape' && lightboxOverlay.style.display === 'flex') closeLightbox();
        });
    } else { console.warn("Lightbox elements not found or no trigger images present."); }
    // --- End Lightbox Code ---


    // --- NEW/UPDATED: Match Video Height to Image Height ---
    function matchMainItemHeights() {
        const container = document.querySelector('.main-items-container');
        if (!container) {
            console.log("Height Match: Container not found.");
            return;
         }

        // Use the first image item as the reference for height
        const firstImageItem = container.querySelector('.main-image-item');
        const videoItem = container.querySelector('.main-video-item');

        if (firstImageItem && videoItem) {
            // Get the computed height of the image item
            // offsetHeight includes padding and borders, which is usually what we want
            const targetHeight = firstImageItem.offsetHeight;

            // Apply the height ONLY if it's positive (image has rendered)
            if (targetHeight > 0) {
                 videoItem.style.height = `${targetHeight}px`;
                // console.log(`Height Match: Set video item height to ${targetHeight}px`); // Uncomment for debugging
            } else {
                // If height is 0, maybe the image isn't loaded/rendered yet.
                // The image load listener below should handle this.
                console.warn("Height Match: Target image height is 0px.");
                 // Reset height if previously set and calculation failed
                 // videoItem.style.height = '';
            }
        } else {
             console.warn("Height Match: Could not find reference image item or video item.");
        }
    }

    // --- Debouncer function ---
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

    // Create a debounced version of the height matching function
    const debouncedMatchHeights = debounce(matchMainItemHeights, 150); // 150ms delay

    // Run matching on window resize
    window.addEventListener('resize', debouncedMatchHeights);

    // --- Run matching after crucial images are loaded ---
    const crucialImages = document.querySelectorAll('.main-image-item .project-main-img');
    let imagesToLoad = crucialImages.length;

    if (imagesToLoad === 0) {
         console.log("Height Match: No crucial images found, running initial match.");
        // If no images, run once initially (DOM ready)
        matchMainItemHeights();
    } else {
        crucialImages.forEach(img => {
            // Check if image is already loaded/cached
            if (img.complete) {
                imagesToLoad--;
            } else {
                img.addEventListener('load', () => {
                    imagesToLoad--;
                    if (imagesToLoad === 0) {
                         console.log("Height Match: All crucial images loaded, running match.");
                        matchMainItemHeights(); // Run when all are loaded
                    }
                }, { once: true }); // Run listener only once per image

                 img.addEventListener('error', () => {
                     console.error("Height Match: Image failed to load:", img.src);
                     imagesToLoad--; // Still count it as processed
                      if (imagesToLoad === 0) {
                        matchMainItemHeights(); // Run even if some failed
                     }
                 }, { once: true });
            }
        });

        // If all images were already complete/cached initially
        if (imagesToLoad === 0) {
             console.log("Height Match: All crucial images were already loaded/cached, running initial match.");
             matchMainItemHeights();
        }
    }
    // --- End of Height Matching Code ---

}); // End of DOMContentLoaded