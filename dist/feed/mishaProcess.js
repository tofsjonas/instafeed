export var mishaProcessResult = function (data) {
    var res = [];
    var span = document.createElement('span');
    // data.meta.code will always be set, otherwise this function will not be called...
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
