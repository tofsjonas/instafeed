declare var window: any
import { initFeeds } from './init'

window['instafeed'] = () => {
  initFeeds()
}
