jQuery.imagetools
=================

Provides two helpers, a proper imageLoad method and a fully featured imageScale method.

$.fn.imageLoad
--------------
- polyfills naturalWidth/naturalHeight
- works for images that are already loaded
- provides fallbacks for browser bugs (f.ex adblock in chrome)

Example::

    $('img').imageLoad(function(e) {
        // loaded
    });

$.fn.imageScale
---------------
- gives you 6 different cropping options: true, false, width, height, landscape, portrait
- lets you upscale images
- lets you position the image using standard CSS positioning
- takes percent or pixels for responsive layouts
- creates a wrapper that hides overflowing parts if you crop the image
- never stretches an image unproportionally

Example::

    $('img').imageScale({
        width: 200,
        height: 200,
        crop: true,
        complete: function() {
            // loaded and scaled
        }
    });

--

MIT license. Made by aino.com