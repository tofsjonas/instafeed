export function carousel(container: HTMLElement, resize_slide_to_container: boolean) {
  var wrapper = container.children[0]
  var prev = container.children[1] as HTMLElement
  var next = container.children[2] as HTMLElement
  var items = wrapper.children[0] as HTMLElement
  var posX1 = 0
  var posX2 = 0
  var posInitial = 0
  var posFinal
  var threshold = 100

  var slides: HTMLCollection
  var slidesLength: number
  var firstSlide: HTMLElement
  var slideWidth: number
  var lastSlide: HTMLElement
  var firstClone: HTMLElement
  var lastClone: HTMLElement
  var index: number
  var allowShift: boolean
  var build_in_progress = false
  var build_timer: any
  var resize_timer: any // number does not work... :(
  var resizing_in_progress = true

  const build = () => {
    container.classList.remove('loaded')
    build_in_progress = true
    index = 0
    allowShift = true
    slides = items.children
    slidesLength = slides.length
    firstSlide = slides[0] as HTMLElement
    slideWidth = firstSlide.getBoundingClientRect().width
    lastSlide = slides[slidesLength - 1] as HTMLElement
    firstClone = firstSlide.cloneNode(true) as HTMLElement
    lastClone = lastSlide.cloneNode(true) as HTMLElement
    items.insertBefore(lastClone, firstSlide)
    items.appendChild(firstClone)
    resizeContainer()

    setTimeout(() => { // so observer isn't triggered instantly...
      build_in_progress = false
      container.classList.add('loaded')
    }, 5)

  }

  const dragStart = (e: Event) => {
    e = e || window.event
    e.preventDefault()
    var temp = window.getComputedStyle(items)
    // posInitial = items.offsetLeft Not precise enough
    posInitial = parseFloat(temp.getPropertyValue('left'))

    if (e.type == 'touchstart') {
      posX1 = (e as TouchEvent).touches[0].clientX
    } else {
      posX1 = (e as MouseEvent).clientX
      window.addEventListener('mouseup', dragEnd)
      window.addEventListener('mousemove', dragAction)
      window.addEventListener('touchend', dragEnd)
      window.addEventListener('touchmove', dragAction)
    }
  }
  const dragAction = (e: Event) => {
    e = e || window.event

    if (e.type == 'touchmove') {
      posX2 = posX1 - (e as TouchEvent).touches[0].clientX
      posX1 = (e as TouchEvent).touches[0].clientX
    } else {
      posX2 = posX1 - (e as MouseEvent).clientX
      posX1 = (e as MouseEvent).clientX
    }
    items.style.left = items.offsetLeft - posX2 + 'px'
  }
  const dragEnd = () => {
    posFinal = items.offsetLeft
    if (Math.abs(posFinal - posInitial) > 5) {
      window.addEventListener('click', noClick)
    }

    if (posFinal - posInitial < -threshold) {
      shiftSlide(1, 'drag')
    } else if (posFinal - posInitial > threshold) {
      shiftSlide(-1, 'drag')
    } else {
      items.style.left = posInitial + 'px'
    }

    window.removeEventListener('mouseup', dragEnd)
    window.removeEventListener('mousemove', dragAction)
    window.removeEventListener('touchend', dragEnd)
    window.removeEventListener('touchmove', dragAction)
    setTimeout(() => {
      window.removeEventListener('click', noClick)
    }, 10)

  }
  const shiftSlide = (dir: number, action?: string) => {
    if (resizing_in_progress) { return }
    items.classList.add('shifting')

    if (allowShift) {
      if (!action) {
        // posInitial = items.offsetLeft // not enough precision
        var temp = window.getComputedStyle(items)
        posInitial = parseFloat(temp.getPropertyValue('left'))
      }

      if (dir == 1) {
        items.style.left = posInitial - slideWidth + 'px'
        index++
      } else if (dir == -1) {
        items.style.left = posInitial + slideWidth + 'px'
        index--
      }
    }

    allowShift = false
  }
  const checkIndex = () => {
    items.classList.remove('shifting')

    if (index == -1) {
      items.style.left = -(slidesLength * slideWidth) + 'px'
      index = slidesLength - 1
    }

    if (index == slidesLength) {
      items.style.left = -(1 * slideWidth) + 'px'
      index = 0
    }

    allowShift = true
  }

  const noClick = (e: Event) => {
    e.preventDefault()
  }




  const resizeContainerToSlide = () => {
    posInitial = 0
    slideWidth = firstSlide.getBoundingClientRect().width
    container.style.width = slideWidth + 'px'
    items.style.left = '-' + slideWidth + 'px'
  }
  const resizeSlideToContainer = () => {
    posInitial = 0
    slideWidth = container.getBoundingClientRect().width
    var slideHeight = container.getBoundingClientRect().height
    var slides = items.children
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i] as HTMLElement
      slide.style.width = slideWidth + 'px'
      slide.style.height = slideHeight + 'px'
    }
    items.style.left = '-' + slideWidth + 'px'
  }

  const resizeContainer = () => {
    if (resize_slide_to_container) {
      resizeSlideToContainer()
    } else {
      resizeContainerToSlide()
    }
    resizing_in_progress = false
  }


  window.addEventListener('resize', () => {
    resizing_in_progress = true
    clearTimeout(resize_timer)
    resize_timer = setTimeout(resizeContainer, 150)
  })

  var observer = new MutationObserver(() => {
    if (!build_in_progress) {
      clearTimeout(build_timer)
      build_timer = setTimeout(build, 10)
    }
  })
  observer.observe(items, { subtree: true, childList: true })

  // Mouse and Touch events
  items.addEventListener('touchstart', dragStart)
  items.addEventListener('mousedown', dragStart)

  // Button Click events
  prev.addEventListener('click', () => {
    shiftSlide(-1, null)
  })
  next.addEventListener('click', () => {
    shiftSlide(1, null)
  })

  // Transition events
  items.addEventListener('transitionend', checkIndex)
  build()

}
