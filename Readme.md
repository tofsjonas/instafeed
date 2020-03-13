# InstaFeed

A simple tool to add one or more [Instagram](https://www.instagram.com/) feeds on a website.

It will display the latest images with caption, as well as the number of likes/comments.

## Requirements

Well, a website I guess. And the ability to add html/javascript to it.

## How to

1. Go to <https://instagram.pixelunion.net/> and follow the instructions to get your instagram token. (There are other, more "proper" ways to do this, but this is both quick and painless)

2. Somewhere in your html, add:

``` html

<script
  data-token="YOUR_TOKEN"
  onload="jInstafeed(this)"
  defer
  src="//cdn.jsdelivr.net/gh/tofsjonas/instafeed@X.X/dist/feed.min.js"></script>

```

## Tweaking

There's are few (optional) settings:

- **data-count**, which sets the number of images to display (default=**20**)
- **data-rows**, which sets the number of rows (default=**2**)
- **data-cols**, which sets the **minimum** number of columns to display (default=**2**)
- **data-headline**, which sets the headline. If you do not want a headline this needs to be an empty string (default=**Follow us on Instagram**)

Like so:

``` html
<script
  data-count="100"
  data-rows="2"
  data-cols="3"
  data-headline="My headline"
  data-token="YOUR_TOKEN"
  onload="jInstafeed(this)"
  defer
  src="//cdn.jsdelivr.net/gh/tofsjonas/instafeed@X.X/dist/feed.min.js"></script>
```

The following would be the same as the default settings, i.e:

``` html
<script
  data-count="20"
  data-rows="2"
  data-cols="2"
  data-headline="Follow us on Instagram"
  data-token="YOUR_TOKEN"
  src="//cdn.jsdelivr.net/gh/tofsjonas/instafeed@X.X/dist/feed.min.js"></script>
```

You can have as many feeds as you like, just add more:

``` html
<script
  data-token="YOUR_TOKEN"
  onload="jInstafeed(this)"
  defer
  src="//cdn.jsdelivr.net/gh/tofsjonas/instafeed@X.X/dist/feed.min.js"></script>
  <br>
  <br>
  <br>
<script
  data-token="ANOTHER_TOKEN"
  onload="jInstafeed(this)"
  defer
  src="//cdn.jsdelivr.net/gh/tofsjonas/instafeed@X.X/dist/feed.min.js"></script>
  ...
  ...
```

## Caveats

- Adblockers may prevent the feed...
- IE9 and Opera Mini are out of the game

## Credits

The root of it all, what made this possible:
[Misha Rudrastyh](https://rudrastyh.com/instagram/get-photos-and-profile-info-pure-javascript.html)

Carousel: [Claudia Conceicao](https://codepen.io/cconceicao/pen/PBQawy)

Fonts generated at [Fontello](http://fontello.com/), base64-encoded at <https://transfonter.org/>
