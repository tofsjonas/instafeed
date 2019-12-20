// import { feed_container } from './vars'
import { error_headline } from './vars'

// does not work in safari. surprise. NO custom errors!
// export const handleErrors = () => {
//   window.addEventListener('error', function(e: any) {
//     if (current_script.src === e.filename) {
//       e.preventDefault()
//       feed_container.innerHTML = 'Instagram feed failed 😞<br>' + e.message
//     }
//     e.preventDefault()
//   })
// }

export const displayError = (message: string, container: Element) => {
  container.setAttribute('data-error', error_headline + message)
}
