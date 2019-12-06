import { instagram_api_src, css_ref, error_msg_adblocker, feed_container, image_width, image_count, image_height } from './vars'
import { displayError } from './errorHandler'
// type initProps = {
//   callback: Function
// }
// const initFeed = ({ callback }: initProps) => {

export const init = (callback: Function) => {
  feed_container.style.minWidth = image_width + 'px'
  feed_container.style.minHeight = image_height + 'px'

  const feed_script_element = document.createElement('script')

  // useless in safari...
  // feed_script_element.addEventListener('error', function(e: any) {
  //   e.preventDefault()
  //   displayError(error_msg_adblocker)
  // })
  // feed_script_element.onerror = (e: any) => {
  //   e.preventDefault()
  //   displayError(error_msg_adblocker)
  //   // throw new Error(error_adblocker)
  // }

  feed_script_element.onload = () => {
    callback()
  }
  feed_script_element.setAttribute('src', instagram_api_src)

  const feed_css_link = document.createElement('link')
  feed_css_link.rel = 'stylesheet'
  feed_css_link.href = css_ref
  feed_css_link.onload = () => {
    document.body.appendChild(feed_script_element)
  }
  document.head.appendChild(feed_css_link)
}
