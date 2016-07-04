import mx from '../../multiplex'
import {qmodule, qtest} from '../../qunit'

qmodule('hash');

var MAX_HASH_VALUE = 0X7FFFFFFF;
var MIN_HASH_VALUE = -0X7FFFFFFF;

function isValidHashValue(hash) {
    return hash >= MIN_HASH_VALUE && hash <= MAX_HASH_VALUE;
}

qtest('basic hash', function (assert) {
    assert.equal(mx.hash(), 0, 'hash method without arguments!');
    assert.equal(mx.hash(null), 0, 'hash null is zero!');
    assert.equal(mx.hash(undefined), 0, 'hash undefined is zero!');
    assert.notEqual(mx.hash(null, null), 0, 'hash multiple null values is not zero!');
    assert.notEqual(mx.hash(undefined, undefined), 0, 'hash multiple undefined values is not zero!');
    assert.ok(mx.hash(null) === 0 && mx.hash(undefined) === 0 && mx.hash(0) === 0, 'null, undefined and zero yield to zero!');
});

qtest('numeric hash', function (assert) {
    assert.equal(mx.hash(NaN), 0, 'hash NaN is zero!');

    assert.equal(mx.hash(0), 0, 'hash 0 is 0!');
    assert.equal(mx.hash(-0), 0, 'hash -0 is 0!');
    assert.notEqual(mx.hash(0, 0), 0, 'hash multiple zero values is not zero!');

    assert.equal(mx.hash(1), 1, 'hash 1 is 1!');
    assert.equal(mx.hash(2), 2, 'hash 2 is 2!');
    assert.equal(mx.hash(100), 100, 'hash 100 is 100!');
    assert.equal(mx.hash(100000), 100000, 'hash 100000 is 100000!');
    assert.equal(mx.hash(10000000), 10000000, 'hash 10000000 is 10000000!');
    assert.equal(mx.hash(1000000000), 1000000000, 'hash 1000000000 is 1000000000!');
    assert.equal(mx.hash(-1), -1, 'hash -1 is -1!');
    assert.equal(mx.hash(-2), -2, 'hash -2 is -2!');
    assert.equal(mx.hash(-100), -100, 'hash -100 is -100!');
    assert.equal(mx.hash(-100000), -100000, 'hash -100000 is -100000!');
    assert.equal(mx.hash(-10000000), -10000000, 'hash -10000000 is -10000000!');
    assert.equal(mx.hash(-1000000000), -1000000000, 'hash -1000000000 is -1000000000!');

    assert.equal(mx.hash(MAX_HASH_VALUE), MAX_HASH_VALUE, 'maximum hash value!');
    assert.equal(mx.hash(MIN_HASH_VALUE), MIN_HASH_VALUE, 'minimum hash value!');
    assert.ok(isValidHashValue(mx.hash(MAX_HASH_VALUE)), 'maximum hash is 0X7FFFFFFF!');
    assert.ok(isValidHashValue(mx.hash(MIN_HASH_VALUE)), 'minimum hash is -0X7FFFFFFF!');
    assert.ok(isValidHashValue(mx.hash(Number.MAX_VALUE)), 'hash MAX_VALUE');
    assert.ok(isValidHashValue(mx.hash(Number.MIN_VALUE)), 'hash MIN_VALUE');
    assert.ok(isValidHashValue(mx.hash(Number.POSITIVE_INFINITY)), 'hash POSITIVE_INFINITY');
    assert.ok(isValidHashValue(mx.hash(Number.NEGATIVE_INFINITY)), 'hash NEGATIVE_INFINITY');

    assert.equal(mx.hash(.1), mx.hash(.1), 'hash 0.1!');
    assert.equal(mx.hash(.01), mx.hash(.01), 'hash 0.01!');
    assert.equal(mx.hash(.001), mx.hash(.001), 'hash 0.001!');
    assert.equal(mx.hash(.0001), mx.hash(.0001), 'hash 0.001!');
    assert.equal(mx.hash(.000001), mx.hash(.000001), 'hash 0.00001!');
    assert.equal(mx.hash(.000000001), mx.hash(.000000001), 'hash 0.000000001!');
    assert.equal(mx.hash(.000000000001), mx.hash(.000000000001), 'hash 0.000000000001!');
    assert.equal(mx.hash(-.1), mx.hash(-.1), 'hash -0.1!');
    assert.equal(mx.hash(-.01), mx.hash(-.01), 'hash -0.01!');
    assert.equal(mx.hash(-.001), mx.hash(-.001), 'hash -0.001!');
    assert.equal(mx.hash(-.0001), mx.hash(-.0001), 'hash -0.001!');
    assert.equal(mx.hash(-.000001), mx.hash(-.000001), 'hash -0.00001!');
    assert.equal(mx.hash(-.000000001), mx.hash(-.000000001), 'hash -0.000000001!');
    assert.equal(mx.hash(-.000000000001), mx.hash(-.000000000001), 'hash -0.000000000001!');

    assert.ok(isValidHashValue(mx.hash(.1)), 'hash 0.1 is valid!');
    assert.ok(isValidHashValue(mx.hash(.001)), 'hash 0.001 is valid!');
    assert.ok(isValidHashValue(mx.hash(.00001)), 'hash 0.00001 is valid!');
    assert.ok(isValidHashValue(mx.hash(.0000001)), 'hash 0.0000001 is valid!');
    assert.ok(isValidHashValue(mx.hash(.000000001)), 'hash 0.000000001 is valid!');
    assert.ok(isValidHashValue(mx.hash(.00000000001)), 'hash 0.00000000001 is valid!');
    assert.ok(isValidHashValue(mx.hash(.0000000000001)), 'hash 0.0000000000001 is valid!');
    assert.ok(isValidHashValue(mx.hash(.000000000000001)), 'hash 0.000000000000001 is valid!');
    assert.ok(isValidHashValue(mx.hash(.00000000000000001)), 'hash 0.00000000000000001 is valid!');
    assert.ok(isValidHashValue(mx.hash(.0000000000000000001)), 'hash 0.0000000000000000001 is valid!');
    assert.ok(isValidHashValue(mx.hash(-.1)), 'hash -0.1 is valid!');
    assert.ok(isValidHashValue(mx.hash(-.001)), 'hash -0.001 is valid!');
    assert.ok(isValidHashValue(mx.hash(-.00001)), 'hash -0.00001 is valid!');
    assert.ok(isValidHashValue(mx.hash(-.0000001)), 'hash -0.0000001 is valid!');
    assert.ok(isValidHashValue(mx.hash(-.000000001)), 'hash -0.000000001 is valid!');
    assert.ok(isValidHashValue(mx.hash(-.00000000001)), 'hash -0.00000000001 is valid!');
    assert.ok(isValidHashValue(mx.hash(-.0000000000001)), 'hash -0.0000000000001 is valid!');
    assert.ok(isValidHashValue(mx.hash(-.000000000000001)), 'hash -0.000000000000001 is valid!');
    assert.ok(isValidHashValue(mx.hash(-.00000000000000001)), 'hash -0.00000000000000001 is valid!');
    assert.ok(isValidHashValue(mx.hash(-.0000000000000000001)), 'hash -0.0000000000000000001 is valid!');

    assert.ok(isValidHashValue(mx.hash(1, 2, 3, 4, 5, 6, 7, 8, 9)), 'hash multiple int values!');
    assert.ok(isValidHashValue(mx.hash(0X7FFFFF, 0X7FFFFF, 0X7FFFFF, 0X7FFFFF)), 'hash multiple big int values!');
    assert.ok(isValidHashValue(mx.hash(.1, .2, .3, .4, .5, .6, .7, .8, .9)), 'hash multiple float values!');
    assert.ok(isValidHashValue(mx.hash(0X7FFFFF + .1, 0X7FFFFF + .2, 0X7FFFFF + .3, 0X7FFFFF + .4)), 'hash multiple big float values!');


    assert.equal(mx.hash(0b10), 2, 'hash binary value 0b10!');
    assert.equal(mx.hash(0o10), 8, 'hash octal value 0o10!');
    assert.equal(mx.hash(0x10), 16, 'hash hex value 0x10!');
});


qtest('string hash', function (assert) {
    assert.equal(mx.hash(''), mx.hash(''), 'hash empty string!');
    assert.equal(mx.hash('Hello World!'), mx.hash('Hello World!'), 'hash "Hello World!" string!');
    assert.notEqual(mx.hash('hello world!'), mx.hash('Hello World!'), 'hash "Hello World!" is not equal to "hello world"!');
    assert.notEqual(mx.hash('0'), mx.hash(0), 'hash "0" is not equal to 0');
    assert.notEqual(mx.hash('1'), mx.hash(1), 'hash string "1" is not equal to 1');

    assert.ok(isValidHashValue(mx.hash('this is a test')), 'valid simple text');
    assert.ok(isValidHashValue(mx.hash('A', 'B', 'C', 'D', 'E')), 'Combinne string hash codes');
    assert.ok(isValidHashValue(mx.hash(mx.hash(new Array(10000).join('A')))), 'valid hash for a very long string!');
    assert.ok(isValidHashValue(mx.hash(new Array(10000).join('A'), new Array(10000).join('B'))), 'Combinne string hash codes for a big array');
});


qtest('date hash', function (assert) {
    assert.equal(mx.hash(new Date(2016, 6, 4)), mx.hash(new Date(2016, 6, 4)), 'hash exact dates are equal!');
    assert.equal(mx.hash(new Date(2116, 6, 4)), mx.hash(new Date(2116, 6, 4)), 'hash 100 years from now!');
    assert.equal(mx.hash(new Date(3016, 6, 4)), mx.hash(new Date(3016, 6, 4)), 'hash 1000 years from now!');
    assert.equal(mx.hash(new Date(1016, 6, 4)), mx.hash(new Date(1016, 6, 4)), 'hash 1000 years before!');
    assert.equal(mx.hash(new Date(100, 6, 4)), mx.hash(new Date(100, 6, 4)), 'hash 2300 years before!');

    assert.ok(isValidHashValue(mx.hash(new Date(2016, 6, 4))), 'valid hash now');
    assert.ok(isValidHashValue(mx.hash(new Date(2116, 6, 4))), 'valid hash 100 years from now!');
    assert.ok(isValidHashValue(mx.hash(new Date(3016, 6, 4))), 'valid hash 1000 years from now!');
    assert.ok(isValidHashValue(mx.hash(new Date(1016, 6, 4))), 'valid hash 1000 years before!');
    assert.ok(isValidHashValue(mx.hash(new Date(100, 6, 4))), 'valid hash 2300 years before!');
});
