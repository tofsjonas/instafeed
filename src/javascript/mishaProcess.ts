// import { image_width, image_height, feed_container } from './vars'
import { displayError } from './errorHandler'
import { caption_length, default_img_width } from './vars'
import { lazyLoadImages } from './lazyLoadImages'
type dataElement = {
  link: string,
  comments: {
    count: number
  },
  likes: {
    count: number
  },
  caption: {
    text: string
  },
  images: {
    low_resolution: {
      url: string
    }
  }
}

const getProcessedData = (data: any, feed_container: HTMLElement): Array<string> => {
  var result: Array<string> = []
  // data.meta.code will always be set, otherwise this function will not be called...
  if (data.meta.code === 200) {
    var image_size = parseFloat(feed_container.getAttribute('data-img-size'))
    if (isNaN(image_size) || image_size > default_img_width) {
      image_size = default_img_width
    }
    var font_size = image_size / 20

    feed_container.style.fontSize = font_size + 'px'
    data.data.forEach((element: dataElement) => {
      var str = ''
      var comments = element.comments.count || 0
      var likes = element.likes.count || 0
      var caption = element.caption ? element.caption.text.substr(0, caption_length).replace(/(?:\r\n|\r|\n)/g, '<br>') : ''
      var img_lazy = element.images.low_resolution.url
      str += '<a target="_blank" href="' + element.link + '">'
      str += '<img data-src="' + img_lazy + '" alt="" />'
      str += '<div class="info">'
      str += likes > 0 ? '<div class="likes">' + likes + '</div>' : ''
      str += comments > 0 ? '<div class="comments">' + comments + '</div>' : ''
      str += caption.length > 0 ? '<div class="caption">' + caption + '</div>' : ''
      str += '</div>'
      str += '</a>'
      result.push(str)
    })
  } else {
    displayError('"' + data.meta.error_message + '"', feed_container)
  }
  return result
}

export const mishaProcessResult = function(data: any, feed_container: HTMLElement) {
  var res = getProcessedData(data, feed_container)
  feed_container.innerHTML = res.join('')
  lazyLoadImages(feed_container)
}
