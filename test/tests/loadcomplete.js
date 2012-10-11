Test.add({
    name: 'imageLoad after image is loaded',
    async: true,
    test: function() {

        var done = false;

        $(new Image).load(function() {
            if ( this.complete ) {
                $(this).imageLoad(function() {
                    assert('imageLoad triggered on loaded image', true);
                    done = true;
                    end();
                });
                window.setTimeout(function() {
                    if ( !done ) {
                        assert('imageLoad not triggered after 1s', false);
                        end();
                    }
                },1000);
            }
        }).attr('src', 'drop.jpg');
    }
});