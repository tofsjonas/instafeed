// https://rudrastyh.com/instagram/get-photos-and-profile-info-pure-javascript.html

// eslint-disable-next-line no-extra-semi
;((document, window) => {
  var feed_container = document.getElementById('instafeed')
  var token = document.currentScript.getAttribute('data-token') || console.log('Instagram token missing...')
  var size = document.currentScript.getAttribute('data-img-size') || 320 // 320x319 = instagram's default size is seems
  var count = document.currentScript.getAttribute('data-count') || 4 // max 20?
  var api_src = 'https://api.instagram.com/v1/users/self/media/recent?access_token=' + token + '&count=' + count + '&callback=mishaProcessResult'
  var style = 'style="width:' + size + 'px;height:' + (size - 1) + 'px "'
  var css_link = document.createElement('link')
  var script_element = document.createElement('script')
  css_link.rel = 'stylesheet'
  css_link.href = document.currentScript.src.replace(/(\.min)*\.js$/, '$1.css')
  script_element.setAttribute('src', api_src)
  script_element.onerror = () => {
    handleError('...most likely due to an Ad blocker...')
  }

  const initFeed = () => {
    document.head.appendChild(css_link)
    document.body.appendChild(script_element)
  }
  const handleError = str => {
    feed_container.innerHTML = 'Instagram feed failed 😞<br>' + str
  }

  // check if Fontawesome is loaded
  // https://gist.github.com/AllThingsSmitty/716e8b64f04fbf4d21c3c63e54d4a487
  const initFontAwesome = () => {
    function css(element, property) {
      return window.getComputedStyle(element, null).getPropertyValue(property)
    }
    var span = document.createElement('span')
    span.className = 'fa'
    span.style.display = 'none'
    document.body.insertBefore(span, document.body.firstChild)
    if (css(span, 'font-family').toLowerCase() !== 'fontawesome') {
      var link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
      document.head.appendChild(link)
    }
    document.body.removeChild(span)
  }
  window.mishaProcessResult = function(data) {
    // if (data.meta && data.meta.code === 200) {
    if (data.meta.code === 200) {
      var str = ''
      for (var i = 0; i < data.data.length; i++) {
        var element = data.data[i]
        // var likes = element.likes && element.likes.count ? element.likes.count : 0
        // var comments = element.comments && element.comments.count ? element.comments.count : 0
        var comments = element.comments.count || 0
        var likes = element.likes.count || 0
        var caption = element.caption ? element.caption.text.substr(0, 120).replace(/(?:\r\n|\r|\n)/g, '<br>') : ''
        // var img_src = element.images && element.images.low_resolution && element.images.low_resolution.url
        var img_src = element.images.low_resolution.url

        str += '<a target="_blank" href="' + element.link + '" ' + style + '>'
        str += '<img src="' + img_src + '" alt="" ' + style + ' />'
        str += '<div class="info">'
        str += likes > 0 ? '<div class="likes">' + likes + '</div>' : ''
        str += comments > 0 ? '<div class="comments">' + comments + '</div>' : ''
        str += caption.length > 0 ? '<div class="caption">' + caption + '</div>' : ''
        str += '</div>'
        str += '</a>'
      }
      feed_container.innerHTML = str
    } else {
      handleError('"' + data.meta.error_message + '"')
      // console.log('SPACETAG: feed.js', data.meta)
    }
  }

  window.onload = function() {
    initFontAwesome()
    initFeed()
  }
})(document, window)
