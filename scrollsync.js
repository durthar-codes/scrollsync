
var scrollSync = (function(){

    const useSmoothing = true;
    const keys = {
        name : 'data-scroll-sync',
        query : '[data-scroll-sync]',
        syncing : 'data-scroll-syncing',
        direction : 'data-scroll-sync-direction',
        method : 'data-scroll-sync-method'
    };

    function syncScroll(base, elem, left, top, method){
        var usePercent = method == 'percent';
        if(isSyncing(base) === 'false'){
            startSyncing(elem);
            if (left) {
                var newPos = usePercent ? (base.scrollLeft / base.offsetWidth) * (elem.offsetWidth) : base.scrollLeft;
                if (useSmoothing) {
                    if (newPos > elem.scrollLeft) {
                        for (let i = elem.scrollLeft; i <= newPos; i++) {
                            elem.scrollLeft = i;
                        }
                    }
                    else {
                        for (let i = elem.scrollLeft; i >= newPos; i--) {
                            elem.scrollLeft = i;
                        }
                    }
                }
                else {
                    elem.scrollLeft = newPos;
                }
            }
            if(top)
            {
                var newPos = usePercent ? (base.scrollTop / base.offsetHeight) * (elem.offsetHeight) : base.scrollTop;
                if(useSmoothing){
                    if (newPos > elem.scrollTop) {
                        for (let i = elem.scrollTop; i <= newPos; i++) {
                            elem.scrollTop = i;
                        }
                    }
                    else {
                        for (let i = elem.scrollTop; i >= newPos; i--) {
                            elem.scrollTop = i;
                        }
                    }
                }
                else {
                    elem.scrollTop = newPos;
                }
            }
        }
        stopSyncing(base);
    }

    function updateScrollPosition() {
        return function () {
            var elem = this;
            var toScroll = document.querySelectorAll(elem.getAttribute(keys.name));
            var directions = (elem.getAttribute(keys.direction) || 'both').split(','); //if no attribute, default to both
            var method = elem.getAttribute(keys.method);

            for (let i = 0; i < toScroll.length; i++) {
                const e = toScroll[i];
                const direction = directions[i] || directions[0];
                var left = direction.trim() === 'x' || direction.trim() === 'both';
                var top = direction.trim() === 'y' || direction.trim() === 'both';
                syncScroll(elem, e, left, top, method);
            }            
        }
    }

    function isSyncing(elem){
        var result = elem.getAttribute(keys.syncing);
        return result || 'false';
    }

    function startSyncing(elem){
        
        elem.setAttribute(keys.syncing, 'true');
    }

    function stopSyncing(elem){
        elem.setAttribute(keys.syncing, 'false');
    }
    
    //init
    var scrolls = document.querySelectorAll(keys.query);
    
    for (let i = 0; i < scrolls.length; i++) {
        var elem = scrolls[i];
        stopSyncing(elem); //init data-attr needed for cross-element syncing

        if (document.querySelector(elem.getAttribute(keys.name)))
            elem.addEventListener('scroll', updateScrollPosition());
    }

})();