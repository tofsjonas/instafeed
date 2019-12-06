// https://gist.github.com/AllThingsSmitty/716e8b64f04fbf4d21c3c63e54d4a487
import { fontawesome_href } from './vars'

export const initFontAwesome = () => {
  function css(element: HTMLElement, property: string) {
    return window.getComputedStyle(element, null).getPropertyValue(property)
  }
  var span = document.createElement('span')
  span.className = 'fa'
  span.style.display = 'none'
  document.body.insertBefore(span, document.body.firstChild)
  if (css(span, 'font-family').toLowerCase() !== 'fontawesome') {
    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = fontawesome_href
    document.head.appendChild(link)
  }
  document.body.removeChild(span)
}
