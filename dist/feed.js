((document, window) => {
var current_script = document.currentScript; // "any" is the only one I can get to work... :(
var feed_id = current_script.getAttribute('data-id') || 'instafeed';
var feed_container = document.getElementById(feed_id);
var css_ref = current_script.getAttribute('src').replace(/(\.min)*\.js$/, '$1.css');
var image_count = current_script.getAttribute('data-count') || 4; // max 20?
var image_width = current_script.getAttribute('data-img-size') || 320; // 320x319 = instagram's default size is seems
var image_height = image_width - 1;
var instagram_token = current_script.getAttribute('data-token');
var instagram_api_src = 'https://api.instagram.com/v1/users/self/media/recent?access_token=' + instagram_token + '&count=' + image_count + '&callback=mishaProcessResult';
var fontawesome_href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';

// https://gist.github.com/AllThingsSmitty/716e8b64f04fbf4d21c3c63e54d4a487
var initFontAwesome = function () {
    function css(element, property) {
        return window.getComputedStyle(element, null).getPropertyValue(property);
    }
    var span = document.createElement('span');
    span.className = 'fa';
    span.style.display = 'none';
    document.body.insertBefore(span, document.body.firstChild);
    if (css(span, 'font-family').toLowerCase() !== 'fontawesome') {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = fontawesome_href;
        document.head.appendChild(link);
    }
    document.body.removeChild(span);
};

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
var displayError = function (message) {
    feed_container.setAttribute('data-error-if', 'Instagram feed failed 😞<br>' + message);
};

var getProcessedData = function (data) {
    // data.meta.code will always be set, otherwise this function will not be called...
    var result = [];
    if (data.meta.code === 200) {
        data.data.forEach(function (element) {
            var str = '';
            var comments = element.comments.count || 0;
            var likes = element.likes.count || 0;
            var caption = element.caption ? element.caption.text.substr(0, 120).replace(/(?:\r\n|\r|\n)/g, '<br>') : '';
            var img_lazy = element.images.low_resolution.url;
            str += '<a target="_blank" href="' + element.link + '" style="width:' + image_width + 'px;height:' + image_height + 'px ">';
            str += '<img data-lazy-if="' + img_lazy + '" alt="" width="' + image_width + '" height="' + image_height + '" />';
            str += '<div class="info-if">';
            str += likes > 0 ? '<div class="likes-if">' + likes + '</div>' : '';
            str += comments > 0 ? '<div class="comments-if">' + comments + '</div>' : '';
            str += caption.length > 0 ? '<div class="caption-if">' + caption + '</div>' : '';
            str += '</div>';
            str += '</a>';
            result.push(str);
        });
    }
    else {
        displayError('"' + data.meta.error_message + '"');
    }
    return result;
    // throw new Error('"' + data.meta.error_message + '"')
};
// export const mishaProcessCarousel = (data?: Array<string>) => {
//   //place them in containers based on count...
//   var str = '<div class="carousel">' + getProcessedData(data) + '</div>'
// }
var mishaProcessDefault = function (data) {
    feed_container.innerHTML = getProcessedData(data).join('');
};

var unLazyImage = function (img) {
    img.onload = function () {
        img.removeAttribute('data-lazy-if');
    };
    img.src = img.getAttribute('data-lazy-if');
};
var getLazyImages = function () {
    return [].slice.call(feed_container.querySelectorAll('img'));
};
var unLazyInstant = function () {
    var lazyImages = getLazyImages();
    lazyImages.forEach(function (image) {
        unLazyImage(image);
    });
    feed_container.classList.add('loaded');
};
var unLazyObserved = function () {
    if ('IntersectionObserver' in window) {
        var lazyImages = getLazyImages();
        // Create new observer object
        // let lazyImageObserver = new IntersectionObserver((entries, observer) => { // observer isn't used...
        // let lazyImageObserver = new IntersectionObserver((entries: Array<HTMLImageElement>) => { // doesn't compile
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
        feed_container.classList.add('loaded');
    }
    else {
        unLazyInstant();
    }
};

// type initProps = {
//   callback: Function
// }
// const initFeed = ({ callback }: initProps) => {
var init = function (callback) {
    feed_container.style.minWidth = image_width + 'px';
    feed_container.style.minHeight = image_height + 'px';
    var feed_script_element = document.createElement('script');
    // useless in safari...
    // feed_script_element.addEventListener('error', function(e: any) {
    //   e.preventDefault()
    //   displayError(error_msg_adblocker)
    // })
    // feed_script_element.onerror = (e: any) => {
    //   e.preventDefault()
    //   displayError(error_msg_adblocker)
    //   // throw new Error(error_adblocker)
    // }
    feed_script_element.onload = function () {
        callback();
    };
    feed_script_element.setAttribute('src', instagram_api_src);
    var feed_css_link = document.createElement('link');
    feed_css_link.rel = 'stylesheet';
    feed_css_link.href = css_ref;
    feed_css_link.onload = function () {
        document.body.appendChild(feed_script_element);
    };
    document.head.appendChild(feed_css_link);
};

// import { handleErrors } from './handleErrors'
window.addEventListener('DOMContentLoaded', function () {
    // window.onload =  () => { // should load faster with 'DOMContentLoaded'
    // handleErrors()
    initFontAwesome();
    // "async", unLazyObserved has to be done AFTER it has been loaded
    // window['mishaProcessResult'] = mishaProcessDefault
    window['mishaProcessResult'] = mishaProcessDefault;
    init(unLazyObserved);
});
})(document, window)
