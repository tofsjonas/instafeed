((document, window) => {
var instagram_api_src = 'https://api.instagram.com/v1/users/self/media/recent?';
var error_headline = 'Instagram feed failed 😞\n\n';
var error_msg_adblocker = 'Most likely due to an ad blocker...';
var default_img_count = 20;
var default_img_rows = 2;
var break_point_3 = 600;
var break_point_4 = 900;
var break_point_5 = 1200;

var mishaProcessResult = function (data) {
    var res = [];
    var span = document.createElement('span');
    if (data['meta']['code'] === 200) {
        data.data.forEach(function (element) {
            var comments = element['comments']['count'] || 0;
            var likes = element['likes']['count'] || 0;
            var caption = element['caption'] ? element['caption']['text'].replace(/(?:\r\n|\r|\n)/g, '<br>') : '';
            var img_lazy = element['images']['standard_resolution']['url'];
            var str = '<a href="' + element['link'] + '">';
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
    var resizeContainerToSlide = function () {
        posInitial = 0;
        slideWidth = firstSlide.getBoundingClientRect().width;
        console.log('SPACETAG: carousel.ts resizeContainerToSlide', slideWidth, firstSlide.offsetWidth);
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
    var build_timer;
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
        shiftSlide(-1);
    });
    next.addEventListener('click', function () {
        shiftSlide(1);
    });
    items.addEventListener('transitionend', checkIndex);
    build();
}

var instafeed = function (container) {
    if (container.classList.contains('prep')) {
        return;
    }
    var images = [];
    var displayError = function (message) {
        container.setAttribute('data-error', error_headline + message);
    };
    var prepareFeedContainer = function () {
        var tmp = '<div class="wrapper"><div class="items"></div></div>';
        tmp += '<button class="left"></button>';
        tmp += '<button class="right"></button>';
        container.innerHTML = tmp;
    };
    prepareFeedContainer();
    var token = container.getAttribute('data-token') || '';
    var count = container.getAttribute('data-count') || default_img_count;
    var rows = parseInt(container.getAttribute('data-rows')) || default_img_rows;
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
        var width = window.innerWidth;
        var cols = 2;
        var images = ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'];
        if (width > break_point_3) {
            cols = 3;
        }
        if (width > break_point_4) {
            cols = 4;
        }
        if (width > break_point_5) {
            cols = 5;
        }
        var number_of_images_per_slide = rows * cols;
        if (number_of_images_per_slide != current_number_of_images_per_slide) {
            current_number_of_images_per_slide = number_of_images_per_slide;
            var item_container = container.querySelector('.items');
            item_container.innerHTML = '';
            var div = document.createElement('div');
            images.forEach(function (image, index) {
                var nisse = Math.floor(index / current_number_of_images_per_slide);
                if (index > 0 && index % current_number_of_images_per_slide == 0) {
                    item_container.appendChild(div);
                    div = document.createElement('div');
                }
                var pelle = document.createElement('a');
                pelle.appendChild(document.createTextNode('hej ' + nisse));
                div.appendChild(pelle);
            });
            item_container.appendChild(div);
        }
    };
    var resize_timer;
    window.addEventListener('resize', function () {
        clearTimeout(resize_timer);
        resize_timer = setTimeout(populate, 150);
    });
    populate();
    window.instafunx[identifier] = function (a) {
        try {
            images = mishaProcessResult(a);
            populate();
        }
        catch (error) {
            displayError(error.message);
        }
    };
    container.className += ' prep';
    carousel(container, true);
};

window['instafunx'] = Object();
window['instafeed'] = instafeed;
})(document, window)
