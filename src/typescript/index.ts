declare var window: any
declare var document: any
import { instafeed } from './feed/instafeed'

// console.log('TOFS-TAG: index.ts', window['instafeed'])
if (!window['jInstafeed']) {
  // console.log('TOFS-TAG: index.ts', 'jonas')
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

// not supported by ie11 :(
// https://medium.com/@zackcreach/fighting-instagrams-api-in-2017-832e8f0280ee
// console.log('Starting instagram..')

// const fetchData = (url: string) => {
//   return fetch(url)
//     .then(data => data.json())
//     .then(json => {
//       if (json) {
//         return Promise.resolve(json)
//       } else {
//         return Promise.reject(Error('json is undefined!'))
//       }
//     })
// }

