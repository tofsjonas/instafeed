declare var window: any

import { instagram_api_src, error_msg_adblocker, error_headline, default_img_count, default_img_rows, break_point_2, break_point_3, break_point_4, break_point_5 } from './vars'
import { mishaProcessResult } from './mishaProcess'
// import { lazyLoadImages } from './lazyLoadImages'
import { carousel } from '../carousel/carousel'

export const instafeed = (container: HTMLElement): void => {
  if (container.classList.contains('prep')) {
    return
  }
  var images = [] as Array<HTMLElement>

  const displayError = (message: string) => {
    container.setAttribute('data-error', error_headline + message)
  }

  const prepareFeedContainer = (): void => {
    var tmp = '<div class="wrapper"><div class="items"></div></div>'
    tmp += '<button class="left"></button>'
    tmp += '<button class="right"></button>'
    container.innerHTML = tmp
  }
  prepareFeedContainer()

  const token = container.getAttribute('data-token') || '' // will raise error later on, handled
  const count = container.getAttribute('data-count') || default_img_count
  const rows = parseInt(container.getAttribute('data-rows')) || default_img_rows
  const identifier = 'a' + (0 | (Math.random() * 9e6)).toString(36)

  var api_src = instagram_api_src
  api_src += 'access_token=' + token
  api_src += '&count=' + count
  api_src += '&callback=window.instafunx.' + identifier

  const api_script = document.createElement('script')
  api_script.setAttribute('src', api_src)
  api_script.onerror = (): void => {
    displayError(error_msg_adblocker)
  }

  var current_number_of_images_per_slide = 0

  const populate = () => {
    var width = window.innerWidth
    var cols = 2
    var images = ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']

    // if (width >= break_point_2) {
    //   cols = 2
    // }
    if (width > break_point_3) {
      cols = 3
    }
    if (width > break_point_4) {
      cols = 4
    }
    if (width > break_point_5) {
      cols = 5
    }

    var number_of_images_per_slide = rows * cols
    // console.log('SPACETAG: instafeed.ts POPULAAATE', width, rows, cols, number_of_images_per_slide)
    if (number_of_images_per_slide != current_number_of_images_per_slide) {
      current_number_of_images_per_slide = number_of_images_per_slide
      var item_container = container.querySelector('.items')

      item_container.innerHTML = ''
      var div = document.createElement('div')
      images.forEach((image, index) => {
        var nisse = Math.floor(index / current_number_of_images_per_slide)
        if (index > 0 && index % current_number_of_images_per_slide == 0) {
          item_container.appendChild(div)
          div = document.createElement('div')
          // console.log('SPACETAG: instafeed.ts', 'APA', index)
        }
        var pelle = document.createElement('a')
        pelle.appendChild(document.createTextNode('hej ' + nisse))
        div.appendChild(pelle)

        // console.log('SPACETAG: instafeed.ts', image, index)
      })
      item_container.appendChild(div)
      // console.log('SPACETAG: instafeed.ts', container.innerHTML)

      // console.log('SPACETAG: instafeed.ts POPULAAATE', number_of_images_per_slide, number_of_slides)
    }
  }

  var resize_timer: any


  window.addEventListener('resize', () => {
    clearTimeout(resize_timer)
    resize_timer = setTimeout(populate, 150)
  })

  populate()

  window.instafunx[identifier] = (a: any): void => {
    try {
      images = mishaProcessResult(a)
      populate()
      // pelle(images)
    } catch (error) {
      displayError(error.message)
    }
    // lazyLoadImages(container)
  }
  container.className += ' prep'
  carousel(container, true)
  // document.body.appendChild(api_script)
}

// <div class="carousel">
// <div class="wrapper">
//   <div class="items">
//     <div><b>1</b></div>
//     <div><b>2</b></div>
//     <div><b>3</b></div>
//     <div><b>4</b></div>
//     <div><b>5</b></div>
//     <div><b>6</b></div>
//   </div>
// </div>
// <button class="control prev"></button>
// <button class="control next"></button>
// </div>

// const prepareFeedContainer = (container:HTMLElement, count:number, image_size:number):string => {
//   var str = ''
//   for (let i = 0; i < count; i++) {
//     str+='<a target="_blank" style="width:' + image_size + 'px;height:' + image_size + 'px"></a>'
//   }
//   return str
// }

// export const initScrollFeed = (container:HTMLElement) => {
//   doInit(container,prepareScrollContainer)
//   handleScrollButtonVisibility(container)
// }
// export const initDefaultFeed = (container:HTMLElement) => {
//   doInit(container,prepareFeedContainer)
// }


// calulate total number of slides
// var number_of_slides = images.length / number_of_images_per_slide

// console.log('SPACETAG: instafeed.ts', images.length, number_of_images_per_slide, number_of_slides, Math.ceil(number_of_slides))
// if (images.length % number_of_images_per_slide !== 0) {
//   number_of_slides++
// }
