export const current_script: any = document.currentScript // "any" is the only one I can get to work... :(
export const feed_id: string = current_script.getAttribute('data-id') || 'instafeed'
export const feed_container: HTMLElement = document.getElementById(feed_id)
export const css_ref: string = current_script.getAttribute('src').replace(/(\.min)*\.js$/, '$1.css')
export const image_count: number = current_script.getAttribute('data-count') || 4 // max 20?
export const image_width: number = current_script.getAttribute('data-img-size') || 320 // 320x319 = instagram's default size is seems
export const image_height: number = image_width - 1
export const instagram_token: string = current_script.getAttribute('data-token')
export const instagram_api_src: string = 'https://api.instagram.com/v1/users/self/media/recent?access_token=' + instagram_token + '&count=' + image_count + '&callback=mishaProcessResult'
export const fontawesome_href: string = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
export const error_headline: string = 'Instagram feed failed 😞<br>'
export const error_msg_adblocker: string = 'Most likely due to an ad blocker...'
