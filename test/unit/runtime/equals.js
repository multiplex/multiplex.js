/*jshint -W053 */

import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('equals');

qtest('basic equals', function (assert) {
    assert.ok(mx.equals(null, null), 'null values are equals');
    assert.ok(mx.equals(undefined, undefined), 'undefined values are equal');
    assert.ok(mx.equals(null, undefined) === false, 'null and undefined values are not equal');
    assert.ok(mx.equals(undefined, null) === false, 'undefined and null values are not equal');
});


qtest('numeric equals', function (assert) {
    var POSITIVE_INFINITY = Number.POSITIVE_INFINITY || Infinity;
    var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY || -Infinity;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 0x1FFFFFFFFFFFFF;
    var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -0x1FFFFFFFFFFFFF;

    assert.ok(mx.equals(NaN, NaN), 'NaN values are equal');
    assert.ok(mx.equals(0, NaN) === false, 'no numeric value equals NaN');
    assert.ok(mx.equals(NaN, 0) === false, 'NaN equals no numeric value');

    assert.ok(mx.equals(1, 1), 'simple numeric values are equal');
    assert.ok(mx.equals(0, 1) === false, 'simple numeric values not equal');
    assert.ok(mx.equals(0.1, 0.1), 'simple float numeric values are equal');
    assert.ok(mx.equals(0.1, 0.2) === false, 'simple float numeric values not equal');

    assert.ok(mx.equals(1e-100, 1e-100), 'high precision float number equals');
    assert.ok(mx.equals(1e-100, 5e-100) === false, 'high precision float number non equals');

    assert.ok(mx.equals(1, new Number(1)) === false, 'number value not equals number object');
    assert.ok(mx.equals(new Number(1), 1) === false, 'number object not equals number value');

    assert.ok(mx.equals(MAX_SAFE_INTEGER, MAX_SAFE_INTEGER), 'MAX_SAFE_INTEGER equals MAX_SAFE_INTEGER');
    assert.ok(mx.equals(MIN_SAFE_INTEGER, MIN_SAFE_INTEGER), 'MAX_SAFE_INTEGER equals MAX_SAFE_INTEGER');
    assert.ok(mx.equals(MAX_SAFE_INTEGER, MIN_SAFE_INTEGER) === false, 'MAX_SAFE_INTEGER not equals MIN_SAFE_INTEGER');
    assert.ok(mx.equals(MIN_SAFE_INTEGER, MAX_SAFE_INTEGER) === false, 'MIN_SAFE_INTEGER not equals MAX_SAFE_INTEGER');

    assert.ok(mx.equals(POSITIVE_INFINITY, POSITIVE_INFINITY), 'POSITIVE_INFINITY equals POSITIVE_INFINITY');
    assert.ok(mx.equals(NEGATIVE_INFINITY, NEGATIVE_INFINITY), 'NEGATIVE_INFINITY equals NEGATIVE_INFINITY');
    assert.ok(mx.equals(POSITIVE_INFINITY, NEGATIVE_INFINITY) === false, 'POSITIVE_INFINITY not equals NEGATIVE_INFINITY');
    assert.ok(mx.equals(NEGATIVE_INFINITY, POSITIVE_INFINITY) === false, 'NEGATIVE_INFINITY not equals POSITIVE_INFINITY');

    for (var i = 0; i < 64; i++) {
        var num1 = Math.pow(2, i);
        var num2 = Math.pow(2, i + 1);

        assert.ok(mx.equals(num1, num1), 'equal numbers: ' + num1);
        assert.ok(mx.equals(num1, num2) === false, 'non equal numbers: "' + num1 + '", "' + num2 + '"');
        assert.ok(mx.equals(num2, num1) === false, 'non equal numbers: "' + num2 + '", "' + num1 + '"');
    }
});


qtest('string equals', function (assert) {
    assert.equal(mx.compare('', null), 1, 'any string value not equals null');
    assert.equal(mx.compare('', undefined), 1, 'any string value not equals undefined');
    assert.ok(mx.equals('', ''), 'empty string are equal');

    assert.ok(mx.equals('a', 'a'), 'equal 1 character string values');
    assert.ok(mx.equals('string', 'string'), 0, 'equal multi character string');
    assert.ok(mx.equals(new Array(10000).join('A'), new Array(10000).join('A')), 0, 'equal long string');

    assert.ok(mx.equals('b', 'a') === false, 'non equal 1 character string');
    assert.ok(mx.equals('string b', 'string a') === false, 'non equal multi character string');
    assert.ok(mx.equals(new Array(10000).join('A') + 'b', new Array(10000).join('A') + 'a') === false, 'non equal long string');

    assert.ok(mx.equals('a', new String('a')) === false, 'string value not equals string object');
    assert.ok(mx.equals(new String('a'), 'a') === false, 'string object not equals string value');

    assert.ok(mx.equals('1', 1) === false, 'string not equals numeric value');
    assert.ok(mx.equals('true', true) === false, 'string not equals boolean value');
    assert.ok(mx.equals('[object Object]', {}) === false, 'string not equals object value');

    var characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    for (var i = 0; i < characters.length - 1; i++) {
        var char1 = characters.charAt(i);
        var char2 = characters.charAt(i + 1);
        assert.ok(mx.equals(char1, char1), 'equal ASCII characters: "' + char1 + '"!');
        assert.ok(mx.equals(char1, char2) === false, 'non equal ASCII characters: "' + char1 + '", "' + char2 + '"!');
        assert.ok(mx.equals(char2, char1) === false, 'non equal ASCII character: "' + char2 + '", "' + char1 + '"!');
    }
});


qtest('boolean equals', function (assert) {
    assert.ok(mx.equals(true, true), 'true values are equal');
    assert.ok(mx.equals(false, false), 'false values are equal');
    assert.ok(mx.equals(true, false) === false, 'true and false values not equal');
    assert.ok(mx.equals(false, true) === false, 'false and true values not equal');
    assert.ok(mx.equals(true, new Boolean(true)) === false, 'true and Boolean(true) values are not equal');
    assert.ok(mx.equals(false, new Boolean(false)) === false, 'false and Boolean(false) values are not equal');
});


qtest('Date equals', function (assert) {
    assert.ok(mx.equals(new Date(2016, 0, 1), new Date(2016, 0, 1)), 'simple Date values are equal');
    assert.ok(mx.equals(new Date(2016, 0, 1), new Date(2017, 0, 1)) === false, 'simple Date values not equal');

    for (var i = 1; i <= 365; i++) {
        var date1 = new Date(2016, 0, i);
        var date2 = new Date(2016, 0, i + 1);

        assert.ok(mx.equals(date1, date1), 'equal dates: ' + date1);
        assert.ok(mx.equals(date1, date2) === false, 'non equal dates: "' + date1 + '", "' + date2 + '"');
        assert.ok(mx.equals(date2, date1) === false, 'non equal dates: "' + date2 + '", "' + date1 + '"');
    }
});


qtest('Other types equals', function (assert) {
    if (typeof Symbol === 'function') {
        assert.ok(mx.equals(Symbol('test'), Symbol('test')) === false, 'simple Symbols are not equal');
    }
    else {
        assert.ok(mx.equals(1, 1), 'dummy test to pass by earlier versions of node');
    }
});


qtest('equals using __eq__ method', function (assert) {
    function SimpleEquals(val) {
        this._val = val;

        this[mx.runtime.equalsSymbol] = function (obj) {
            return this._val === obj._val;
        };
    }

    assert.equal(mx.equals(new SimpleEquals(1), new SimpleEquals(1)), true, 'equal objects overriding equals method');
    assert.equal(mx.equals(new SimpleEquals(1), new SimpleEquals(0)), false, 'non-equal objects overriding equals method');
    assert.equal(mx.equals(new SimpleEquals(0), new SimpleEquals(1)), false, 'non-equal objects overriding equals method');
});


qtest('equals using object literals', function (assert) {
    assert.equal(mx.equals({}, {}), true, 'equal empty objects literals');
    assert.equal(mx.equals({ val: 1 }, { val: 1 }), true, 'equal objects literals with properties');
    assert.equal(mx.equals({ val: 1, sum: { name: 'A' } }, { val: 1, sum: { name: 'A' } }), true, 'equal object literals with complex object literals as properties');

    assert.equal(mx.equals({ val: 1 }, { val: 2 }), false, 'non equal objects literals with properties');
    assert.equal(mx.equals({ val: 1, sum: { name: 'A' } }, { val: 1, sum: { name: 'B' } }), false, 'non equal object literals with complex object literals as properties');

    var v1 = { val: 1, toString: Object.prototype.toString };
    var v2 = { val: 1, toString: Object.prototype.toString };
    assert.equal(mx.equals(v1, v2), true, 'object literal equality works at runtime, meaning property change after testing equality might result in non equality');

    v1.name = 1;
    assert.equal(mx.equals(v1, v2), false, 'adding new property to an object literal does not change its hash code, but ruins equality');
});


qtest('class type equals', function (assert) {
    function SimpleClass(val) {
        this._val = val;
    }

    var o1 = new SimpleClass(1);
    var o2 = new SimpleClass(1);
    var o3 = new SimpleClass(2);

    assert.equal(mx.equals(o1, o1), true, 'objects with the same reference are equal');
    assert.equal(mx.equals(o1, o2), false, 'identical objects are not equal');
    assert.equal(mx.equals(o2, o3), false, 'non identical objects are not equal');
});


