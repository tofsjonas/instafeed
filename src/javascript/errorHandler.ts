import { feed_container } from './vars'

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

export const displayError = (message: string) => {
  feed_container.setAttribute('data-error-if', 'Instagram feed failed 😞<br>' + message)
}
