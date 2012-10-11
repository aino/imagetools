Test.add({
    name: 'Load children',
    async: true,
    setup: function() {
        $(new Image).attr('src', 'drop.jpg').hide().appendTo(document.body);
    },
    test: function() {
        $(document.body).imageLoad(function(){
            assert('Image loaded inside body', $(this).attr('src') == 'drop.jpg');
            end();
        });
    },
    teardown: function() {
        $('img').remove();
    }
});