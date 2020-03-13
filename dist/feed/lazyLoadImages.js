var unLazyImage = function (img) {
    img.onload = function () {
        img.removeAttribute('data-src');
    };
    img.src = img.dataset['src'];
};
export var lazyLoadImages = function (container) {
    var lazyImages = [].slice.call(container.querySelectorAll('[data-src]'));
    if ('IntersectionObserver' in window) {
        var lazyImageObserver_1 = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var lazyImage = entry.target;
                    unLazyImage(lazyImage);
                    lazyImageObserver_1.unobserve(lazyImage);
                }
            });
        });
        lazyImages.forEach(function (image) {
            lazyImageObserver_1.observe(image);
        });
    }
    else {
        lazyImages.forEach(function (image) {
            unLazyImage(image);
        });
    }
};
