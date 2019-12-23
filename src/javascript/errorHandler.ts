import { error_headline } from './vars'

export const displayError = (message: string, container: Element) => {
  container.setAttribute('data-error', error_headline + message)
}
