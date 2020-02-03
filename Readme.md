# InstaFeed

A simple tool to add one or more [Instagram](https://www.instagram.com/) feeds on a website.

It will display the latest images with caption, as well as the number of likes/comments.

## Requirements

Well, a website I guess. And the ability to add html/javascript to it.

## How to

1. Go to <https://instagram.pixelunion.net/> and follow the instructions to get your instagram token. (There are other, more "proper" ways to do this, but this is both quick and painless)

2. Somewhere in your html, add:

``` html
<div class="instafeed" data-token="YOUR_TOKEN"></div>
<script defer src="//cdn.jsdelivr.net/gh/tofsjonas/instafeed@X.X/dist/feed.min.js"></script>
```

## Tweaking

There's are few (optional) settings:

- **data-count**, which sets the number of images to display (default=**20**)
- **data-rows**, which sets the number of rows (default=**2**)
- **data-cols**, which sets the **minimum** number of columns to display (default=**2**)
- **data-header**, which sets the headline. If you do not want a headline this needs to be an empty string (default=**Follow us on Instagram**)

Like so:

``` html
<div class="instafeed"
  data-count="50"
  data-rows="3"
  data-cols="1"
  data-header=""
  data-token="YOUR_TOKEN"
  ></div>
<script defer src=...></script>
```

The following would be the same as the default settings, i.e. `<div class="instafeed" data-token="YOUR_TOKEN"></div>`:

``` html
<div class="instafeed"
  data-count="20"
  data-rows="2"
  data-cols="2"
  data-header="Follow us on Instagram"
  data-token="YOUR_TOKEN"
  ></div>
<script defer src=...></script>
```

You can have as many feeds as you like, just add more:

``` html
<div class="instafeed" ... data-token="YOUR_TOKEN"></div>
<div class="instafeed" ... data-token="ANOTHER_TOKEN"></div>
<div class="instafeed" ... data-token="A_THIRD_TOKEN"></div>
<script defer src=...></script>
```

## Caveats

- Adblockers may prevent the feed...
- IE9 and Opera Mini are out of the game

## Credits

The root of it all, what made this possible:
[Misha Rudrastyh](https://rudrastyh.com/instagram/get-photos-and-profile-info-pure-javascript.html)

Carousel: [Claudia Conceicao](https://codepen.io/cconceicao/pen/PBQawy)

Fonts generated at [Fontello](http://fontello.com/), base64-encoded at <https://transfonter.org/>
