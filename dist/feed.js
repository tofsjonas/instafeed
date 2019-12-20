((document, window) => {
var instagram_api_src = 'https://api.instagram.com/v1/users/self/media/recent?';
var error_headline = 'Instagram feed failed 😞\n\n';
var error_msg_adblocker = 'Most likely due to an ad blocker...';
var caption_length = 120;

// import { feed_container } from './vars'
// does not work in safari. surprise. NO custom errors!
// export const handleErrors = () => {
//   window.addEventListener('error', function(e: any) {
//     if (current_script.src === e.filename) {
//       e.preventDefault()
//       feed_container.innerHTML = 'Instagram feed failed 😞<br>' + e.message
//     }
//     e.preventDefault()
//   })
// }
var displayError = function (message, container) {
    container.setAttribute('data-error', error_headline + message);
};

// import { feed_container } from './vars'
var unLazyImage = function (img) {
    img.onload = function () {
        img.removeAttribute('data-src');
    };
    img.src = img.getAttribute('data-src');
};
var lazyLoadImages = function (container) {
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
        // lazyImageObserver.observe(lazyImages)
        lazyImages.forEach(function (image) {
            lazyImageObserver_1.observe(image);
        });
        container.classList.add('loaded');
    }
    else {
        lazyImages.forEach(function (image) {
            unLazyImage(image);
        });
    }
};

// import { image_width, image_height, feed_container } from './vars'
var getProcessedData = function (data, feed_container) {
    var result = [];
    // data.meta.code will always be set, otherwise this function will not be called...
    if (data.meta.code === 200) {
        var image_size = parseFloat(feed_container.getAttribute('data-img-size'));
        if (isNaN(image_size) || image_size > 320) {
            image_size = 320;
        }
        var font_size = image_size / 20;
        feed_container.style.fontSize = font_size + 'px';
        data.data.forEach(function (element) {
            var str = '';
            var comments = element.comments.count || 0;
            var likes = element.likes.count || 0;
            var caption = element.caption ? element.caption.text.substr(0, caption_length).replace(/(?:\r\n|\r|\n)/g, '<br>') : '';
            var img_lazy = element.images.low_resolution.url;
            str += '<a target="_blank" href="' + element.link + '">';
            str += '<img data-src="' + img_lazy + '" alt="" />';
            str += '<div class="info">';
            str += likes > 0 ? '<div class="likes">' + likes + '</div>' : '';
            str += comments > 0 ? '<div class="comments">' + comments + '</div>' : '';
            str += caption.length > 0 ? '<div class="caption">' + caption + '</div>' : '';
            str += '</div>';
            str += '</a>';
            result.push(str);
        });
    }
    else {
        displayError('"' + data.meta.error_message + '"', feed_container);
    }
    return result;
};
var mishaProcessResult = function (data, feed_container) {
    var res = getProcessedData(data, feed_container);
    feed_container.innerHTML = res.join('');
    lazyLoadImages(feed_container);
};

// const prepareContainer = (container) => {
// }
var initFeeds = function () {
    window.instafunx = Object();
    var feeds = document.querySelectorAll('.instafeed:not(.initialized)');
    var _loop_1 = function (i) {
        var feed = feeds[i];
        if (feed.classList.contains('loaded'))
            return "continue";
        var token = feed.getAttribute('data-token') || '';
        var count = feed.getAttribute('data-count') || 20;
        var identifier = 'a' +
            Math.random()
                .toString(36)
                .slice(-5) +
            i;
        api_src = instagram_api_src;
        api_src += 'access_token=' + token;
        api_src += '&count=' + count;
        api_src += '&callback=window.instafunx.' + identifier;
        var api_script = document.createElement('script');
        api_script.setAttribute('src', api_src);
        api_script.onerror = function () {
            feed.classList.add('loaded');
            displayError(error_msg_adblocker, feed);
        };
        window.instafunx[identifier] = function (a) {
            feed.classList.add('loaded');
            mishaProcessResult(a, feed);
        };
        document.body.appendChild(api_script);
    };
    var api_src;
    for (var i = 0; i < feeds.length; i++) {
        _loop_1(i);
    }
};

window['instafeed'] = function () {
    initFeeds();
};
})(document, window)
