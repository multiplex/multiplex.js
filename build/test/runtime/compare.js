(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../../multiplex')) :
    typeof define === 'function' && define.amd ? define(['../../multiplex'], factory) :
    (factory(global.mx));
}(this, (function (mx) { 'use strict';

mx = 'default' in mx ? mx['default'] : mx;

var qunit = typeof QUnit === 'undefined' ? require('qunitjs') : QUnit;
var qmodule = qunit.module;
var qtest = qunit.test;

/*jshint -W053 */

qmodule('compare');

qtest('basic compare', function (assert) {
    assert.equal(mx.compare(null, null), 0, 'compare null values');
    assert.equal(mx.compare(undefined, undefined), 0, 'compare undefined values');
    assert.ok(mx.compare(null, undefined) !== 0, 'compare null and undefined values');
    assert.ok(mx.compare(undefined, null) !== 0, 'compare undefined and null values');
});


qtest('numeric compare', function (assert) {
    var POSITIVE_INFINITY = Number.POSITIVE_INFINITY || Infinity;
    var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY || -Infinity;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 0x1FFFFFFFFFFFFF;
    var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -0x1FFFFFFFFFFFFF;

    assert.equal(mx.compare(0, null), 1, 'any numeric value is greater than null');
    assert.equal(mx.compare(0, undefined), 1, 'any numeric value is greater than undefined');

    assert.equal(mx.compare(NaN, null), 1, 'NaN is greater than null');
    assert.equal(mx.compare(NaN, undefined), 1, 'NaN is greater than undefined');
    assert.equal(mx.compare(NaN, 0), -1, 'NaN is less than any value');
    assert.equal(mx.compare(0, NaN), 1, 'any value is greater than NaN');
    assert.notEqual(mx.compare(NaN, NaN), 0, 'compare NaN values');

    assert.equal(mx.compare(0, -0), 0, '0 is equal to -0');
    assert.equal(mx.compare(1, 0), 1, 'simple greater than compare');
    assert.equal(mx.compare(0, 1), -1, 'simple less than compare');

    assert.equal(mx.compare(0.5, 0.1), 1, 'float number greater than compare');
    assert.equal(mx.compare(0.1, 0.5), -1, 'float number less than compare');

    assert.equal(mx.compare(5e-100, 1e-100), 1, 'high precision float number greater than compare');
    assert.equal(mx.compare(1e-100, 5e-100), -1, 'high precision float number less than compare');

    assert.equal(mx.compare(POSITIVE_INFINITY, MAX_SAFE_INTEGER), 1, 'POSITIVE_INFINITY is greater then any value');
    assert.equal(mx.compare(MAX_SAFE_INTEGER, POSITIVE_INFINITY), -1, 'any value is less than POSITIVE_INFINITY');
    assert.equal(mx.compare(NEGATIVE_INFINITY, MIN_SAFE_INTEGER), -1, 'POSITIVE_INFINITY is less then any value');
    assert.equal(mx.compare(MIN_SAFE_INTEGER, NEGATIVE_INFINITY), 1, 'any value is greater than NEGATIVE_INFINITY');

    for (var i = 0; i < 64; i++) {
        var num1 = Math.pow(2, i);
        var num2 = Math.pow(2, i + 1);

        assert.equal(mx.compare(num1, num1), 0, 'compare equal numbers: ' + num1);
        assert.equal(mx.compare(num1, num2), -1, 'compare numbers: "' + num1 + '", "' + num2 + '"');
        assert.equal(mx.compare(num2, num1), 1, 'compare numbers: "' + num2 + '", "' + num1 + '"');
    }
});


qtest('string compare', function (assert) {
    assert.equal(mx.compare('', null), 1, 'any string value is greater than null');
    assert.equal(mx.compare('', undefined), 1, 'any string value is greater than undefined');

    assert.equal(mx.compare('', ''), 0, 'compare empty strings');
    assert.equal(mx.compare('', ' '), -1, 'empty string is less than any string value');
    assert.equal(mx.compare(' ', ''), 1, 'any string value is greater than empty string');

    assert.equal(mx.compare('a', 'a'), 0, 'equal 1 character string compare');
    assert.equal(mx.compare('string', 'string'), 0, 'equal multi character string compare');
    assert.equal(mx.compare(new Array(10000).join('A'), new Array(10000).join('A')), 0, 'equal long string compare');

    assert.equal(mx.compare('a', 'b'), -1, '1 character string less than compare');
    assert.equal(mx.compare('string a', 'string b'), -1, 'multi character string less than compare');
    assert.equal(mx.compare(new Array(10000).join('A') + 'a', new Array(10000).join('A') + 'b'), -1, 'long string less than compare');

    assert.equal(mx.compare('b', 'a'), 1, '1 character string greater than compare');
    assert.equal(mx.compare('string b', 'string a'), 1, 'multi character string greater than compare');
    assert.equal(mx.compare(new Array(10000).join('A') + 'b', new Array(10000).join('A') + 'a'), 1, 'long string greater than compare');

    assert.equal(mx.compare('a', new String('b')), -1, 'less than string object compare');
    assert.equal(mx.compare('b', new String('a')), 1, 'greater than string object compare');
    assert.equal(mx.compare('a', new String('a')), 0, 'equal to string object compare');

    assert.equal(mx.compare('', 1), -1, 'less than non-string compare: 1');
    assert.equal(mx.compare('1', 1), 0, 'equal to non-string compare: 1');
    assert.equal(mx.compare('', true), -1, 'less than non-string compare: true');
    assert.equal(mx.compare('true', true), 0, 'equal to non-string compare: true');
    assert.equal(mx.compare('', {}), -1, 'less than non-string compare: object');
    assert.equal(mx.compare('[object Object]', {}), 0, 'equal to non-string compare: object');

    var characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    for (var i = 0; i < characters.length - 1; i++) {
        var char1 = characters.charAt(i);
        var char2 = characters.charAt(i + 1);
        assert.equal(mx.compare(char1, char1), 0, 'compare equal ASCII characters: "' + char1 + '"!');
        assert.equal(mx.compare(char1, char2), -1, 'compare ASCII characters: "' + char1 + '", "' + char2 + '"!');
        assert.equal(mx.compare(char2, char1), 1, 'compare ASCII character: "' + char2 + '", "' + char1 + '"!');
    }
});


qtest('boolean compare', function (assert) {
    assert.equal(mx.compare(true, null), 1, 'true is greater than null');
    assert.equal(mx.compare(true, undefined), 1, 'true is greater than undefined');

    assert.equal(mx.compare(false, null), 1, 'false is greater than null');
    assert.equal(mx.compare(false, undefined), 1, 'false is greater than undefined');

    assert.equal(mx.compare(true, true), 0, 'compare true values');
    assert.equal(mx.compare(false, false), 0, 'compare false values');
    assert.equal(mx.compare(true, false), 1, 'true is greater than false');
    assert.equal(mx.compare(false, true), -1, 'false is less than true');

    assert.equal(mx.compare(true, ''), 1, 'true is greater than empty string');
    assert.equal(mx.compare(false, ''), -1, 'false is less than empty string');

    assert.equal(mx.compare(true, 'a'), -1, 'true is less than any string');
    assert.equal(mx.compare(false, 'a'), -1, 'true is less than any string');

    assert.equal(mx.compare(true, 0), 1, 'true is greater than 0');
    assert.equal(mx.compare(false, 0), -1, 'false is less than 0');

    assert.equal(mx.compare(true, 1), -1, 'true is less than any positive number');
    assert.equal(mx.compare(true, -1), 1, 'true is greater than any negative number');
    assert.equal(mx.compare(false, 1), -1, 'false is less than any positive number');
    assert.equal(mx.compare(false, -1), 1, 'false is greater than any negative number');
});


qtest('compare using __cmp__ method', function (assert) {
    function SimpleCompare(val) {
        this._val = val;

        this[mx.runtime.compareSymbol] = function (obj) {
            return this._val > obj._val ? 1 : (this._val < obj._val ? -1 : 0);
        };
    }

    assert.equal(mx.compare(new SimpleCompare(1), null), 1, 'any object using comparer function is greater than null');
    assert.equal(mx.compare(new SimpleCompare(1), undefined), 1, 'any object using comparer function is greater than undefined');
    assert.equal(mx.compare(new SimpleCompare(1), new SimpleCompare(1)), 0, 'compare equal objects overriding compare method');
    assert.equal(mx.compare(new SimpleCompare(1), new SimpleCompare(0)), 1, 'compare greater than objects overriding compare method');
    assert.equal(mx.compare(new SimpleCompare(0), new SimpleCompare(1)), -1, 'compare less than objects overriding compare method');
});


qtest('compare regular objects', function (assert) {
    assert.equal(mx.compare({}, null), 1, 'any object is greater than null');
    assert.equal(mx.compare({}, undefined), 1, 'any object is greater than undefined');

    assert.equal(mx.compare({}, {}), 0, 'compare empty object literals');
    assert.equal(mx.compare({ val: 1 }, { val: 2 }), 0, 'compare object literals');
    assert.equal(mx.compare({ val: 2 }, { val: 1 }), 0, 'compare object literals');

    var o1 = {
        val: 1,
        valueOf: function () {
            return this.val;
        }
    };

    var o2 = {
        val: 2,
        valueOf: function () {
            return this.val;
        }
    };

    assert.equal(mx.compare(o1, null), 1, 'any object using valueOf function is greater than null');
    assert.equal(mx.compare(o1, undefined), 1, 'any object using valueOf function is greater than undefined');
    assert.equal(mx.compare(o1, o2), -1, 'compare object literals using valueOf method: less than');
    assert.equal(mx.compare(o2, o1), 1, 'compare object literals using valueOf method: greater than');


    var d1 = new Date(2016, 0, 1);
    var d2 = new Date(2016, 0, 1);
    var d3 = new Date(2016, 0, 1, 1);

    assert.equal(mx.compare(d1, null), 1, 'any date is greater than null');
    assert.equal(mx.compare(d1, undefined), 1, 'any date is greater than undefined');
    assert.equal(mx.compare(d1, d2), 0, 'compare equal Dates');
    assert.equal(mx.compare(d1, d3), -1, 'compare less than Date');
    assert.equal(mx.compare(d3, d2), 1, 'compare greater than Date');

    for (var i = 1; i <= 365; i++) {
        var date1 = new Date(2016, 0, i);
        var date2 = new Date(2016, 0, i + 1);

        assert.equal(mx.compare(date1, date1), 0, 'compare equal dates: ' + date1);
        assert.equal(mx.compare(date1, date2), -1, 'compare dates: "' + date1 + '", "' + date2 + '"');
        assert.equal(mx.compare(date2, date1), 1, 'compare dates: "' + date2 + '", "' + date1 + '"');
    }
});

})));

