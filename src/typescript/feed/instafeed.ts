declare var window: any

import { instagram_api_src, error_msg_adblocker, error_headline, default_headline, default_img_count, default_img_cols, default_img_rows, column_breakpoint_start, column_breakpoint_step } from './vars'
import { mishaProcessResult } from './mishaProcess'
import { carousel } from '../carousel/carousel'
import { lazyLoadImages } from './lazyLoadImages'

export const instafeed = (currentScript: HTMLScriptElement): void => {
  var parent = currentScript.parentNode
  var container = document.createElement('DIV')
  container.className = 'jInstafeed'
  parent.insertBefore(container, currentScript)

  const dataset = currentScript.dataset

  const token = dataset['token'] || '' // will raise error later on, handled
  const count = +dataset['count'] || default_img_count
  const rows = +dataset['rows'] || default_img_rows


  if (typeof dataset['headline'] == 'undefined') {
    container.dataset['headline'] = default_headline
  } else {
    container.dataset['headline'] = dataset['headline']

  }

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
  api_src += '&callback=window.jinstafunx.' + identifier

  const api_script = document.createElement('script')
  api_script.setAttribute('src', api_src)
  api_script.onerror = (): void => {
    displayError(error_msg_adblocker)
  }

  var current_number_of_images_per_slide = 0

  const populate = () => {
    var container_width = container.offsetWidth
    var cols = +container.dataset['cols'] || default_img_cols

    var start = column_breakpoint_start
    while (start < container_width) {
      start += column_breakpoint_step
      cols++
    }

    // The grid behaves strangly otherwise, with twisted images
    var image_width = container_width / cols
    images.forEach(i => {
      i.style.width = image_width + 'px'
      i.style.height = image_width + 'px'
    })

    // var max_fontsize = 20
    // var min_fontsize = 12
    // var font_size = image_width / 20
    // if (font_size < min_fontsize) {
    //   font_size = min_fontsize
    // }
    // if (font_size > max_fontsize) {
    //   font_size = max_fontsize
    // }

    // console.log('TOFS-TAG: instafeed.ts', image_width, font_size)


    container.style.setProperty('padding-bottom', 100 * (rows / cols) + '%')

    item_container.style.setProperty('grid-template-rows', 'repeat(' + rows + ', 1fr)')
    var number_of_images_per_slide = rows * cols
    var number_of_slides = Math.floor(images.length / number_of_images_per_slide)
    var total_number_of_slide_elements = number_of_images_per_slide * number_of_slides

    // the number of images per slide has changed, so a rebuild is required
    if (number_of_images_per_slide != current_number_of_images_per_slide) {
      current_number_of_images_per_slide = number_of_images_per_slide
      item_container.innerHTML = ''
      var slide: HTMLElement
      for (let i = 0; i < total_number_of_slide_elements; i++) {
        if (i == 0 || i % number_of_images_per_slide == 0) {
          slide = document.createElement('DIV')
          slide.style.setProperty('grid-template-columns', 'repeat(' + cols + ', 1fr)')
          item_container.appendChild(slide)
        }
        slide.appendChild(images[i])
      }
    }
  }

  var resize_timer: any

  window.addEventListener('resize', () => {
    clearTimeout(resize_timer)
    resize_timer = setTimeout(populate, 150)
  })


  window['jinstafunx'][identifier] = (a: any): void => {
    try {
      images = mishaProcessResult(a)
      populate()
      carousel(container, true)
      lazyLoadImages(container)

    } catch (error) {
      displayError(error.message)
    }
  }

  document.body.appendChild(api_script)
}

