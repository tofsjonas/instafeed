# InstaFeed

A simple tool to add one or more *quite* basic instagram feed on a website.

It will display the latest images - with caption - as well as the number of likes/comments.

## Requirements

Well, a website I guess. And the ability to add html/javascript to it.

## How to

1. Go to
   https://instagram.pixelunion.net/
   and follow the instructions to get your instagram token

2. Somewhere in your html, add  `<div class="instafeed" data-token="YOUR_TOKEN"></div>`

3. In your `<head>` tag, add
`<link href="//cdn.jsdelivr.net/gh/tofsjonas/instafeed@X.X/feed.min.css" rel="stylesheet" />`

4. At the end of your html, just before the `</body>` tag, add
`<script src="//cdn.jsdelivr.net/gh/tofsjonas/instafeed@X.X/feed.min.js"></script>`

## Tweaking

There are two optional settings:  

- **data-img-size**, which sets the height and width of the images (default/max=**320**)
- **data-count**, which sets the number of images to display (default/max=**20**)

Like so:
`<div class="instafeed" data-img-size="200" data-count="10" data-token="YOUR_TOKEN"></div>`

You can have as many feeds as you like, just add more:

```
<div class="instafeed" data-token="YOUR_TOKEN"></div>
<div class="instafeed" data-token="ANOTHER_TOKEN"></div>
<div class="instafeed" data-token="A_THIRD_TOKEN"></div>
```


## Caveats
Adblockers may prevent the feed...

## Credits

The root of it all, what made this possible:  
https://rudrastyh.com/instagram/get-photos-and-profile-info-pure-javascript.html

Fonts generated at https://icomoon.io/app/, base64-encoded at https://transfonter.org/
