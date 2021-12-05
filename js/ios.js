(() => {
    const ios = [
        'iPad', 'iPad Simulator',
        'iPhone', 'iPhone Simulator',
        'iPod', 'iPod Simulator',
    ].includes(navigator.platform) || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

    if (ios) {
        document.documentElement.classList.add('ios');
    }
})();
