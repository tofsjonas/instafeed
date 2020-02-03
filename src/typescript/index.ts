declare var window: any
declare var document: any
import { instafeed } from './feed/instafeed'
var css_link = document.createElement('link')
css_link.rel = 'stylesheet'
css_link.href = document['currentScript']['src'].replace(/(\.min)*\.js$/, '$1.css')
document['head'].appendChild(css_link)
// holds callbacks for instagram api
window['instafunx'] = Object()

/**
 * @TODO: prettier resizing... DONE
 * @TODO: reinsert.. Lazy DONE
 * @TODO: click prevention.. DONE
 * @TODO left right-buttons, check safari...
 * @TODO: clip caption..
 */

const run = () => {
  const feeds = document.querySelectorAll('.instafeed:not(.prep)')
  for (let i = 0; i < feeds.length; i++) {
    var feed = feeds[i] as HTMLElement
    instafeed(feed)
  }
}
run()
// so you can run it again if you feel like it...
window['instafeed'] = run



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

// const base = 'https://api.instagram.com/v1/users/self/media/recent/'
// // const base = 'https://api.instagram.com/v1/tags/struntaimig/media/recent/'
// const token = '1702135757.1677ed0.f40e0bfacf0f443bbb0e2777e957feaa'
// fetchData(`${base}?access_token=${token}&count=100`)
//   .then(data => console.log('apa', data))
//   .catch(error => console.error('apa', error))