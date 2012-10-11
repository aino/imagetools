Test.add({
    name: 'naturalWidth/naturalHeight',
    async: true,
    test: function() {

        $(new Image).imageLoad(function() {
            assert('naturalWidth detected', this.width == this.naturalWidth);
            assert('naturalHeight detected', this.height == this.naturalHeight);
            end();
        }).attr('src', 'drop.jpg');

    }
});