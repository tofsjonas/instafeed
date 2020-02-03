declare var window: any

import { instagram_api_src, error_msg_adblocker, error_headline, default_header, default_img_count, default_img_cols, default_img_rows, column_breakpoint_start, column_breakpoint_step } from './vars'
import { mishaProcessResult } from './mishaProcess'
import { carousel } from '../carousel/carousel'
import { lazyLoadImages } from './lazyLoadImages'

export const instafeed = (container: HTMLElement): void => {
  if (container.classList.contains('prep')) {
    return
  }
  const dataset = container.dataset

  const token = dataset['token'] || '' // will raise error later on, handled
  const count = +dataset['count'] || default_img_count
  const rows = +dataset['rows'] || default_img_rows
  // container.setAttribute('data-header', 'nisse')
  if (typeof container.dataset['header'] == 'undefined') {
    container.dataset['header'] = default_header
  }
  // console.log('TOFS-TAG: instafeed.ts', container.dataset['header'])
  // container.dataset['header'] = container.dataset['header'] || default_header
  // const header = +container.dataset['header'] || default_header

  container.innerHTML = '<div class="wrapper"><div class="items"></div></div><button class="left"></button><button class="right"></button>'
  var images = [] as Array<HTMLElement>

  const displayError = (message: string) => {
    container.setAttribute('data-error', error_headline + message)
  }


  var item_container = container.querySelector('.items') as HTMLElement

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
    var width = container.offsetWidth
    var cols = +container.dataset['cols'] || default_img_cols

    var start = column_breakpoint_start
    while (start < width) {
      start += column_breakpoint_step
      cols++
    }
    // 2 rows:
    // 2 cols = 100% = 2/2
    // 3 cols = 66.6% = 2/3
    // 4 cols = 50% = 2/4

    // 3 rows:
    // 2 cols = 150% = 3/2
    // 3 cols = 100% = 3/3
    // 4 cols = 75% = 3/4
    // etc.

    container.style.setProperty('padding-bottom', 100 * (rows / cols) + '%')

    item_container.style.setProperty('grid-template-rows', 'repeat(' + rows + ', 1fr)')
    var number_of_images_per_slide = rows * cols
    var number_of_slides = Math.floor(images.length / number_of_images_per_slide)
    var total_number_of_slide_elements = number_of_images_per_slide * number_of_slides

    if (number_of_images_per_slide != current_number_of_images_per_slide) {
      current_number_of_images_per_slide = number_of_images_per_slide
      item_container.innerHTML = ''
      var div2: HTMLElement
      for (let i = 0; i < total_number_of_slide_elements; i++) {
        if (i == 0 || i % number_of_images_per_slide == 0) {
          div2 = document.createElement('div')
          div2.style.setProperty('grid-template-columns', 'repeat(' + cols + ', 1fr)')
          item_container.appendChild(div2)
        }
        div2.appendChild(images[i])
      }
    }


    // create three slides
    // for (let i = 0; i < number_of_slides; i++) {
    //   for (let k = 0; k < number_of_images_per_slide; k++) {
    //     console.log('TOFS-TAG: instafeed.ts', k, i, k + i)
    //   }
    // }


    // console.log('TOFS-TAG: instafeed.ts', number_of_slides)


    // if (number_of_images_per_slide != current_number_of_images_per_slide) {
    //   current_number_of_images_per_slide = number_of_images_per_slide
    //   item_container.innerHTML = ''
    //   var div = document.createElement('div')
    //   div.style.setProperty('grid-template-columns', 'repeat(' + cols + ', 1fr)')
    //   images.forEach((image, index) => {
    //     if (index > 0 && index % current_number_of_images_per_slide == 0) {
    //       item_container.appendChild(div)
    //       div = document.createElement('div')
    //       div.style.setProperty('grid-template-columns', 'repeat(' + cols + ', 1fr)')
    //     }
    //     div.appendChild(image)
    //   })
    //   item_container.appendChild(div)
    // }
  }

  var resize_timer: any

  window.addEventListener('resize', () => {
    clearTimeout(resize_timer)
    resize_timer = setTimeout(populate, 150)
  })

  window.instafunx[identifier] = (a: any): void => {
    try {
      images = mishaProcessResult(a)
      populate()
      carousel(container, true)
    } catch (error) {
      displayError(error.message)
    }
    lazyLoadImages(container)
  }
  container.className += ' prep'
  document.body.appendChild(api_script)
}

