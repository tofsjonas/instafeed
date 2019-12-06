import { image_width, image_height, feed_container } from './vars'
import { displayError } from './errorHandler'
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

const getProcessedData = (data: any): Array<string> => {
  // data.meta.code will always be set, otherwise this function will not be called...
  var result: Array<string> = []
  if (data.meta.code === 200) {
    data.data.forEach((element: dataElement) => {
      var str = ''
      var comments = element.comments.count || 0
      var likes = element.likes.count || 0
      var caption = element.caption ? element.caption.text.substr(0, 120).replace(/(?:\r\n|\r|\n)/g, '<br>') : ''
      var img_lazy = element.images.low_resolution.url
      str += '<a target="_blank" href="' + element.link + '" style="width:' + image_width + 'px;height:' + image_height + 'px ">'
      str += '<img data-lazy-if="' + img_lazy + '" alt="" width="' + image_width + '" height="' + image_height + '" />'
      str += '<div class="info-if">'
      str += likes > 0 ? '<div class="likes-if">' + likes + '</div>' : ''
      str += comments > 0 ? '<div class="comments-if">' + comments + '</div>' : ''
      str += caption.length > 0 ? '<div class="caption-if">' + caption + '</div>' : ''
      str += '</div>'
      str += '</a>'
      result.push(str)
    })
  } else {
    displayError('"' + data.meta.error_message + '"')
  }
  return result
  // throw new Error('"' + data.meta.error_message + '"')
}

// export const mishaProcessCarousel = (data?: Array<string>) => {
//   //place them in containers based on count...
//   var str = '<div class="carousel">' + getProcessedData(data) + '</div>'
// }

export const mishaProcessDefault = (data: Array<string>) => {
  feed_container.innerHTML = getProcessedData(data).join('')
}
