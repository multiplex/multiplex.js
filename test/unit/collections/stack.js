import mx from '../../multiplex';
import { qmodule, qtest } from '../../qunit';

qmodule('stack');

var Stack = mx.Stack;


function createStack() {
    return new Stack(mx.range(1, 5));
}

qtest('create stack', function (assert) {
    assert.ok(new Stack() !== null, 'empty stack');
    assert.ok(new Stack([1, 2, 3]) !== null, 'simple numeric stack');
});


qtest('stack "clear" tests', function (assert) {
    var _stack = createStack();

    _stack.clear();
    assert.equal(_stack.count(), 0, 'clears a Stack!');
});


qtest('stack "contains" tests', function (assert) {
    var _stack = createStack();

    assert.ok(_stack.contains(1) === true, 'stack containing an item!');
    assert.ok(_stack.contains(10) === false, 'stack does not contain an item!');
});


qtest('stack "copyTo" tests', function (assert) {
    var _stack = createStack(),
        _arr = new Array(_stack.count());

    _stack.copyTo(_arr, 0);

    assert.deepEqual(_arr, [1, 2, 3, 4, 5], 'stack copy to an array!');
    assert.throws(function () {
        _stack.copyTo([], 0);
    }, 'throws an error when the number of elements is greater than the number of elements that the destination array can contain!');
});



qtest('stack "peek" tests', function (assert) {
    var _stack = createStack();
    assert.equal(_stack.peek(), 5, 'stack peek an item!');

    _stack.clear();
    assert.throws(function () {
        _stack.peek();
    }, 'throws an error peek from empty stack!');
});


qtest('stack "pop" tests', function (assert) {
    var _stack = createStack();

    assert.equal(_stack.pop(), 5, 'stack pop an item!');

    _stack.clear();
    assert.throws(function () {
        _stack.pop();
    }, 'throws an error pop from empty stack!');
});


qtest('stack "push" tests', function (assert) {
    var _stack = createStack();

    _stack.push(6);

    assert.ok(_stack.count() === 6 && _stack.peek() === 6, 'stack push an item!');
});


QUnit.test('stack "toArray" tests', function (assert) {
    var _stack = createStack();

    assert.deepEqual(_stack.toArray(), [1, 2, 3, 4, 5], 'stack to array!');
});


qtest('stack toString', function (assert) {
    assert.equal(new Stack().toString(), '[Stack]', 'Stack toString');
});