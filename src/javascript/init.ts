declare var window: any

import { instagram_api_src, error_msg_adblocker,default_img_width, default_img_count,min_fontsize,max_fontsize } from './vars'
import { mishaProcessResult } from './mishaProcess'
import { displayError } from './errorHandler'

const prepareContainer = (feed_container:HTMLElement,count:number) => {
  var image_size = parseFloat(feed_container.getAttribute('data-size'))

  if (isNaN(image_size)) {
    image_size = default_img_width
  }
  var font_size = image_size / 20
  if(font_size<min_fontsize) {
    font_size = min_fontsize
  }
  if(font_size>max_fontsize) {
    font_size = max_fontsize
  }
  feed_container.style.fontSize = font_size + 'px'

  var str = ''
  for (let i = 0; i < count; i++) {
    str+='<a target="_blank" style="width:'+image_size+'px;height:'+image_size+'px"></a>'
  }
  feed_container.innerHTML = str
}



export const initFeeds = () => {
  window.instafunx = Object()

  const feeds: any = document.querySelectorAll('.instafeed:not(.loaded)')
  for (let i = 0; i < feeds.length; i++) {
    const feed = feeds[i]
    if (!feed.classList.contains('loaded')) {
      const token = feed.getAttribute('data-token') || ''
      const count = feed.getAttribute('data-count') || default_img_count
      prepareContainer(feed,count)
      // continue
  
      const identifier = 'a' + (new Date() as any % 9e6).toString(36) + i
      // const identifier = 'a' + (0 | (Math.random() * 9e6)).toString(36) + i
      var api_src = instagram_api_src
      api_src += 'access_token=' + token
      api_src += '&count=' + count
      api_src += '&callback=window.instafunx.' + identifier
      const api_script = document.createElement('script')
      api_script.setAttribute('src', api_src)
      api_script.onerror = () => {
        feed.classList.add('loaded')
        displayError(error_msg_adblocker, feed)
      }
      window.instafunx[identifier] = (a: any) => {
        feed.classList.add('loaded')
        mishaProcessResult(a, feed)
      }
  
      document.body.appendChild(api_script)
    }
  }
}
