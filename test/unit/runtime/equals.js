import mx from '../../multiplex'
import {qmodule, qtest} from '../../qunit'

qmodule('equals');

qtest('basic equals', function (assert) {
    assert.ok(mx.equals(null, null), 'null values are equals');
    assert.ok(mx.equals(undefined, undefined), 'undefined values are equal');
    assert.ok(mx.equals(null, undefined), 'null and undefined values are equal');
    assert.ok(mx.equals(undefined, null), 'undefined and null values are equal');
});


qtest('numeric equals', function (assert) {
    assert.ok(mx.equals(1, 1), 'simple numeric values are equal');
    assert.ok(mx.equals(0, 1) === false, 'simple numeric values not equal');
});


qtest('string equals', function (assert) {
    assert.ok(mx.equals('a', 'a'), 'simple string values are equal');
    assert.ok(mx.equals('a', 'b') === false, 'simple string values not equal');
});


qtest('boolean equals', function (assert) {
    assert.ok(mx.equals(true, true), 'simple true values are equal');
    assert.ok(mx.equals(false, false), 'simple false values are equal');
    assert.ok(mx.equals(true, false) === false, 'simple true and false values not equal');
    assert.ok(mx.equals(false, true) === false, 'simple false and true values not equal');
});


qtest('Date equals', function (assert) {
    assert.ok(mx.equals(new Date(2016, 1, 1), new Date(2016, 1, 1)), 'simple Date values are equal');
    assert.ok(mx.equals(new Date(2016, 1, 1), new Date(2017, 1, 1)) === false, 'simple Date values are not equal');
});


qtest('equals using __eq__ method', function (assert) {
    function SimpleEquals(val) {
        this._val = val;

        this[mx.equalsSymbol] = function (obj) {
            return this._val === obj._val;
        }
    };

    assert.equal(mx.equals(new SimpleEquals(1), new SimpleEquals(1)), true, 'equal objects overriding euqls method');
    assert.equal(mx.equals(new SimpleEquals(1), new SimpleEquals(0)), false, 'non-equal objects overriding euqls method');
    assert.equal(mx.equals(new SimpleEquals(0), new SimpleEquals(1)), false, 'non-equal objects overriding euqls method');
});


qtest('equals using object literals', function (assert) {
    assert.equal(mx.equals({}, {}), true, 'equal objects overriding euqls method');
    assert.equal(mx.equals({ val: 1 }, { val: 1 }), true, 'greater than objects overriding euqls method');
    assert.equal(mx.equals({ val: 1, sum: { name: 'A' } }, { val: 1, sum: { name: 'A' } }), true, 'less than objects overriding euqls method');

    assert.equal(mx.equals({}, {}), true, 'equal empty objects literals');
    assert.equal(mx.equals({ val: 1 }, { val: 1 }), true, 'equal objects literals with properties');
    assert.equal(mx.equals({ val: 1, sum: { name: 'A' } }, { val: 1, sum: { name: 'A' } }), true, 'equal object literals with complex object literals as properties');
});


qtest('class type equals', function (assert) {
    function SimpleClass(val) {
        this._val = val;
    };

    var o1 = new SimpleClass(1);
    var o2 = new SimpleClass(1);
    var o3 = new SimpleClass(2);

    assert.equal(mx.equals(o1, o1), true, 'objects with the same reference are equal');
    assert.equal(mx.equals(o1, o2), false, 'identical objects are not equal');
    assert.equal(mx.equals(o2, o3), false, 'non identical objects are not equal');
});


