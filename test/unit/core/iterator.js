import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('iterator');

qtest('create iterator', function (assert) {
    var index = 0;
    var it = new mx.Iterator(function () {
        if (index++ < 1) {
            return {
                value: index,
                done: false
            };
        }

        return {
            done: true
        };
    });
    var result;

    assert.ok(it !== null, 'iterable function');

    result = it.next();
    assert.equal(result.value, 1, 'iterable result value');
    assert.equal(result.done, false, 'iterable result done');

    result = it.next();
    assert.equal(result.value, undefined, 'iterable result value when done is undefined');
    assert.equal(result.done, true, 'iterable result done when done is true');

    result = it.next();
    assert.equal(result.value, undefined, 'consecutive iterable result when done is undefined');
    assert.equal(result.done, true, 'consecutive iterable result done when done is true');

    assert.throws(function () {
        it = new mx.Iterator(null);
    }, 'Iterator throws exception when passed null');

    assert.throws(function () {
        it = new mx.Iterator(undefined);
    }, 'Iterator throws exception when passed undefined');

    assert.throws(function () {
        it = new mx.Iterator(1);
    }, 'Iterator throws exception when passed number');

    assert.throws(function () {
        it = new mx.Iterator('string');
    }, 'Iterator throws exception when passed string');

    assert.throws(function () {
        it = new mx.Iterator(true);
    }, 'Iterator throws exception when passed boolean');

    assert.throws(function () {
        it = new mx.Iterator({});
    }, 'Iterator throws exception when passed object');

    assert.equal(it.toString(), '[Iterator]', 'Iterator toString');
});
