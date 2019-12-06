import { feed_container } from './vars'

const unLazyImage = (img: HTMLImageElement): void => {
  img.onload = () => {
    img.removeAttribute('data-lazy-if')
  }
  img.src = img.getAttribute('data-lazy-if')
}

const getLazyImages = (): Array<HTMLImageElement> => {
  return [].slice.call(feed_container.querySelectorAll('img'))
}

export const unLazyInstant = (): void => {
  var lazyImages = getLazyImages()
  lazyImages.forEach((image: HTMLImageElement) => {
    unLazyImage(image)
  })
  feed_container.classList.add('loaded')
}

export const unLazyObserved = (): void => {
  if ('IntersectionObserver' in window) {
    var lazyImages = getLazyImages()

    // Create new observer object
    // let lazyImageObserver = new IntersectionObserver((entries, observer) => { // observer isn't used...
    // let lazyImageObserver = new IntersectionObserver((entries: Array<HTMLImageElement>) => { // doesn't compile

    let lazyImageObserver = new IntersectionObserver((entries: Array<any>) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let lazyImage = entry.target
          unLazyImage(lazyImage)
          lazyImageObserver.unobserve(lazyImage)
        }
      })
    })
    lazyImages.forEach((image: HTMLImageElement) => {
      lazyImageObserver.observe(image)
    })
    feed_container.classList.add('loaded')
  } else {
    unLazyInstant()
  }
}
