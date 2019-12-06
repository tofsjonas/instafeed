declare var window: any

import { initFontAwesome } from './fontAwesome'
import { mishaProcessDefault } from './mishaProcess'
import { unLazyObserved } from './lazyLoadImages'
import { init } from './init'
// import { handleErrors } from './handleErrors'

window.addEventListener('DOMContentLoaded', () => {
  // window.onload =  () => { // should load faster with 'DOMContentLoaded'
  // handleErrors()
  initFontAwesome()
  // "async", unLazyObserved has to be done AFTER it has been loaded
  // window['mishaProcessResult'] = mishaProcessDefault
  window['mishaProcessResult'] = mishaProcessDefault
  init(unLazyObserved)
})
