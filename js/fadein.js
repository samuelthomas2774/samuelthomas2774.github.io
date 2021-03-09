class FadeInOnScroll {
    constructor(target, scrollingElement) {
        this.time = 500;

        this.target = target ?? document;
        this.window = window;
        this.scrollingElement = scrollingElement ?? document.scrollingElement;
        this.fixedHeader = this.target.getElementsByTagName('nav')[0];

        for (const el of this.target.getElementsByClassName('fade-out-on-scroll')) {
            el.style.display = 'block';
        }
    }

    refresh(animate = true) {
        const headerheight = this.fixedHeader.clientHeight || 0;
        const scrolltop = this.scrollingElement.scrollTop + headerheight;
        const windowheight = this.window.innerHeight - headerheight;
        const scrollbottom = scrolltop + windowheight;

        const triggerbottom = scrollbottom - (windowheight * 0.1);
        const triggeroffset = scrolltop > windowheight * 2 ? triggerbottom :
            Math.min(this.scrollingElement.scrollTop * 2, triggerbottom);

        for (const el of this.target.querySelectorAll('.fade-in-on-scroll, .done-fade-in-on-scroll')) {
            if (!el.classList.contains('done-fade-in-on-scroll')) {
                const offset = el.getClientRects()[0].top + this.scrollingElement.scrollTop;
                if (triggeroffset < offset) continue;

                el.classList.remove('fade-in-on-scroll');
                el.classList.add('done-fade-in-on-scroll');
                if (animate) {
                    el.classList.add('fade-in-on-scroll-animate');
                }
            } else {
                const offset = el.getClientRects()[0].top + this.scrollingElement.scrollTop;

                if (offset < scrollbottom) continue;

                el.classList.add('fade-in-on-scroll');
                el.classList.remove('done-fade-in-on-scroll');
                el.classList.remove('fade-in-on-scroll-animate');
            }
        }

        for (const el of this.target.querySelectorAll('.fade-out-on-scroll, .done-fade-out-on-scroll')) {
            if (!el.classList.contains('done-fade-out-on-scroll')) {
                const offset = el.getClientRects()[0].top + this.scrollingElement.scrollTop;

                if (triggeroffset < offset) continue;

                el.classList.remove('fade-out-on-scroll');
                el.classList.add('done-fade-out-on-scroll');
                if (animate) {
                    el.classList.add('fade-out-on-scroll-animate');
                    $(el).animate({
                        'opacity': 0,
                    }, this.time, () => {
                        el.classList.remove('fade-out-on-scroll-animate');
                    });
                    if (!FadeInOnScroll.prefersReducedMotion.matches) $(el).slideUp(this.time);
                } else {
                    el.style.display = 'none';
                    el.style.opacity = 0;
                }
            } else {
                const rect = el.getClientRects()[0] ??
                    el.nextElementSibling?.getClientRects?.()?.[0] ??
                    el.parentElement.getClientRects()[0];
                const offset = rect.top + this.scrollingElement.scrollTop;

                if (offset < scrollbottom) continue;

                $(el).stop();
                el.classList.remove('done-fade-out-on-scroll');
                el.classList.remove('fade-out-on-scroll-animate');
                el.classList.add('fade-out-on-scroll');
                el.style.display = 'block';
                el.style.opacity = 1;
            }
        }
    }

    reset() {
        for (const el of this.target.getElementsByClassName('done-fade-in-on-scroll')) {
            el.classList.remove('done-fade-in-on-scroll');
            el.classList.remove('fade-in-on-scroll-animate');
            el.classList.add('fade-in-on-scroll');
        }

        for (const el of this.target.getElementsByClassName('done-fade-out-on-scroll')) {
            $(el).stop();
            el.classList.remove('done-fade-out-on-scroll');
            el.classList.remove('fade-out-on-scroll-animate');
            el.classList.add('fade-out-on-scroll');
            el.style.display = 'block';
            el.style.opacity = 1;
        }
    }
}

FadeInOnScroll.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion)');

$.fadein = new FadeInOnScroll(document);

let fadein_refresh_timeout = null;
function requestRefresh() {
    if (fadein_refresh_timeout !== null) return;

    fadein_refresh_timeout = setTimeout(() => {
        $.fadein.refresh();
        fadein_refresh_timeout = null;
    }, 0);
}

document.addEventListener('scroll', requestRefresh);
document.addEventListener('touchmove', requestRefresh);
window.addEventListener('hashchange', requestRefresh);
$.fadein.refresh(false);

for (const link of document.querySelectorAll('.reset-scrolling-animation-link')) {
    link.addEventListener('click', ev => {
        ev.preventDefault();
        $.fadein.reset();
    });
}
for (const link of document.querySelectorAll('.scroll-to-top-link')) {
    link.addEventListener('click', ev => {
        ev.preventDefault();
        document.scrollingElement.scrollTop = 0;
    });
}
for (const link of document.querySelectorAll('.delete-url-hash-link')) {
    link.addEventListener('click', ev => {
        ev.preventDefault();
        history.pushState(null, null, window.location.pathname + window.location.search);
    });
}
