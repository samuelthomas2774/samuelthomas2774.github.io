
(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion)');
    const backgroundElement = document.getElementsByClassName('background')[0];

    function refresh() {
        const scrolltop = -document.scrollingElement.scrollTop;
        const offset = scrolltop / 5;

        if (prefersReducedMotion.matches) {
            return;
        }

        backgroundElement.style.backgroundPosition = `center ${offset}px`;
    }

    document.addEventListener('scroll', refresh);
    refresh();
})();
