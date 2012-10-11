/*

jQuery.imagetools
Provides two helpers, a proper imageLoad method and a fully featured imageScale method

----------------------

$.fn.imageLoad
- polyfills naturalWidth/naturalHeight
- works for images that are already loaded
- provides fallbacks for browser bugs (f.ex adblock in chrome)

----------------------

$.fn.imageScale
- gives you 6 different cropping options: true, false, width, height, landscape, portrait
- lets you upscale images
- lets you position the image using standard CSS positioning
- takes percent or pixels for responsive layouts
- creates a wrapper that hides overflowing parts if you crop the image
- never stretches an image unproportionally

----------------------

MIT license. Made by aino.com

*/


/*global jQuery, window, document, Image */

(function($) {

    $.extend($.fn, {

        imageLoad: function( callback ) {

            callback = callback || function(){};

            var complete = function(event) {
                    if ( !('naturalWidth' in this) ) {
                        this.naturalWidth = this.width;
                        this.naturalHeight = this.height;
                    }
                    callback.call(this, event);
                },
                ready = function() {
                    return this.complete && this.width && this.height;
                };

            return this.each(function() {

                if ( this.nodeName != 'IMG' ) {
                    $(this).find('img').imageLoad( callback );
                    return;
                }

                if ( !ready.call(this) ) {
                    $(this).load(function(e) {
                        window.setTimeout((function(img) {
                            return function() {
                                if ( !ready.call( img ) && !$(img).data('reload') ) {
                                    $(new Image()).attr('src', img.src).data('reload', true).imageLoad( callback );
                                    return;
                                }
                                complete.call(img, e);
                            };
                        }(this)),1);
                    });
                } else {
                    complete.call(this, {});
                }
            });
        },

        imageScale: function( options ) {

            options = $.extend( {
                crop: false,
                position: '50% 0',
                upscale: false,
                complete: function(){}
            }, options );

            return this.each(function() {

                var img = this,
                    $img = $(img),
                    rperc = /%/;

                if ( !this.complete || !this.width || !this.height || !this.naturalWidth || !this.naturalHeight ) {
                    $img.css('visibility', 'hidden').imageLoad( function() {
                        $(this).imageScale( options );
                    });
                    return;
                }

                $img.hide();

                var ow = options.width,
                    oh = options.height,
                    loop = ['width', 'height'],
                    $parent = $img.parent(),
                    nwidth = img.naturalWidth,
                    nheight = img.naturalHeight,
                    ch = 0, cw = 0;

                if ( !ow && !oh ) {
                    $img.show().css('vibility', 'visible');
                    options.complete.call(img);
                    return;
                }

                if ( rperc.test( [ow, oh ].join('')) ) {
                    var $tmf = $parent.data('imagewrapper') ? $parent.parent() : $parent,
                        overflow,
                        $body = $(document.body);

                    // special case, if measured against body we need to remove scrollbars first for webkit
                    if ( $tmf.get(0) === document.body ) {
                        overflow = $body.css('overflow');

                        $body.css({
                            overflow: 'hidden'
                        });

                        cw = $body.width();
                        ch = $(window).height(); // window.height is most like what we want here

                    } else {
                        cw = $tmf.width();
                        ch = $tmf.height();
                    }

                    if ( overflow ) {
                        $body.css('overflow', overflow);
                    }

                    ow = rperc.test(ow) ? (parseInt(ow,10)/100)*cw : ow;
                    oh = rperc.test(oh) ? (parseInt(oh,10)/100)*ch : oh;
                }

                ow = ow || img.naturalWidth * ( oh / img.naturalHeight );
                oh = oh || img.naturalHeight * ( ow / img.naturalWidth );

                var parent = $parent.get(0),
                    $wrap = $parent.data('imagewrapper') ? $parent : $('<div>').css({
                        visibility: 'hidden',
                        overflow: 'hidden'
                    }).addClass('imagescale').data('imagewrapper', true),

                    newWidth = ow / nwidth,
                    newHeight = oh / nheight,
                    min = Math.min( newWidth, newHeight ),
                    max = Math.max( newWidth, newHeight ),
                    cropMap = {
                        'true'  : max,
                        'width' : newWidth,
                        'height': newHeight,
                        'false' : min,
                        'landscape': nwidth > nheight ? max : min,
                        'portrait': nwidth < nheight ? max : min
                    },
                    ratio = cropMap[ options.crop.toString() ];

                if ( !options.upscale ) {
                    ratio = Math.min(1, ratio);
                }

                newHeight = Math.ceil(nheight * ratio);
                newWidth = Math.ceil(nwidth * ratio);

                $(this).width( newWidth ).height( newHeight );

                $wrap.css({
                    width:  ow,
                    height: oh,
                    position: 'relative'
                });

                // calculate image_position
                var pos = {},
                    mix = {},
                    getPosition = function(value, measure, margin) {
                        var result = 0;
                        if (/\%/.test(value)) {
                            var flt = parseInt( value, 10 ) / 100,
                                m = /width/i.test(measure) ? newWidth : newHeight;

                            result = Math.ceil( m * -1 * flt + margin * flt );
                        } else {
                            result = parseInt( value, 10 );
                        }
                        return result;
                    },
                    positionMap = {
                        'top': { top: 0 },
                        'left': { left: 0 },
                        'right': { left: '100%' },
                        'bottom': { top: '100%' }
                    };

                $.each( options.position.toLowerCase().split(' '), function( i, value ) {
                    if ( value === 'center' ) {
                        value = '50%';
                    }
                    pos[i ? 'top' : 'left'] = value;
                });

                $.each( pos, function( i, value ) {
                    if ( positionMap.hasOwnProperty( value ) ) {
                        $.extend( mix, positionMap[ value ] );
                    }
                });

                pos = pos.top ? $.extend( pos, mix ) : mix;

                pos = $.extend({
                    top: '50%',
                    left: '50%'
                }, pos);

                // apply position
                $(this).css({
                    position : 'absolute',
                    top :  getPosition(pos.top, 'height', oh),
                    left : getPosition(pos.left, 'width', ow)
                });

                $wrap.css('visibility', 'visible');

                if ( parent && !$(parent).data('imagewrapper') ) {
                    $(parent.insertBefore($wrap.get(0), img)).append(img);
                }

                $img.show().css('visibility', 'visible');

                options.complete.call(img, $wrap.get(0));

            });

        }
    });
}(jQuery));