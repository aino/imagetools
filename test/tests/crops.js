Test.add({
    name: 'Crops',
    async: true,
    setup: function() {
        $(new Image).attr({
            src: 'drop.jpg',
            id: 'testimg'
        }).hide().appendTo(document.body);
    },
    test: function() {

        var level = 0;

        $('#testimg').imageScale({
            height: 100,
            width: 100,
            crop: true,
            complete: function(container) {
                assert('Cropped to 100x100',
                    this.width == 160 &&
                    this.height == 100 &&
                    $(this).css('left') == '-30px' &&
                    $(container).width() == 100 &&
                    $(container).height() == 100
                );
                end();
            }
        });
    },
    teardown: function() {
        $('#testimg').remove();
    }
});