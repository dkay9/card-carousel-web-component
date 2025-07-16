# Card Carousel Web Component

![card carousel code pen example](./cursor.gif)

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
    <style>
        body { cursor: none; }
    </style>
</head>
<body>
    <custom-cursor theme="blue"></custom-cursor>
    <h1>Your content here</h1>
    <script src="custom-cursor.js"></script>
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

![animated cursor gif](./cursor.gif)

A reusable web component that creates a custom cursor with gradient trail effect.

## Usage

1. Include the script in your HTML:
```html
<script src="https://raw.githack.com/DevManSam777/custom-cursor/main/custom-cursor.js" defer></script>
```

2. Add the component to your page:
```html
<custom-cursor></custom-cursor>
```

3. Hide the default cursor:
```css
body {
    cursor: none;
}
```

## Themes

You can change the color theme using the `theme` attribute:

```html
<!-- Default orange theme -->
<custom-cursor></custom-cursor>

<!-- Blue theme -->
<custom-cursor theme="blue"></custom-cursor>

<!-- Magenta theme -->
<custom-cursor theme="magenta"></custom-cursor>
```

Available themes: `orange` (default), `blue`, `magenta`

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
</body>
</html>
```

## Features

- Multiple color themes (orange, blue, magenta)
- Gradient trail effect
- Click animation effects
- Automatically hides on touch devices
- No dependencies required
- Works in all modern browsers
