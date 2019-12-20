declare var window: any

import { instagram_api_src, error_msg_adblocker } from './vars'
import { mishaProcessResult } from './mishaProcess'
import { displayError } from './errorHandler'

// const prepareContainer = (container) => {

// }

export const initFeeds = () => {
  window.instafunx = Object()

  const feeds: any = document.querySelectorAll('.instafeed:not(.loaded)')
  for (let i = 0; i < feeds.length; i++) {
    const feed = feeds[i]
    if (feed.classList.contains('loaded')) continue

    const token = feed.getAttribute('data-token') || ''
    const count = feed.getAttribute('data-count') || 20
    const identifier =
      'a' +
      Math.random()
        .toString(36)
        .slice(-5) +
      i
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
    // setTimeout(() => {
    //   document.body.appendChild(api_script)
    // }, (i + 1) * 500)
  }
}
