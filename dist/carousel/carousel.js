export function carousel(container, resize_slide_to_container) {
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
    var resize_timer; // number does not work... :(
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
        // posInitial = items.offsetLeft Not precise enough
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
                // posInitial = items.offsetLeft // not enough precision
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
    // Mouse and Touch events
    items.addEventListener('touchstart', dragStart);
    items.addEventListener('mousedown', dragStart);
    // Button Click events
    prev.addEventListener('click', function () {
        shiftSlide(-1, null);
    });
    next.addEventListener('click', function () {
        shiftSlide(1, null);
    });
    // Transition events
    items.addEventListener('transitionend', checkIndex);
    build();
}
