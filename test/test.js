(function() {

    var div = document.createElement('div');

    document.body.appendChild(div);

    var tid,
        i = 0,
        tests = [],
        len = 0,
        no = 1,
        l = 0,
        loads = 0,
        results = [];

    var loadScript = function() {
        var s = document.createElement('script');
        s.src = 'tests/' + loads[l] + '.js';
        document.body.appendChild(s);
    };

    var cycle = function() {

        if ( i >= len ) {
            return;
        }
        var test = tests[i];

        test.h2 = document.createElement('h2');
        var span = document.createElement('span');
        test.h2.innerHTML = test.name;
        span.innerHTML = loads[i] + '.js';
        test.h2.appendChild( span );
        div.appendChild(test.h2);
        results[i] = true;

        test.div = document.createElement('div');
        test.div.className = 'tests';
        div.appendChild(test.div);

        if ( test.open ) {
            test.div.className += ' open';
        }

        var cb = function( inner ) {
            return function(e) {
                var cl = inner.className;
                if ( /open/.test( cl ) ) {
                    inner.className = 'tests';
                } else {
                    inner.className = 'tests open'
                }
            }
        };

        if ( test.h2.attachEvent ) {
            test.h2.attachEvent('onclick', cb( test.div ) );
        } else {
            test.h2.addEventListener('click', cb( test.div ) );
        }


        if ( typeof test.setup == 'function') {
            test.setup();
        }
        no = 1;
        if ( typeof test.test == 'function') {
            test.test();
        }
        if ('async' in test && test.async === true ) {
            return;
        }
        destruct();
    };

    var destruct = function() {
        if ( tests[i] && 'teardown' in tests[i] ) {
            tests[i].teardown();
        }
        if ( tests[i].h2 ) {
            tests[i].h2.className = results[i] ? 'pass' : 'fail';
        }
        tests[i].div.className = 'tests';
        i++;
        cycle();
    }

    window.Test = {

        load: function( str ) {
            loads = str.split(' ');
            loadScript();
        },

        add: function( test ) {
            tests.push( test );
            l++;
            if (loads[l]) {
                loadScript();
            } else {
                len = tests.length;
                cycle();
            }
        }
    };

    window.end = function() {
        destruct();
    }

    window.assert = function( msg, test, warn ) {
        var p = document.createElement('p');
        p.className = test ? 'ok' : ( warn ? 'warning' : 'fail');
        p.innerHTML = no+'. '+msg;
        tests[i].div.appendChild(p);
        no ++;
        if ( !test ) {
            results[i] = false;
        }
    }
    window.log = function() {
        var msg = Array.prototype.slice.call(arguments);

        var p = document.createElement('p');
        p.className = 'log'
        p.innerHTML =  msg.join(' : ');
        tests[i].div.appendChild(p);

    }
    window.append = function(html) {
        tests[i].div.appendChild(html);
    }
}());