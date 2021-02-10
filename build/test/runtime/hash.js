(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.mx));
}(this, (function (mx) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var mx__default = /*#__PURE__*/_interopDefaultLegacy(mx);

    var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
    var qmodule = qunit.module;
    var qtest = qunit.test;
    qunit.expect;

    /*jshint -W053 */

    qmodule('hash');

    var MAX_HASH_VALUE = 0X7FFFFFFF;
    var MIN_HASH_VALUE = -0X7FFFFFFF - 1;

    function isValidHashValue(hash) {
        return hash >= MIN_HASH_VALUE && hash <= MAX_HASH_VALUE;
    }

    qtest('basic hash', function (assert) {
        assert.equal(mx__default['default'].hash(), 0, 'hash method without arguments!');
        assert.equal(mx__default['default'].hash(null), 0, 'hash null is zero!');
        assert.equal(mx__default['default'].hash(undefined), 0, 'hash undefined is zero!');
    });


    qtest('boolean hash', function (assert) {
        assert.equal(mx__default['default'].hash(true), 1, 'hash true is 1!');
        assert.equal(mx__default['default'].hash(false), 0, 'hash false is 0!');
        assert.ok(isValidHashValue(mx__default['default'].hash(new Boolean(true))), 'hash Boolean class values!');
    });


    qtest('numeric hash', function (assert) {
        assert.equal(mx__default['default'].hash(NaN), 0, 'hash NaN is zero!');

        assert.equal(mx__default['default'].hash(0), 0, 'hash 0 is 0!');
        assert.equal(mx__default['default'].hash(-0), 0, 'hash -0 is 0!');

        assert.equal(mx__default['default'].hash(1), 1, 'hash 1 is 1!');
        assert.equal(mx__default['default'].hash(2), 2, 'hash 2 is 2!');
        assert.equal(mx__default['default'].hash(100), 100, 'hash 100 is 100!');
        assert.equal(mx__default['default'].hash(100000), 100000, 'hash 100000 is 100000!');
        assert.equal(mx__default['default'].hash(10000000), 10000000, 'hash 10000000 is 10000000!');
        assert.equal(mx__default['default'].hash(1000000000), 1000000000, 'hash 1000000000 is 1000000000!');
        assert.equal(mx__default['default'].hash(-1), -1, 'hash -1 is -1!');
        assert.equal(mx__default['default'].hash(-2), -2, 'hash -2 is -2!');
        assert.equal(mx__default['default'].hash(-100), -100, 'hash -100 is -100!');
        assert.equal(mx__default['default'].hash(-100000), -100000, 'hash -100000 is -100000!');
        assert.equal(mx__default['default'].hash(-10000000), -10000000, 'hash -10000000 is -10000000!');
        assert.equal(mx__default['default'].hash(-1000000000), -1000000000, 'hash -1000000000 is -1000000000!');

        assert.equal(mx__default['default'].hash(MAX_HASH_VALUE), MAX_HASH_VALUE, 'maximum hash value!');
        assert.equal(mx__default['default'].hash(MIN_HASH_VALUE), MIN_HASH_VALUE, 'minimum hash value!');
        assert.ok(isValidHashValue(mx__default['default'].hash(MAX_HASH_VALUE)), 'maximum hash is 0X7FFFFFFF!');
        assert.ok(isValidHashValue(mx__default['default'].hash(MIN_HASH_VALUE)), 'minimum hash is -0X7FFFFFFF!');
        assert.ok(isValidHashValue(mx__default['default'].hash(Number.MAX_VALUE)), 'hash MAX_VALUE');
        assert.ok(isValidHashValue(mx__default['default'].hash(Number.MIN_VALUE)), 'hash MIN_VALUE');
        assert.ok(isValidHashValue(mx__default['default'].hash(Number.POSITIVE_INFINITY)), 'hash POSITIVE_INFINITY');
        assert.ok(isValidHashValue(mx__default['default'].hash(Number.NEGATIVE_INFINITY)), 'hash NEGATIVE_INFINITY');

        assert.equal(mx__default['default'].hash(0.1), mx__default['default'].hash(0.1), 'hash 0.1!');
        assert.equal(mx__default['default'].hash(0.01), mx__default['default'].hash(0.01), 'hash 0.01!');
        assert.equal(mx__default['default'].hash(0.001), mx__default['default'].hash(0.001), 'hash 0.001!');
        assert.equal(mx__default['default'].hash(0.0001), mx__default['default'].hash(0.0001), 'hash 0.001!');
        assert.equal(mx__default['default'].hash(0.000001), mx__default['default'].hash(0.000001), 'hash 0.00001!');
        assert.equal(mx__default['default'].hash(0.000000001), mx__default['default'].hash(0.000000001), 'hash 0.000000001!');
        assert.equal(mx__default['default'].hash(0.000000000001), mx__default['default'].hash(0.000000000001), 'hash 0.000000000001!');
        assert.equal(mx__default['default'].hash(-0.1), mx__default['default'].hash(-0.1), 'hash -0.1!');
        assert.equal(mx__default['default'].hash(-0.01), mx__default['default'].hash(-0.01), 'hash -0.01!');
        assert.equal(mx__default['default'].hash(-0.001), mx__default['default'].hash(-0.001), 'hash -0.001!');
        assert.equal(mx__default['default'].hash(-0.0001), mx__default['default'].hash(-0.0001), 'hash -0.001!');
        assert.equal(mx__default['default'].hash(-0.000001), mx__default['default'].hash(-0.000001), 'hash -0.00001!');
        assert.equal(mx__default['default'].hash(-0.000000001), mx__default['default'].hash(-0.000000001), 'hash -0.000000001!');
        assert.equal(mx__default['default'].hash(-0.000000000001), mx__default['default'].hash(-0.000000000001), 'hash -0.000000000001!');

        assert.ok(isValidHashValue(mx__default['default'].hash(0.1)), 'hash 0.1 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(0.001)), 'hash 0.001 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(0.00001)), 'hash 0.00001 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(0.0000001)), 'hash 0.0000001 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(0.000000001)), 'hash 0.000000001 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(0.00000000001)), 'hash 0.00000000001 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(0.0000000000001)), 'hash 0.0000000000001 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(0.000000000000001)), 'hash 0.000000000000001 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(0.00000000000000001)), 'hash 0.00000000000000001 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(0.0000000000000000001)), 'hash 0.0000000000000000001 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(-0.1)), 'hash -0.1 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(-0.001)), 'hash -0.001 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(-0.00001)), 'hash -0.00001 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(-0.0000001)), 'hash -0.0000001 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(-0.000000001)), 'hash -0.000000001 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(-0.00000000001)), 'hash -0.00000000001 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(-0.0000000000001)), 'hash -0.0000000000001 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(-0.000000000000001)), 'hash -0.000000000000001 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(-0.00000000000000001)), 'hash -0.00000000000000001 is valid!');
        assert.ok(isValidHashValue(mx__default['default'].hash(-0.0000000000000000001)), 'hash -0.0000000000000000001 is valid!');

        assert.ok(isValidHashValue(mx__default['default'].runtime.hashMany(1, 2, 3, 4, 5, 6, 7, 8, 9)), 'hash multiple int values!');
        assert.ok(isValidHashValue(mx__default['default'].runtime.hashMany(0X7FFFFF, 0X7FFFFF, 0X7FFFFF, 0X7FFFFF)), 'hash multiple big int values!');
        assert.ok(isValidHashValue(mx__default['default'].runtime.hashMany(0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9)), 'hash multiple float values!');
        assert.ok(isValidHashValue(mx__default['default'].runtime.hashMany(0X7FFFFF + 0.1, 0X7FFFFF + 0.2, 0X7FFFFF + 0.3, 0X7FFFFF + 0.4)), 'hash multiple big float values!');

        //assert.equal(mx.hash(0b10), 2, 'hash binary value 0b10!');
        //assert.equal(mx.hash(0o10), 8, 'hash octal value 0o10!');
        assert.equal(mx__default['default'].hash(0x10), 16, 'hash hex value 0x10!');
        assert.ok(isValidHashValue(mx__default['default'].hash(new Number(1))), 'hash Number class values!');

        for (var i = 0; i < 64; i++) {
            var num = Math.pow(2, i);
            assert.equal(mx__default['default'].hash(num), mx__default['default'].hash(num), 'hash number "' + num + '"!');
            assert.equal(mx__default['default'].hash(-num), mx__default['default'].hash(-num), 'hash number "' + -num + '"!');
            assert.ok(isValidHashValue(mx__default['default'].hash(num)), 'valid number "' + num + '" hash');
            assert.ok(isValidHashValue(mx__default['default'].hash(-num)), 'valid number "' + -num + '" hash');
        }
    });


    qtest('string hash', function (assert) {
        assert.equal(mx__default['default'].hash(''), mx__default['default'].hash(''), 'hash empty string!');
        assert.equal(mx__default['default'].hash('Hello World!'), mx__default['default'].hash('Hello World!'), 'hash "Hello World!" string!');
        assert.notEqual(mx__default['default'].hash('hello world!'), mx__default['default'].hash('Hello World!'), 'hash "Hello World!" is not equal to "hello world"!');
        assert.notEqual(mx__default['default'].hash('0'), mx__default['default'].hash(0), 'hash "0" is not equal to 0');
        assert.notEqual(mx__default['default'].hash('1'), mx__default['default'].hash(1), 'hash string "1" is not equal to 1');

        assert.ok(isValidHashValue(mx__default['default'].hash('this is a test')), 'valid simple text');
        assert.ok(isValidHashValue(mx__default['default'].hash('A', 'B', 'C', 'D', 'E')), 'Combinne string hash codes');
        assert.ok(isValidHashValue(mx__default['default'].hash(mx__default['default'].hash(new Array(10000).join('A')))), 'valid hash for a very long string!');
        assert.ok(isValidHashValue(mx__default['default'].hash(new Array(10000).join('A'), new Array(10000).join('B'))), 'Combinne string hash codes for a big array');
        assert.ok(isValidHashValue(mx__default['default'].hash(new String('strig'))), 'hash String class values!');

        for (var i = 0; i < 128; i++) {
            var char = String.fromCharCode(i);
            assert.equal(mx__default['default'].hash(char), mx__default['default'].hash(char), 'hash ASCII character "' + char + '"!');
            assert.ok(isValidHashValue(mx__default['default'].hash(char)), 'valid ASCII character "' + char + '" hash');
        }
    });


    qtest('date hash', function (assert) {
        assert.equal(mx__default['default'].hash(new Date(2016, 0, 1)), mx__default['default'].hash(new Date(2016, 0, 1)), 'hash exact dates are equal!');
        assert.equal(mx__default['default'].hash(new Date(2116, 0, 1)), mx__default['default'].hash(new Date(2116, 0, 1)), 'hash 100 years from now!');
        assert.equal(mx__default['default'].hash(new Date(3016, 0, 1)), mx__default['default'].hash(new Date(3016, 0, 1)), 'hash 1000 years from now!');
        assert.equal(mx__default['default'].hash(new Date(1016, 0, 1)), mx__default['default'].hash(new Date(1016, 0, 1)), 'hash 1000 years before!');
        assert.equal(mx__default['default'].hash(new Date(100, 0, 1)), mx__default['default'].hash(new Date(100, 0, 1)), 'hash 1900 years before!');

        assert.ok(isValidHashValue(mx__default['default'].hash(new Date(2016, 0, 1))), 'valid hash now');
        assert.ok(isValidHashValue(mx__default['default'].hash(new Date(2116, 0, 1))), 'valid hash 100 years from now!');
        assert.ok(isValidHashValue(mx__default['default'].hash(new Date(3016, 0, 1))), 'valid hash 1000 years from now!');
        assert.ok(isValidHashValue(mx__default['default'].hash(new Date(1016, 0, 1))), 'valid hash 1000 years before!');
        assert.ok(isValidHashValue(mx__default['default'].hash(new Date(100, 0, 1))), 'valid hash 1900 years before!');

        for (var i = 1; i <= 365; i++) {
            var date = new Date(2016, 0, i);
            assert.equal(mx__default['default'].hash(date), mx__default['default'].hash(date), 'hash date"' + date + '"!');
            assert.ok(isValidHashValue(mx__default['default'].hash(date)), 'valid date "' + date + '" hash');
        }
    });


    qtest('class types hash', function (assert) {
        function SimpleClass(val) {
            this._val = val;
        }

        function SimpleClassWithHash(val) {
            this._val = val;

            this[mx__default['default'].runtime.hashSymbol] = function () {
                return mx__default['default'].hash(this._val);
            };
        }

        var obj1 = new SimpleClass(1),
            obj2 = new SimpleClassWithHash(1),
            arr = [1],
            fun = function () { },
            err = new Error();

        assert.ok(isValidHashValue(mx__default['default'].hash(obj1)), 'valid hash class instance');
        assert.equal(mx__default['default'].hash(obj1), mx__default['default'].hash(obj1), 'hash code for class instance is constant!');
        assert.notEqual(mx__default['default'].hash(obj1), mx__default['default'].hash(new SimpleClass(1)), 'hash code for different class instances are different!');

        assert.ok(isValidHashValue(mx__default['default'].hash(obj2)), 'valid hash class instance overriding hash method');
        assert.equal(mx__default['default'].hash(obj2), mx__default['default'].hash(obj2), 'hash code for class instance overriding hash method is constant!');
        assert.equal(mx__default['default'].hash(obj2), mx__default['default'].hash(new SimpleClassWithHash(1)), 'hash code for different class instances overriding hash method are equal!');


        assert.ok(isValidHashValue(mx__default['default'].hash(arr)), 'valid hash Array instance');
        assert.equal(mx__default['default'].hash(arr), mx__default['default'].hash(arr), 'hash code for Array instance is constant!');
        assert.notEqual(mx__default['default'].hash(arr), mx__default['default'].hash([1]), 'hash code for different Array instances are different!');

        assert.ok(isValidHashValue(mx__default['default'].hash(fun)), 'valid hash Function instance');
        assert.equal(mx__default['default'].hash(fun), mx__default['default'].hash(fun), 'hash code for Function instance is constant!');
        assert.notEqual(mx__default['default'].hash(fun), mx__default['default'].hash(function () { }), 'hash code for different Function instances are different!');

        assert.ok(isValidHashValue(mx__default['default'].hash(err)), 'valid hash Error instance');
        assert.equal(mx__default['default'].hash(err), mx__default['default'].hash(err), 'hash code for Error instance is constant!');
        assert.notEqual(mx__default['default'].hash(err), mx__default['default'].hash(new Error()), 'hash code for different Error instances are different!');
    });


    qtest('object literal hash', function (assert) {
        assert.ok(isValidHashValue(mx__default['default'].hash({})), 'valid hash object literal');
        assert.equal(mx__default['default'].hash({}), mx__default['default'].hash({}), 'hash code for empty equal object literals is equal!');
        assert.equal(mx__default['default'].hash({ val: 1 }), mx__default['default'].hash({ val: 1 }), 'hash code for equal object literals is equal!');
        assert.equal(mx__default['default'].hash({ val: 1, sub: { val: 2, sum: { val: 3 } } }), mx__default['default'].hash({ val: 1, sub: { val: 2, sum: { val: 3 } } }), 'hash code for equal complex object literals is equal!');
        assert.notEqual(mx__default['default'].hash({ method: function () { } }), mx__default['default'].hash({ method: function () { } }), 'object literal hash method does include methods!');

        assert.notEqual(mx__default['default'].hash({ val: 1 }), mx__default['default'].hash({ val: 2 }), 'hash code for non equal object literals is not equal!');
        assert.notEqual(mx__default['default'].hash({ val: 1, sub: { val: 2, sum: { val: 3 } } }), mx__default['default'].hash({ val: 1, sub: { val: 2, sum: { val: 4 } } }), 'hash code for non equal complex object literals is not equal!');

        var o1 = {};
        o1.prop = o1;
        assert.ok(isValidHashValue(mx__default['default'].hash(o1)), 'hash code for object literals with circular reference');

        var o2 = { val: 1 };
        var o3 = { val: 1 };
        Object.defineProperty(o2, 'name', { value: 'o2', enumerable: false });
        Object.defineProperty(o3, 'name', { value: 'o3', enumerable: false });
        assert.equal(mx__default['default'].hash(o2), mx__default['default'].hash(o3), 'object literal hash method does not include non-enumerable properties!');

        o2.Id = 1;
        o3.Id = 2;
        assert.equal(mx__default['default'].hash(o2), mx__default['default'].hash(o3), 'object literal hash does not change, even if properties change!');

        assert.equal(mx__default['default'].hash(Object.seal({ val: 1 })), mx__default['default'].hash(Object.seal({ val: 1 })), 'object literal hash does works for frozen objects!');

        for (var i = 1; i <= 100; i++) {
            var obj = { val: i };
            assert.equal(mx__default['default'].hash(obj), mx__default['default'].hash(obj), 'hash object literal"{ val: ' + i + ' }"!');
            assert.ok(isValidHashValue(mx__default['default'].hash(obj)), 'valid object literal "{ val: ' + i + ' }" hash');
        }
    });

})));

