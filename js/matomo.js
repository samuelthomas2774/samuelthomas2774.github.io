window._paq = window._paq || [];

// Tracker methods like "setCustomDimension" should be called before "trackPageView"
_paq.push([ 'trackPageView' ]);
_paq.push([ 'enableLinkTracking' ]);

(function() {
    var url = 'https://matomo.fancy.org.uk';
    _paq.push([ 'setTrackerUrl', url + '/piwik.php' ]);
    _paq.push([ 'setSiteId', '3' ]);

    var script = document.createElement('script'),
        firstscript = document.getElementsByTagName('script')[0];

    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = url + '/piwik.js';

    firstscript.parentNode.insertBefore(script, firstscript);
})();
