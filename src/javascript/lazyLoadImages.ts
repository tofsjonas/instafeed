// import { feed_container } from './vars'

const unLazyImage = (img: HTMLImageElement): void => {
  img.onload = () => {
    img.removeAttribute('data-src')
  }
  img.src = img.getAttribute('data-src')
}

export const unLazyInstant = (container: Element): void => {
  var lazyImages = [].slice.call(container.querySelectorAll('[data-src]'))
  lazyImages.forEach((image: HTMLImageElement) => {
    unLazyImage(image)
  })
  // container.classList.add('loaded')
}

export const lazyLoadImages = (container: Element): void => {
  var lazyImages = [].slice.call(container.querySelectorAll('[data-src]'))

  if ('IntersectionObserver' in window) {
    let lazyImageObserver = new IntersectionObserver((entries: Array<any>) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let lazyImage = entry.target
          unLazyImage(lazyImage)
          lazyImageObserver.unobserve(lazyImage)
        }
      })
    })
    // lazyImageObserver.observe(lazyImages)

    lazyImages.forEach((image: HTMLImageElement) => {
      lazyImageObserver.observe(image)
    })
    // container.classList.add('loaded')
  } else {
    lazyImages.forEach((image: HTMLImageElement) => {
      unLazyImage(image)
    })
  }
}
