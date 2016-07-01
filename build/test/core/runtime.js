(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, function (mx) { 'use strict';

    mx = 'default' in mx ? mx['default'] : mx;

    var module$1 = QUnit.module;
    var test = QUnit.test;

    module$1('runtime');

    test('dummy', function (assert) {
        assert.ok(mx === mx, 'Dummy test!');
    });

}));

