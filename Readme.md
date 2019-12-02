# InstaFeed

A simple tool to add a *very* basic instagram feed on a website. No swiping, no carousel, just images + caption, number of likes/comments.

## Requirements

Well, a website I guess. And the ability to add html/javascript to it.

## How to

1. Go to
   https://instagram.pixelunion.net/
   and follow the instructions to get your instagram token

2. Somewhere in your html, add  `<div id="instafeed"></div>`

3. At the end of your html, just before the `</body>` tag, add

`<script src="//cdn.jsdelivr.net/gh/tofsjonas/instafeed@1.0/feed.min.js" data-token="YOUR_TOKEN"></script>`

## Tweaking

There are two optional settings:  

- **data-img-size**, which sets the height and width of the images (default=320)
- **data-count**, which sets the number of images to display (default=4, max=20)

Like so:

`<script src="...." data-img-size="200" data-count="10" data-token="YOUR_TOKEN"></script>`

## Caveats
Adblockers may prevent the feed...

## Credits

The root of it all, what made this possible:  
https://rudrastyh.com/instagram/get-photos-and-profile-info-pure-javascript.html

Font Awesome, so it looks a bit fancy:  
https://fontawesome.com/

To enable loading of FontAwesome if needed:
https://gist.github.com/AllThingsSmitty/716e8b64f04fbf4d21c3c63e54d4a487
