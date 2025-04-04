document.addEventListener('DOMContentLoaded', () => {

    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // If the element is intersecting the viewport
                if (entry.isIntersecting) {
                    // Add the 'is-visible' class to the wrapper element
                    entry.target.classList.add('is-visible');
                    // Stop observing this element after it has become visible
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of the element is visible
            // rootMargin: '0px 0px -50px 0px' // Optional: Trigger slightly before it's fully in view
        });

        // Observe each element marked for scroll reveal
        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }
    

});