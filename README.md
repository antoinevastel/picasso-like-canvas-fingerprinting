# Picasso based canvas fingerprinting

[![Actions Status](https://github.com/antoinevastel/picasso-like-canvas-fingerprinting//workflows/picasso-canvas-fingerprinting/badge.svg)](https://github.com/antoinevastel/picasso-like-canvas-fingerprinting/actions)
[![NPM package](https://img.shields.io/npm/v/picasso-canvas-fingerprinting.svg)](https://www.npmjs.com/package/picasso-canvas-fingerprinting)


## News:
I recently created a [website where you can see your browser fingerprint](https://deviceandbrowserinfo.com/info_device) and different fingerprinting-related signals like your IP address, your canvas fingerprint, your HTTP headers, etc. Some information is accessible both through a webpage and through APIs. Don't hesitate to bookmark it as I will add more signals and more content related to bots.

------------


Implementation of a canvas fingerprinting algorithm inspired by the [Picasso paper](https://ai.google/research/pubs/pub45581) written by Elie Bursztein.

An online demo is available on [my blog](https://antoinevastel.com/browser%20fingerprinting/2019/03/21/picasso-canvas-fingerprinting.html).

## Quick start

```html
You can host your own version of the Picasso canvas fingerprinting script or include it using Jsdelivr CDN.
<script src="https://cdn.jsdelivr.net/npm/picasso-canvas-fingerprinting/src/canvas.js"></script>
```

Once the Picasso script is loaded in your HTML page, you can use it as follows:
```html
<script>
    const params = {
        area: {
            width: 300,
            height: 300,
        },
        offsetParameter: 2001000001,
        fontSizeFactor: 1.5,
        multiplier: 15000,
        maxShadowBlur: 50,
    };

    // Number of shapes to draw. The higher the more costly it is.
    // Can be used as a way to adjust the aggressiveness of the proof of work (POW)
    const numShapes = 5;
    const initialSeed = Math.floor(100*Math.random());

    const canvasValue = picassoCanvas(
        numShapes, initialSeed, params
    );

    // canvasValue is a hash representing the result of the Picasso challenge, e.g.
    // c24b4a72badc95284b337aa304be1438
</script>
```

