(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, function (mx) { 'use strict';

    mx = 'default' in mx ? mx['default'] : mx;

    var qmodule = QUnit.module;
    var qtest = QUnit.test;

    qmodule('hash');

    qtest('basic hash', function (assert) {
        assert.equal(mx.hash(), 0, 'hash method without arguments!');
        assert.equal(mx.hash(null), 0, 'hash null is zero!');
        assert.equal(mx.hash(undefined), 0, 'hash undefined is zero!');
    });

}));

