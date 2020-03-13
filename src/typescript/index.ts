declare var window: any
declare var document: any
import { instafeed } from './feed/instafeed'
if (!window['jInstafeed']) {
  window['jInstafeed'] = instafeed
  window['jinstafunx'] = Object()
  var css_link = document.createElement('link')
  css_link.rel = 'stylesheet'
  css_link.href = document['currentScript']['src'].replace(/(\.min)*\.js$/, '$1.css')
  document['head'].appendChild(css_link)
}


/**
 * @ TODONE prettier resizing...
 * @ TODONE reinsert.. Lazy
 * @ TODONE click prevention..
 * @ TODONE left right-buttons, check safari...
 * @ TODONE clip caption..
 *
 * @TODO font-size? What happened? Is it gone? do I need it?
 * @TODO popup maybe, instead of instantly going to instagram? Can't be that difficult
 *      pros: better ux?
 *      cons: more code
 */
