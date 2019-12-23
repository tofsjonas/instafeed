((document, window) => {
var instagram_api_src = 'https://api.instagram.com/v1/users/self/media/recent?';
var error_headline = 'Instagram feed failed 😞\n\n';
var error_msg_adblocker = 'Most likely due to an ad blocker...';
var caption_length = 120;
var default_img_width = 320;
var default_img_count = 20; // instagram api max
// export const screen_resolution = window.screen.width * window.devicePixelRatio
var min_fontsize = 12;
var max_fontsize = 18;

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
        // container.classList.add('loaded')
    }
    else {
        lazyImages.forEach(function (image) {
            unLazyImage(image);
        });
    }
};

// import { image_width, image_height, feed_container } from './vars'
var processResult = function (data, feed_container) {
    // data.meta.code will always be set, otherwise this function will not be called...
    if (data.meta.code === 200) {
        var data_resolution = feed_container.getAttribute('data-resolution');
        if (!data_resolution) {
            var image_size = parseFloat(feed_container.getAttribute('data-img-size')) || default_img_width;
            if (image_size > default_img_width) {
                data_resolution = 'hi';
            }
        }
        var links = feed_container.querySelectorAll('a:empty');
        data.data.forEach(function (element, i) {
            var link = links[i++];
            link.href = element.link;
            var str = '';
            var comments = element.comments.count || 0;
            var likes = element.likes.count || 0;
            var caption = element.caption ? element.caption.text.substr(0, caption_length).replace(/(?:\r\n|\r|\n)/g, '<br>') : '';
            var img_lazy = (data_resolution === 'hi') ? element.images.standard_resolution.url : element.images.low_resolution.url;
            str += '<img data-src="' + img_lazy + '" alt="" />';
            str += '<div class="info">';
            str += likes > 0 ? '<div class="likes">' + likes + '</div>' : '';
            str += comments > 0 ? '<div class="comments">' + comments + '</div>' : '';
            str += caption.length > 0 ? '<div class="caption">' + caption + '</div>' : '';
            str += '</div>';
            link.innerHTML = str;
        });
        links = feed_container.querySelectorAll('a:empty');
        links.forEach(function (element) {
            element.parentNode.removeChild(element);
        });
        lazyLoadImages(feed_container);
    }
    else {
        displayError('"' + data.meta.error_message + '"', feed_container);
    }
};
var mishaProcessResult = function (data, feed_container) {
    console.log('SPACETAG: mishaProcess.ts', data);
    processResult(data, feed_container);
    // var res = getProcessedData(data, feed_container)
    // feed_container.innerHTML = res.join('')
    // lazyLoadImages(feed_container)
};

var prepareContainer = function (feed_container, count) {
    var image_size = parseFloat(feed_container.getAttribute('data-img-size'));
    if (isNaN(image_size)) {
        image_size = default_img_width;
    }
    var font_size = image_size / 20;
    if (font_size < min_fontsize) {
        font_size = min_fontsize;
    }
    if (font_size > max_fontsize) {
        font_size = max_fontsize;
    }
    feed_container.style.fontSize = font_size + 'px';
    var str = '';
    for (var i = 0; i < count; i++) {
        str += '<a target="_blank" style="width:' + image_size + 'px;height:' + image_size + 'px"></a>';
    }
    feed_container.innerHTML = str;
};
var initFeeds = function () {
    window.instafunx = Object();
    var feeds = document.querySelectorAll('.instafeed:not(.loaded)');
    var _loop_1 = function (i) {
        var feed = feeds[i];
        if (feed.classList.contains('loaded'))
            return "continue";
        var token = feed.getAttribute('data-token') || '';
        var count = feed.getAttribute('data-count') || default_img_count;
        prepareContainer(feed, count);
        // continue
        var identifier = 'a' + (new Date() % 9e6).toString(36) + i;
        // const identifier = 'a' + (0 | (Math.random() * 9e6)).toString(36) + i
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
