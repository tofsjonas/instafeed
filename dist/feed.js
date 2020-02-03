((document, window) => {
var instagram_api_src = 'https://api.instagram.com/v1/users/self/media/recent?';
var error_headline = 'Instagram feed failed 😞\n\n';
var error_msg_adblocker = 'Most likely due to an ad blocker...';
var default_header = 'Follow us on Instagram';
var default_img_count = 20;
var default_img_rows = 2;
var default_img_cols = 2;
var column_breakpoint_start = 600;
var column_breakpoint_step = 600;

var mishaProcessResult = function (data) {
    var res = [];
    var span = document.createElement('span');
    if (data['meta']['code'] === 200) {
        data['data'].forEach(function (element) {
            var comments = element['comments']['count'] || 0;
            var likes = element['likes']['count'] || 0;
            var caption = element['caption'] ? element['caption']['text'].replace(/(?:\r\n|\r|\n)/g, '<br>') : '';
            var img_lazy = element['images']['standard_resolution']['url'];
            var str = '<a target="_blank" href="' + element['link'] + '">';
            str += '<img data-src="' + img_lazy + '" alt="" />';
            str += '<div class="info">';
            str += likes > 0 ? '<div class="likes">' + likes + '</div>' : '';
            str += comments > 0 ? '<div class="comments">' + comments + '</div>' : '';
            str += caption.length > 0 ? '<div class="caption">' + caption + '</div>' : '';
            str += '</div>';
            str += '</a>';
            span.innerHTML = str;
            res.push(span.firstElementChild);
        });
    }
    else {
        throw '"' + data['meta']['error_message'] + '"';
    }
    return res;
};

function carousel(container, resize_slide_to_container) {
    var wrapper = container.children[0];
    var prev = container.children[1];
    var next = container.children[2];
    var items = wrapper.children[0];
    var posX1 = 0;
    var posX2 = 0;
    var posInitial = 0;
    var posFinal;
    var threshold = 100;
    var slides;
    var slidesLength;
    var firstSlide;
    var slideWidth;
    var lastSlide;
    var firstClone;
    var lastClone;
    var index;
    var allowShift;
    var build_in_progress = false;
    var build_timer;
    var resize_timer;
    var resizing_in_progress = true;
    var build = function () {
        container.classList.remove('loaded');
        build_in_progress = true;
        index = 0;
        allowShift = true;
        slides = items.children;
        slidesLength = slides.length;
        firstSlide = slides[0];
        slideWidth = firstSlide.getBoundingClientRect().width;
        lastSlide = slides[slidesLength - 1];
        firstClone = firstSlide.cloneNode(true);
        lastClone = lastSlide.cloneNode(true);
        items.insertBefore(lastClone, firstSlide);
        items.appendChild(firstClone);
        resizeContainer();
        setTimeout(function () {
            build_in_progress = false;
            container.classList.add('loaded');
        }, 5);
    };
    var dragStart = function (e) {
        e = e || window.event;
        e.preventDefault();
        var temp = window.getComputedStyle(items);
        posInitial = parseFloat(temp.getPropertyValue('left'));
        if (e.type == 'touchstart') {
            posX1 = e.touches[0].clientX;
        }
        else {
            posX1 = e.clientX;
            window.addEventListener('mouseup', dragEnd);
            window.addEventListener('mousemove', dragAction);
            window.addEventListener('touchend', dragEnd);
            window.addEventListener('touchmove', dragAction);
        }
    };
    var dragAction = function (e) {
        e = e || window.event;
        if (e.type == 'touchmove') {
            posX2 = posX1 - e.touches[0].clientX;
            posX1 = e.touches[0].clientX;
        }
        else {
            posX2 = posX1 - e.clientX;
            posX1 = e.clientX;
        }
        items.style.left = items.offsetLeft - posX2 + 'px';
    };
    var dragEnd = function () {
        posFinal = items.offsetLeft;
        if (Math.abs(posFinal - posInitial) > 5) {
            window.addEventListener('click', noClick);
        }
        if (posFinal - posInitial < -threshold) {
            shiftSlide(1, 'drag');
        }
        else if (posFinal - posInitial > threshold) {
            shiftSlide(-1, 'drag');
        }
        else {
            items.style.left = posInitial + 'px';
        }
        window.removeEventListener('mouseup', dragEnd);
        window.removeEventListener('mousemove', dragAction);
        window.removeEventListener('touchend', dragEnd);
        window.removeEventListener('touchmove', dragAction);
        setTimeout(function () {
            window.removeEventListener('click', noClick);
        }, 10);
    };
    var shiftSlide = function (dir, action) {
        if (resizing_in_progress) {
            return;
        }
        items.classList.add('shifting');
        if (allowShift) {
            if (!action) {
                var temp = window.getComputedStyle(items);
                posInitial = parseFloat(temp.getPropertyValue('left'));
            }
            if (dir == 1) {
                items.style.left = posInitial - slideWidth + 'px';
                index++;
            }
            else if (dir == -1) {
                items.style.left = posInitial + slideWidth + 'px';
                index--;
            }
        }
        allowShift = false;
    };
    var checkIndex = function () {
        items.classList.remove('shifting');
        if (index == -1) {
            items.style.left = -(slidesLength * slideWidth) + 'px';
            index = slidesLength - 1;
        }
        if (index == slidesLength) {
            items.style.left = -(1 * slideWidth) + 'px';
            index = 0;
        }
        allowShift = true;
    };
    var noClick = function (e) {
        e.preventDefault();
    };
    var resizeContainerToSlide = function () {
        posInitial = 0;
        slideWidth = firstSlide.getBoundingClientRect().width;
        container.style.width = slideWidth + 'px';
        items.style.left = '-' + slideWidth + 'px';
    };
    var resizeSlideToContainer = function () {
        posInitial = 0;
        slideWidth = container.getBoundingClientRect().width;
        var slideHeight = container.getBoundingClientRect().height;
        var slides = items.children;
        for (var i = 0; i < slides.length; i++) {
            var slide = slides[i];
            slide.style.width = slideWidth + 'px';
            slide.style.height = slideHeight + 'px';
        }
        items.style.left = '-' + slideWidth + 'px';
    };
    var resizeContainer = function () {
        if (resize_slide_to_container) {
            resizeSlideToContainer();
        }
        else {
            resizeContainerToSlide();
        }
        resizing_in_progress = false;
    };
    window.addEventListener('resize', function () {
        resizing_in_progress = true;
        clearTimeout(resize_timer);
        resize_timer = setTimeout(resizeContainer, 150);
    });
    var observer = new MutationObserver(function () {
        if (!build_in_progress) {
            clearTimeout(build_timer);
            build_timer = setTimeout(build, 10);
        }
    });
    observer.observe(items, { subtree: true, childList: true });
    items.addEventListener('touchstart', dragStart);
    items.addEventListener('mousedown', dragStart);
    prev.addEventListener('click', function () {
        shiftSlide(-1, null);
    });
    next.addEventListener('click', function () {
        shiftSlide(1, null);
    });
    items.addEventListener('transitionend', checkIndex);
    build();
}

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

var instafeed = function (container) {
    if (container.classList.contains('prep')) {
        return;
    }
    var dataset = container.dataset;
    var token = dataset['token'] || '';
    var count = +dataset['count'] || default_img_count;
    var rows = +dataset['rows'] || default_img_rows;
    if (typeof container.dataset['header'] == 'undefined') {
        container.dataset['header'] = default_header;
    }
    container.innerHTML = '<div class="wrapper"><div class="items"></div></div><button class="left"></button><button class="right"></button>';
    var images = [];
    var displayError = function (message) {
        container.setAttribute('data-error', error_headline + message);
    };
    var item_container = container.querySelector('.items');
    var identifier = 'a' + (0 | (Math.random() * 9e6)).toString(36);
    var api_src = instagram_api_src;
    api_src += 'access_token=' + token;
    api_src += '&count=' + count;
    api_src += '&callback=window.instafunx.' + identifier;
    var api_script = document.createElement('script');
    api_script.setAttribute('src', api_src);
    api_script.onerror = function () {
        displayError(error_msg_adblocker);
    };
    var current_number_of_images_per_slide = 0;
    var populate = function () {
        var width = container.offsetWidth;
        var cols = +container.dataset['cols'] || default_img_cols;
        var start = column_breakpoint_start;
        while (start < width) {
            start += column_breakpoint_step;
            cols++;
        }
        container.style.setProperty('padding-bottom', 100 * (rows / cols) + '%');
        item_container.style.setProperty('grid-template-rows', 'repeat(' + rows + ', 1fr)');
        var number_of_images_per_slide = rows * cols;
        var number_of_slides = Math.floor(images.length / number_of_images_per_slide);
        var total_number_of_slide_elements = number_of_images_per_slide * number_of_slides;
        if (number_of_images_per_slide != current_number_of_images_per_slide) {
            current_number_of_images_per_slide = number_of_images_per_slide;
            item_container.innerHTML = '';
            var div2;
            for (var i = 0; i < total_number_of_slide_elements; i++) {
                if (i == 0 || i % number_of_images_per_slide == 0) {
                    div2 = document.createElement('div');
                    div2.style.setProperty('grid-template-columns', 'repeat(' + cols + ', 1fr)');
                    item_container.appendChild(div2);
                }
                div2.appendChild(images[i]);
            }
        }
    };
    var resize_timer;
    window.addEventListener('resize', function () {
        clearTimeout(resize_timer);
        resize_timer = setTimeout(populate, 150);
    });
    window.instafunx[identifier] = function (a) {
        try {
            images = mishaProcessResult(a);
            populate();
            carousel(container, true);
        }
        catch (error) {
            displayError(error.message);
        }
        lazyLoadImages(container);
    };
    container.className += ' prep';
    document.body.appendChild(api_script);
};

var css_link = document.createElement('link');
css_link.rel = 'stylesheet';
css_link.href = document['currentScript']['src'].replace(/(\.min)*\.js$/, '$1.css');
document['head'].appendChild(css_link);
window['instafunx'] = Object();
var run = function () {
    var feeds = document.querySelectorAll('.instafeed:not(.prep)');
    for (var i = 0; i < feeds.length; i++) {
        var feed = feeds[i];
        instafeed(feed);
    }
};
run();
window['instafeed'] = run;
})(document, window)
