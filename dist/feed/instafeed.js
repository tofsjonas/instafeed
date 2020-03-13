import { instagram_api_src, error_msg_adblocker, error_headline, default_headline, default_img_count, default_img_cols, default_img_rows, column_breakpoint_start, column_breakpoint_step } from './vars';
import { mishaProcessResult } from './mishaProcess';
import { carousel } from '../carousel/carousel';
import { lazyLoadImages } from './lazyLoadImages';
export var instafeed = function (currentScript) {
    var parent = currentScript.parentNode;
    var container = document.createElement('DIV');
    container.className = 'jInstafeed';
    parent.insertBefore(container, currentScript);
    var dataset = currentScript.dataset;
    var token = dataset['token'] || ''; // will raise error later on, handled
    var count = +dataset['count'] || default_img_count;
    var rows = +dataset['rows'] || default_img_rows;
    if (typeof dataset['headline'] == 'undefined') {
        container.dataset['headline'] = default_headline;
    }
    else {
        container.dataset['headline'] = dataset['headline'];
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
    api_src += '&callback=window.jinstafunx.' + identifier;
    var api_script = document.createElement('script');
    api_script.setAttribute('src', api_src);
    api_script.onerror = function () {
        displayError(error_msg_adblocker);
    };
    var current_number_of_images_per_slide = 0;
    var populate = function () {
        var container_width = container.offsetWidth;
        var cols = +container.dataset['cols'] || default_img_cols;
        var start = column_breakpoint_start;
        while (start < container_width) {
            start += column_breakpoint_step;
            cols++;
        }
        // The grid behaves strangly otherwise, with twisted images
        var image_width = container_width / cols;
        images.forEach(function (i) {
            i.style.width = image_width + 'px';
            i.style.height = image_width + 'px';
        });
        container.style.setProperty('padding-bottom', 100 * (rows / cols) + '%');
        item_container.style.setProperty('grid-template-rows', 'repeat(' + rows + ', 1fr)');
        var number_of_images_per_slide = rows * cols;
        var number_of_slides = Math.floor(images.length / number_of_images_per_slide);
        var total_number_of_slide_elements = number_of_images_per_slide * number_of_slides;
        if (number_of_images_per_slide != current_number_of_images_per_slide) {
            current_number_of_images_per_slide = number_of_images_per_slide;
            item_container.innerHTML = '';
            var slide;
            for (var i = 0; i < total_number_of_slide_elements; i++) {
                if (i == 0 || i % number_of_images_per_slide == 0) {
                    slide = document.createElement('DIV');
                    slide.style.setProperty('grid-template-columns', 'repeat(' + cols + ', 1fr)');
                    item_container.appendChild(slide);
                }
                slide.appendChild(images[i]);
            }
        }
    };
    var resize_timer;
    window.addEventListener('resize', function () {
        clearTimeout(resize_timer);
        resize_timer = setTimeout(populate, 150);
    });
    window['jinstafunx'][identifier] = function (a) {
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
