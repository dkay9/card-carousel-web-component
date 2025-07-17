# Card Carousel Web Component

![card carousel code pen example](./Card-Carousel.gif)

A reusable web component that creates a carousel with a reusable card item 

## Usage

1. Include the script in your HTML:
```html
<script src="https://raw.githack.com/dkay9/card-carousel-web-component/main/card-carousel.js" type="module" defer></script>
```

2. Add the component to your page:
```html
<card-carousel>
  <card-item
     image=""
     title=""
     description=""
     github=""
     preview=""
  ></card-item>
  <card-item
     image=""
     title=""
     description=""
     github=""
     preview=""
  ></card-item>
  <card-item
     image=""
     title=""
     description=""
     github=""
     preview=""
  ></card-item>
</card-carousel>
```

## Example

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://raw.githack.com/dkay9/card-carousel-web-component/main/card-carousel.js" type="module" defer></script>
</head>
<body>
    <card-carousel>
      <card-item
         image="https://picsum.photos/320/200"
         title="E-Commerce Website"
         description="Svelte + Vite"
         github="https://github.com/<user-name>/<repo-name>"
         preview="<link-to-live-site>"
      ></card-item>
      <card-item
         image="https://picsum.photos/320/200"
         title="Gym App"
         description="Php + Laravel"
         github="https://github.com/<user-name>/<repo-name>"
         preview="<link-to-live-site>"
      ></card-item>
      <card-item
         image="https://picsum.photos/320/200"
         title="Browser Extension UI"
         description="Javascript + Tailwind Css"
         github="https://github.com/<user-name>/<repo-name>"
         preview="<link-to-live-site>"
      ></card-item>
    </card-carousel>
</body>
</html>
```

## Features

- Multiple color themes (orange, blue, magenta)
- Gradient trail effect
- Click animation effects
- Automatically hides on touch devices
- No dependencies required
- Works in all modern browsers# Custom Cursor Web Component
