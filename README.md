# Contao MATE Smooth Slider

Update-safe enhancement for the Contao MATE news slider.

The bundle adds smooth image and text transitions without modifying
MATE vendor files or replacing the native MATE slider.

## Features

- True image crossfade without exposing the slider background
- Independent fade-out and fade-in of the news text
- Stable MATE caption background during transitions
- Full reading time between automatic transitions
- Responsive image overlay follows MATE's native image area
- Uses the image resource actually selected by the browser (`currentSrc`)
- Works with the existing MATE news-slider markup
- No MATE vendor modifications

## Default timing

The current version uses:

- Image crossfade: 1200 ms
- Text fade-out: 1200 ms
- Text fade-in: 1200 ms
- Hold time: 10000 ms

The timing constants are defined in `public/js/mate-smooth-slider.js`.

## How it works

MATE remains responsible for the slider structure and responsive layout.

The bundle:

1. pauses MATE's automatic slider timer,
2. keeps the current image fully visible,
3. fades the next image over it,
4. fades `.caption .layout_latest` independently,
5. performs the underlying MATE slide switch,
6. fades the new text in,
7. starts a new hold period.

A single scheduler is used so that each slide receives the full configured
hold time after its transition has completed.

### Responsive image geometry

The image overlay does not contain fixed MATE breakpoints or fixed desktop
dimensions.

Its position and size are derived from the native `.img` element of the
active MATE slide and are updated when the viewport is resized.

This keeps responsive layout decisions in MATE or the site-specific theme
instead of duplicating them in this bundle.

## Scope

This bundle controls transition behaviour only.

It intentionally does not define:

- headline or teaser typography,
- caption dimensions or padding,
- project-specific responsive breakpoints,
- teaser truncation,
- call-to-action design.

Those remain responsibilities of MATE and the site's own theme/CSS.

## Compatibility

Verified environments:

- Contao 4.13.58 with MATE 2.21.4
- Contao 5.3.51 with MATE 3.6.4
- Contao 5.7.13 with MATE 3.6.4

Composer requirements:

- PHP `>=8.1 <8.5`
- Contao `^4.13 || ^5.3`
- MATE `^2.21.4 || >=3.5.4 <4.0`

## Native MATE slider

The bundle works on top of MATE's existing Materialize slider.

The native slider instance and its current options can be inspected in the
browser console with:

`document.querySelector('.slider.mod_newslist')?.M_Slider?.options`

MATE versions and individual installations can use different native
`duration` and `interval` values.

No MATE vendor files need to be modified.

## Manual navigation

Automatic transitions use the smooth image and text transition provided by
this bundle.

In the current version, MATE's existing previous/next controls keep their
native immediate behaviour. Manual navigation does not restart the bundle's
automatic hold timer.

The next automatic transition synchronizes image and text again.

## Development status

The transition implementation has been tested with MATE 2.x and MATE 3.x
on Contao 4.13, 5.3 and 5.7.

No MATE vendor files are modified.

## License

Contao MATE Smooth Slider is licensed under the MIT License.

Contao MATE Smooth Slider is an independent extension for the MATE Theme.
MATE itself is a separate product and is subject to its own license terms.
The MATE Theme is not included in this package.
