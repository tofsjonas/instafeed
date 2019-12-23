// import { image_width, image_height, feed_container } from './vars'
import { displayError } from './errorHandler'
import { caption_length,default_img_width } from './vars'
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
    },
    standard_resolution: {
      url: string
    }
  }
}

const processResult = (data: any, feed_container: HTMLElement): void => {
  // data.meta.code will always be set, otherwise this function will not be called...
  if (data.meta.code === 200) {
    var data_resolution = feed_container.getAttribute('data-resolution')
    if(!data_resolution){
      var image_size = parseFloat(feed_container.getAttribute('data-img-size')) || default_img_width
      if(image_size > default_img_width){
        data_resolution = 'hi'
      }
    }
    var links: NodeListOf<HTMLAnchorElement> = feed_container.querySelectorAll('a:empty')
    data.data.forEach((element: dataElement, i: number) => {
      
      const link = links[i++]
      link.href = element.link

      var str = ''
      var comments = element.comments.count || 0
      var likes = element.likes.count || 0
      var caption = element.caption ? element.caption.text.substr(0, caption_length).replace(/(?:\r\n|\r|\n)/g, '<br>') : ''

      var img_lazy = (data_resolution==='hi')?element.images.standard_resolution.url: element.images.low_resolution.url
      

      str += '<img data-src="' + img_lazy + '" alt="" />'
      str += '<div class="info">'
      str += likes > 0 ? '<div class="likes">' + likes + '</div>' : ''
      str += comments > 0 ? '<div class="comments">' + comments + '</div>' : ''
      str += caption.length > 0 ? '<div class="caption">' + caption + '</div>' : ''
      str += '</div>'
      link.innerHTML = str
    })
    links = feed_container.querySelectorAll('a:empty')
    links.forEach((element: any) => {
      element.parentNode.removeChild(element)
    })
    lazyLoadImages(feed_container)
  } else {
    displayError('"' + data.meta.error_message + '"', feed_container)
  }
}

export const mishaProcessResult = function(data: any, feed_container: HTMLElement) {
  console.log('SPACETAG: mishaProcess.ts', data)
  processResult(data, feed_container)
  // var res = getProcessedData(data, feed_container)
  // feed_container.innerHTML = res.join('')
  // lazyLoadImages(feed_container)
}
