declare var window: any
import { instafeed } from './feed/instafeed'
window['instafunx'] = Object()
window['instafeed'] = instafeed



// window['instafeed'] = () => {
//   const feeds = document.querySelectorAll('.instafeed:not(.prep)')
//   for (let i = 0; i < feeds.length; i++) {
//     var feed = feeds[i] as HTMLElement
//     instafeed(feed)
//   }
// }


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