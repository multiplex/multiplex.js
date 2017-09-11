/*!
* Multiplex.js - LINQ for JavaScript.
* Version 2.0.0 (September 11, 2017)

* Created and maintained by Kamyar Nazeri <Kamyar.Nazeri@yahoo.com>
* Licensed under MIT License
* https://github.com/multiplex/multiplex.js
*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.mx = factory());
}(this, (function () { 'use strict';

mx.version = '2.0.0';

function isFunction(fn) {
    return typeof fn === 'function';
}

var iteratorSymbol = (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') ?
    Symbol.iterator : '@@iterator';

function defineProperty(obj, prop, attributes) {
    if (prop === '@@iterator') {
        prop = iteratorSymbol;
    }

    if (isFunction(Object.defineProperty)) {
        Object.defineProperty(obj, prop, attributes);
    }
    else {
        obj[prop] = attributes.get ? attributes.get.apply(obj) : attributes.value;
    }
}

function mixin(obj, properties, attributes) {
    attributes = attributes || {};

    for (var _prop in properties) {
        if (properties.hasOwnProperty(_prop)) {
            defineProperty(obj, _prop, {
                value: properties[_prop],
                writable: attributes.writable || true,
                enumerable: attributes.enumerable || false,
                configurable: attributes.configurable || false
            });
        }
    }

    return obj;
}

function error(msg) {
    throw new Error(msg);
}

var ERROR_ARGUMENT_OUT_OF_RANGE = 'Argument was out of the range of valid values.';
var ERROR_ARRAY_SIZE = 'The number of elements in the source is greater than the number of elements that the destination array can contain.';
var ERROR_NO_ELEMENTS = 'Sequence contains no elements.';
var ERROR_NO_MATCH = 'Sequence contains no matching element.';
var ERROR_NON_NUMERIC_TYPE = 'Value is not a number.';
var ERROR_MORE_THAN_ONE_ELEMENT = 'Sequence contains more than one element.';
var ERROR_KEY_NOT_FOUND = 'The given key was not present in the collection.';
var ERROR_DUPLICATE_KEY = 'An item with the same key has already been added.';
var ERROR_EMPTY_COLLECTION = 'Collection is empty.';

function isType(obj, type) {
    // use 'typeof' operator in an if clause yields in better performance than switch-case

    if (obj === null || obj === undefined) {
        return false;
    }

    if (typeof obj === 'number') {
        return type === Number;
    }

    else if (typeof obj === 'string') {
        return type === String;
    }

    else if (typeof obj === 'function') {
        return type === Function;
    }

    else if (typeof obj === 'boolean') {
        return type === Boolean;
    }

    else {
        return obj instanceof type;
    }
}

function assertType(obj, type) {
    if (!isType(obj, type)) {
        error('Invalid parameter type. Expected type: ' + type.name);
    }
}

/**
* Supports an iteration over an object using specified factory method.
* @param {Function} factory A function to yield the next item in the sequence.
*/
function Iterator(factory) {
    assertType(factory, Function);
    this.next = factory;
}

mixin(Iterator.prototype, {
    toString: function () {
        return '[Iterator]';
    }
});

function isObject(obj) {
    return typeof obj === 'object';
}

function toString(obj) {
    return isFunction(obj.toString) ? obj.toString() : '';
}

function isArrayLike(obj) {
    // - Array
    // - String
    //
    // - Typed arrays:
    //      Int8Array, Int16Array, Int32Array,
    //      Uint8Array, Uint16Array, Unit32Array, Uint8ClampedArray
    //      Float32Array, Float64Array
    //
    // - NodeList: document.querySelectorAll
    // - HTMLCollection: document.forms
    // - HTMLFormControlsCollection: forms.elements
    // - arguments object
    // - objects with 'length' and 'slice' properties

    if (typeof obj === 'string' ||
        obj instanceof Array) {
        return true;
    }

    else if (
        typeof obj === 'object' &&                          // array-likes are objects
        typeof obj.length === 'number') {                   // array-likes have 'length' property

        if (typeof obj.splice === 'function' ||             // third party libraries. eg. jQuery
            toString(obj) === '[object Arguments]') {       // arguments object
            return true;
        }
        else {
            var len = obj.length;
            if (len > 0 &&                                  // length property must be > 0
                len % 1 === 0 &&                            // length property must be integer
                obj[len - 1] !== undefined) {               // at least one index is being checked)
                return true;
            }
        }
    }

    return false;
}

function extend(type, superType, properties) {
    if (isFunction(Object.create)) {
        type.prototype = Object.create(superType.prototype);
    }
    else {
        var Super = function () { };
        Super.prototype = superType.prototype;
        type.prototype = new Super();
    }

    type.prototype.constructor = type;

    if (properties) {
        mixin(type.prototype, properties);
    }
}

/**
* Supports an iteration over an Array or Array-Like object.
* @param {Array|String|Array-like} arr An array or array-like object.
*/
function ArrayIterator(arr) {
    var index = -1,
        length = arr.length;

    Iterator.call(this, function () {
        if (++index < length) {
            return {
                value: arr[index],
                done: false
            };
        }

        return {
            done: true
        };
    });
}

extend(ArrayIterator, Iterator, {
    toString: function () {
        return '[Array Iterator]';
    }
});

/**
* Supports an iteration over Object properties.
* @param {Object} obj An object instance.
*/
function ObjectIterator(obj) {
    var index = -1,
        keys = Object.keys(obj),
        length = keys.length;

    // [key, value] iterator
    Iterator.call(this, function () {
        if (++index < length) {
            return {
                value: [
                    keys[index],
                    obj[keys[index]]
                ],
                done: false
            };
        }
        return {
            done: true
        };
    });
}

extend(ObjectIterator, Iterator, {
    toString: function () {
        return '[Object Iterator]';
    }
});

/**
* Supports an iteration over an empty Iterable.
*/
function EmptyIterator() {
    Iterator.call(this, function () {
        return { done: true };
    });
}

extend(EmptyIterator, Iterator, {
    toString: function () {
        return '[Empty Iterator]';
    }
});

/**
* Supports an iteration over n .Net Enumerable.
* @param {Object} obj An Enumerable instance.
*/
function EnumerableIterator(enumerable) {
    var enumerator = enumerable.getEnumerator();

    Iterator.call(this, function () {
        if (enumerator.next()) {
            return {
                value: enumerator.current,
                done: false
            };
        }

        return {
            done: true
        };
    });
}


extend(EnumerableIterator, Iterator, {
    toString: function () {
        return '[Enumerable Iterator]';
    }
});

/**
* Creates an iterator object
* @param {Object} obj An object to create iterator from.
*/
function $iterator(obj) {
    // empty iteration
    if (obj === null || obj === undefined) {
        return new EmptyIterator();
    }

    // iterable/generator function
    else if (isFunction(obj)) {
        return obj();
    }

    // iterable: Array, String, Map, Set, NodeList, Arguments, Iterable objects
    else if (isFunction(obj[iteratorSymbol])) {
        return obj[iteratorSymbol]();
    }

    // array-like objects
    else if (isArrayLike(obj)) {
        return new ArrayIterator(obj);
    }

    // .Net Enumerable
    else if (isFunction(obj.getEnumerator)) {
        return new EnumerableIterator(obj);
    }

    // Object.entries iterator
    else if (isObject(obj)) {
        return new ObjectIterator(obj);
    }

    // simple iterator over non-objects
    else {
        return new ArrayIterator([obj]);
    }
}

var iterableSymbol = (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') ?
    Symbol('iterable') : '@@iterable';

/**
* Defines abstract Iterable class.
* @param {Iterable|Array|String|Function|Function*|Object} source An Iterable object.
*/
function Iterable(source) {
    if (source !== null && source !== undefined) {
        this[iterableSymbol] = source;
    }
}

mixin(Iterable.prototype, {
    toString: function () {
        return '[Iterable]';
    },

    valueOf: function () {
        return this[iterableSymbol];
    },

    '@@iterator': function () {
        return $iterator(this[iterableSymbol]);
    }
});

/**
* Creates a new ArrayIterable instance.
* @param {Array|String|Array-like} value An array-like object.
*/
function ArrayIterable(value) {
    Iterable.call(this, value);
}

extend(ArrayIterable, Iterable, {
    /**
    * Creates an array from the Iterable.
    * @returns {Array}
    */
    toArray: function () {
        return this[iterableSymbol] || [];
    },

    toString: function () {
        return '[Array Iterable]';
    },

    '@@iterator': function () {
        var arr = this[iterableSymbol];
        return isFunction(arr[iteratorSymbol]) ? arr[iteratorSymbol]() : new ArrayIterator(arr);
    }
});

/**
* Creates a new ObjectIterable instance.
* @param {Object} value An object instance.
*/
function ObjectIterable(value) {
    Iterable.call(this, value);
}

extend(ObjectIterable, Iterable, {
    toString: function () {
        return '[Object Iterable]';
    },

    '@@iterator': function () {
        return new ObjectIterator(this[iterableSymbol]);
    }
});

/**
* Creates a new EmptyIterable instance.
*/
function EmptyIterable() {
}

extend(EmptyIterable, Iterable, {
    toString: function () {
        return '[Empty Iterable]';
    },

    '@@iterator': function () {
        return new EmptyIterator();
    }
});

function $iterable(value) {
    if (value === null || value === undefined) {
        return new EmptyIterable();
    }

    if (value instanceof Iterable) {
        return value;
    }

    else if (isArrayLike(value)) {
        return new ArrayIterable(value);
    }

    else if (isFunction(value)) {
        return new Iterable(value);
    }

    else if (isFunction(value[iteratorSymbol])) {
        return new Iterable(value);
    }

    else if (isFunction(value.getEnumerator)) {
        return new Iterable(value);
    }

    else if (isObject(value)) {
        return new ObjectIterable(value);
    }

    return new ArrayIterable([value]);
}

function valueOf(obj) {
    if (obj instanceof Date) {
        return obj.getTime();
    }
    else {
        return isFunction(obj.valueOf) ? obj.valueOf() : 0;
    }
}

var POSITIVE_INFINITY = Number.POSITIVE_INFINITY || Infinity;
var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY || -Infinity;
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 0x1FFFFFFFFFFFFF;
var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -0x1FFFFFFFFFFFFF;

function compute31BitNumberHash(val) {
    var h = 0;

    // integer number
    if (val <= MAX_SAFE_INTEGER && val >= MIN_SAFE_INTEGER && val % 1 === 0) {
        return val >> 32;
    }

    // non-integer numbers
    switch (val) {
        case POSITIVE_INFINITY: h = 0x7F800000; break;
        case NEGATIVE_INFINITY: h = 0xFF800000; break;
        default:
            // NaN
            if (isNaN(val)) {
                h = 0;
                break;
            }

            if (val <= -0.0) {
                h = 0x80000000;
                val = -val;
            }

            var exponent = Math.floor(Math.log(val) / Math.log(2)),
                significand = ((val / Math.pow(2, exponent)) * 0x00800000) | 0;

            exponent += 127;

            if (exponent >= 0xFF) {
                exponent = 0xFF;
                significand = 0;
            }
            else if (exponent < 0) {
                exponent = 0;
            }

            h = h | (exponent << 23);
            h = h | (significand & ~(-1 << 23));
            break;
    }

    return h >> 32;
}

function compute31BitStringHash(val) {
    var h = 0X7FFF,         // string hash seed
        len = val.length,
        i = 0;

    for (; i < len;) {
        h = ((((h << 5) - h) | 0) + val.charCodeAt(i++)) | 0;
    }

    return h >> 32;
}

function compute31BitDateHash(date) {
    var time = valueOf(date);
    return time ^ (time >> 5);
}

var hashSymbol = '__hash__';

function combineHash(h1, h2) {
    return (((h1 << 5) | (h1 >> 27)) + h1) ^ h2;
}

var OBJECT_PROTOTYPE = Object.prototype;
var ARRAY_PROTOTYPE = Array.prototype;

function isObjectLiteral(obj) {
    return Object.getPrototypeOf(obj) === OBJECT_PROTOTYPE;
}

var OBJECT_HASH_SEED = Math.floor(Math.random() * 0XFFFF) + 0XFFFF;
var OBJECT_HASH_INDEX = OBJECT_HASH_SEED;
var compute31BitObjecHash;

if (typeof WeakMap === 'function') {
    var OBJECT_HASH_MAP = new WeakMap();

    // using Weakmap as 'hash' repository when possible
    compute31BitObjecHash = function (obj, strict) {
        var h = OBJECT_HASH_MAP.get(obj);

        if (h === undefined) {
            // create object-literals hash based on their visible properties in non-strict mode
            if (strict !== true && isObjectLiteral(obj)) {
                h = OBJECT_HASH_SEED;

                // early seed prevents mutually recursive structures to stack overflow
                OBJECT_HASH_MAP.set(obj, 0);

                // only object literals fall into following code, no need to check for hasOwnProperty
                var prop;
                for (prop in obj) {
                    h = combineHash(h, compute31BitStringHash(prop) + hash(obj[prop]));
                }
            }
            else {
                h = OBJECT_HASH_INDEX++ >> 32;
            }


            // assign the hash value until the lifetime of the object
            OBJECT_HASH_MAP.set(obj, h);
        }

        return h;
    };
}
else {
    compute31BitObjecHash = function (obj, strict) {
        var h = 0;
        var extensible = Object.isExtensible && Object.isExtensible(obj);

        // only override 'hash' method when object is extensible (not sealed or frozen)
        if (extensible) {
            // create object-literals hash based on their visible properties
            obj[hashSymbol] = function () {
                return h;
            };
        }

        // create object-literals hash based on their visible properties in non-strict mode
        if (strict !== true && isObjectLiteral(obj)) {
            h = OBJECT_HASH_SEED;

            // only object literals fall into following code, no need to check for hasOwnProperty
            var prop;
            for (prop in obj) {
                if (prop === hashSymbol) {
                    continue;
                }

                h = combineHash(h, compute31BitStringHash(prop) + hash(obj[prop]));
            }
        }
        else {
            // return constant hash codes for non-extensible class instances
            h = extensible ? OBJECT_HASH_INDEX++ >> 32 : OBJECT_HASH_SEED;
        }

        return h;
    };
}

/**
* Serves as a hash function for a particular type, suitable for use in hashing algorithms and data structures such as a hash table.
* @param {Object} obj An object to retrieve the hash code for.
* @returns {Number}
*/
function hash(obj, strict) {
    // null/undefined hash is 0
    if (obj === null || obj === undefined) {
        return 0;
    }


    // Compute 'Number' primitive type hash (does not incluede 'new Number(value)')
    else if (typeof obj === 'number') {
        return compute31BitNumberHash(obj);
    }


    // Compute 'String' primitive type hash (does not incluede 'new String(value)')
    else if (typeof obj === 'string') {
        return compute31BitStringHash(obj);
    }


    // Compute 'Boolean' primitive type hash (does not incluede 'new Boolean(value)')
    else if (typeof obj === 'boolean') {
        return obj ? 1 : 0;
    }


    // Compute 'Objects' hash
    else {
        // Compute overridden 'hash' method
        if (typeof obj.__hash__ === 'function') {
            return obj.__hash__() >> 32;
        }

        // Compute primitive object types hash only in non-strict mode
        else if (strict !== true) {
            // Compute 'Date' object type hash
            if (obj instanceof Date) {
                return compute31BitDateHash(obj);
            }

            // Compute built-in types hash
            else if (
                obj instanceof Number ||
                obj instanceof String ||
                obj instanceof Boolean) {
                return hash(valueOf(obj), false);
            }
        }

        // Compute 'Object' type hash for all other types
        return compute31BitObjecHash(obj, strict);
    }
}

function computeObjectEquals(objA, objB) {
    // Objects having different hash code are not equal
    // also prevents mutually recursive structures to stack overflow
    if (hash(objA) !== hash(objB)) {
        return false;
    }


    /// Process equality for object literals:
    /// object literals may have equal hash code, we process equality by each property.
    /// regular 'class' instances have different hash code, hence do not fall into following code.
    /// object objA is direct descendant of Object hence no need to check 'hasOwnProperty'

    var val, prop;

    for (prop in objA) {
        val = objA[prop];

        /// Object methods are not considered for equality
        if (typeof val === 'function') {
            continue;
        }

        if (!equals(val, objB[prop])) {
            return false;
        }
    }

    /// no need to browse objB properties, all properties of objA is checked against objB
    /// it is very unlikely for object literals with the same hash code to have different properties
    /// even in such a rare case, objects are considered equal

    return true;
}

/**
* Determines whether the specified object instances are considered equal.
* @param {Object} objA The first object to compare.
* @param {Object} objB The second object to compare.
* @param {Boolean} strict If true computes strict equality for object types.
* @returns {Boolean} if the objA parameter is the same instance as the objB parameter, or if both are null, or if objA.equals(objB) returns true; otherwise, false.
*/
function equals(objA, objB, strict) {
    // Objects are identical
    if (objA === objB) {
        return true;
    }


    // null/undefined is not equal to any object
    else if (
        objA === null || objA === undefined ||
        objB === null || objB === undefined) {
        return false;
    }


    // objA: NaN & objB: NaN
    else if (typeof objA === 'number' && typeof objB === 'number') {
        return isNaN(objA) && isNaN(objB);
    }


    // object types equality
    else if (typeof objA === 'object' && typeof objB === 'object') {
        // Compute overridden 'equals' method for Object types
        if (typeof objA.__eq__ === 'function') {
            return objA.__eq__(objB);
        }

        // objects are not equal under strict mode
        else if (strict === true) {
            return false;
        }

        // built-in object types
        if (
            (objA instanceof Date && objB instanceof Date) ||
            (objA instanceof Number && objB instanceof Number) ||
            (objA instanceof String && objB instanceof String) ||
            (objA instanceof Boolean && objB instanceof Boolean)) {
            return valueOf(objA) === valueOf(objB);
        }

        // Object types
        return computeObjectEquals(objA, objB);
    }


    // Objects are already not equal
    return false;
}

var equalsSymbol = '__eq__';

/**
* Performs a comparison of two objects of the same type and returns a value indicating whether one object is less than, equal to, or greater than the other.
* @param {Object} objA The first object to compare.
* @param {Object} objB The second object to compare.
* @returns {Number}
*/
function compare(objA, objB) {
    // Identical objects
    if (objA === objB) {
        return 0;
    }

    // null or undefined is less than everything
    else if (objA === null || objA === undefined) {
        return -1;
    }

    // Everything is greater than null or undefined
    else if (objB === null || objB === undefined) {
        return 1;
    }

    // numbers compare using 'gt' operator
    else if (typeof objA === 'number') {
        return objA > objB || isNaN(objB) ? 1 : -1;
    }

    // booleans compare using 'gt' operator
    else if (typeof objA === 'boolean') {
        return objA > objB ? 1 : -1;
    }

    // Strings are compared using String.prototype.localeCompare method
    else if (typeof objA === 'string') {
        var res = objA.localeCompare(objB);
        return res > 0 ? 1 : (res < 0 ? -1 : 0);
    }

    // Compute overridden 'compare' method for Object types
    else if (typeof objA.__cmp__ === 'function') {
        return objA.__cmp__(objB);
    }

    // All other objects are compared using 'valueOf' method
    else {
        var v1 = valueOf(objA),
            v2 = valueOf(objB);

        return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
    }
}

var compareSymbol = '__cmp__';

var runtime = {
    strictMode: false,
    hash: hash,
    hashMany: hashMany,
    hashSymbol: hashSymbol,
    equals: equals,
    equalsSymbol: equalsSymbol,
    compare: compare,
    compareSymbol: compareSymbol,
    iteratorSymbol: iteratorSymbol
};

/**
* Serves as a hash function for a particular type, suitable for use in hashing algorithms and data structures such as a hash table.
* @param {Object} obj An object to retrieve the hash code for.
* @param {...Objects} rest Optional number of objects to combine their hash codes.
* @returns {Number}
*/
function hashMany(obj) {
    var h = hash(obj, false);

    // Combine hash codes for given inputs
    if (arguments.length > 1) {
        var len = arguments.length,
            i = 0;

        while (i < len) {
            h = combineHash(h, hash(arguments[i++], false));
        }
    }

    return h;
}


/**
* Serves as a hash function for a particular type, suitable for use in hashing algorithms and data structures such as a hash table.
* @param {Object} obj An object to retrieve the hash code for.
* @returns {Number}
*/
function runtimeHash(obj) {
    return hash(obj, runtime.strictMode);
}


/**
* Determines whether the specified object instances are considered equal.
* @param {Object} objA The first object to compare.
* @param {Object} objB The second object to compare.
* @returns {Boolean} if the objA parameter is the same instance as the objB parameter, or if both are null, or if objA.equals(objB) returns true; otherwise, false.
*/
function runtimeEquals(objA, objB) {
    return equals(objA, objB, runtime.strictMode);
}

/**
* Provides a base class for implementations of Comparer.
*/
function Comparer(comparison) {
    assertType(comparison, Function);
    this.compare = comparison;
}


var defaultComparer = new Comparer(compare);


mixin(Comparer.prototype, {
    /**
    * Compares two objects and returns a value indicating whether one is less than, equal to, or greater than the other.
    * @param {Object} x The first object to compare.
    * @param {Object} y The second object to compare.
    * @returns An integer that indicates the relative values of x and y, as shown in the following table:
    * Less than zero x is less than y.
    * Zero x equals y.
    * Greater than zero x is greater than y.
    */
    compare: compare,

    toString: function () {
        return '[Comparer]';
    }
});


mixin(Comparer, {

    /**
    * Gets a default sort order comparer for the type specified by the generic argument.
    */
    instance: defaultComparer,

    /**
    * Gets or creates a new Comparer object.
    * @param {Comparer|Object} value A Comparer object.
    * @returns {Comparer}
    */
    from: function (value) {
        if (value === null || value === undefined || value === defaultComparer) {
            return defaultComparer;
        }

        else if (value instanceof Comparer) {
            return value;
        }

        else if (isFunction(value)) {
            return new Comparer(value);
        }

        else if (isFunction(value.compare)) {
            return new Comparer(value.compare);
        }

        else {
            return defaultComparer;
        }
    }
});

/**
* Provides a base class for implementations of the EqualityComparer.
*/
function EqualityComparer(hashCodeProvider, equality) {
    assertType(hashCodeProvider, Function);
    assertType(equality, Function);

    this.hash = hashCodeProvider;
    this.equals = equality;
}


var defaultEqualityComparer = new EqualityComparer(runtimeHash, runtimeEquals);


mixin(EqualityComparer.prototype, {
    /**
    * Determines whether the specified objects are equal.
    * @param {Object} x The first object of type Object to compare.
    * @param {Object} y The second object of type Object to compare.
    * @returns true if the specified objects are equal; otherwise, false.
    */
    equals: runtimeEquals,

    /**
    * Returns a hash code for the specified object.
    * @param {Object} obj The Object for which a hash code is to be returned.
    * @returns A hash code for the specified object.
    */
    hash: runtimeHash,

    toString: function () {
        return '[EqualityComparer]';
    }
});


mixin(EqualityComparer, {
    /**
    * Gets a default sort order comparer for the type specified by the generic argument.
    */
    instance: defaultEqualityComparer,

    /**
    * Gets or creates a new EqualityComparer object.
    * @param {EqualityComparer|Object} value An EqualityComparer object.
    * @returns {EqualityComparer}
    */
    from: function (value) {
        if (value === null || value === undefined || value === defaultEqualityComparer) {
            return defaultEqualityComparer;
        }

        else if (value instanceof EqualityComparer) {
            return value;
        }

        else if (isFunction(value.hash) && isFunction(value.equals)) {
            return new EqualityComparer(value.hash, value.equals);
        }

        return defaultEqualityComparer;
    }
});

/**
* Gets number of items in the specified iterable object.
* @param {Iterable} value An Iterable object.
* @param {Function=} predicate A function to test each element for a condition. eg. function(item)
* @returns {Number}
*/
function iterableCount(value, predicate) {
    var count = 0;

    if (!predicate) {
        count = collectionCount(value);
        if (count !== -1) {
            return count;
        }
    }

    count = 0;
    var it = $iterator(value);

    if (predicate) {
        var next;
        assertType(predicate, Function);
        while (!(next = it.next()).done) {
            if (predicate(next.value)) {
                count++;
            }
        }
    }
    else {
        while (!it.next().done) {
            count++;
        }
    }

    return count;
}


/**
* Gets number of items in the specified collection object. returns -1 if the value is not a collection.
* @returns {Number}
*/
function collectionCount(value) {
    if (isArrayLike(value)) {
        return value.length;
    }

    else if (value instanceof ArrayIterable) {
        return value.toArray().length;
    }

    else if (value instanceof Collection) {
        return value.count();
    }

    return -1;
}

function isArray(val) {
    return val instanceof Array;
}

function isString(val) {
    return typeof val === 'string';
}

/**
* Buffers an Iterale object into an array.
* @param {Iterale} value An Iterale object.
* @param {Boolean} forceIterate If true, buffers the specified iterable object using its iterator.
* @returns {Array}
*/
function buffer(value, forceIterate) {
    if (!forceIterate) {
        if (isArrayLike(value)) {                      // array-likes have fixed element count
            return arrayBuffer(value);
        }

        else if (value instanceof Collection) {             // Collections have 'toArray' method
            return arrayBuffer(value.toArray());
        }

        else if (value instanceof ArrayIterable) {          // ArrayIterable wrapper
            return arrayBuffer(value.toArray());
        }
    }

    // do it the hard way
    var it = $iterator(value),
        count = 0,
        length = 16,
        arr = new Array(length),
        result;

    while (!(result = it.next()).done) {
        if (count >= length) {
            length *= 4;
            arr.length = length;
        }

        arr[count++] = result.value;
    }

    arr.length = count;
    return arr;
}


function arrayBuffer(value) {
    if (isArray(value)) {                  	// fast buffer arrays
        return value.concat();            	// 'concat' is fastest way to duplicate an array
    }

    else if (isString(value)) {           	// fast buffer strings
        return value.split('');        	    // buffer string to char-array
    }

    // use the despised Array constructor as a function
    return value.length === 1 ? [value[0]] : Array.apply(null, value);
}

/**
* Buffers an Iterable instance into a given array.
* @param {Iterable} value An Iterable object.
* @param {Array} array The one-dimensional Array that is the destination of the elements copied from Iterable.
* @param {Number} index The zero-based index in array at which copying begins.
*/
function bufferTo(value, array, index) {
    assertType(array, Array);
    assertType(index, Number);

    var source = buffer(value),
        sourcelen = source.length,
        arraylen = array.length;

    if (index < 0) {
        error(ERROR_ARGUMENT_OUT_OF_RANGE);
    }

    if (index > arraylen || (sourcelen + index) > arraylen) {
        error(ERROR_ARRAY_SIZE);
    }

    while (sourcelen-- > 0) {
        array[index + sourcelen] = source[sourcelen];
    }
}

/**
 * Initializes a new instance of the abstract Collection class.
 */
function Collection(value) {
    if (value !== null && value !== undefined) {
        value = isArrayLike(value) ? value : buffer(value);
    }

    Iterable.call(this, value);
}

extend(Collection, Iterable, {
    /**
     * Gets the number of elements contained in the Collection.
     * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
     * @returns {Number}
     */
    count: function (predicate) {
        // if not overridden in subclass,
        // gets the count of the collection by converting the collection to an array
        return predicate ? iterableCount(this, predicate) : this.toArray().length;
    },

    /**
     * Copies the Collection to an existing one-dimensional Array, starting at the specified array index.
     * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Collection.
     * @param {Number} arrayIndex The zero-based index in array at which copying begins.
     */
    copyTo: function (array, arrayIndex) {
        bufferTo(this.toArray(), array, arrayIndex);
    },

    /**
    * Creates an array from the Iterable.
    * @returns {Array}
    */
    toArray: function () {
        // if the collection does not have an iterable value
        // converts the collection to an array buffering the collection
        return this[iterableSymbol] || buffer(this, true);
    },

    toString: function () {
        return '[Collection]';
    },

    '@@iterator': function () {
        // if not overridden in subclass,
        // gets the specified iterable's iterator or an empty iterator
        return new ArrayIterator(this[iterableSymbol] || []);
    }
});

function ReadOnlyCollection(list) {
    if (!isArrayLike(list)) {
        error('Invalid argument!');
    }

    list = buffer(list);
    Collection.call(this, list);
    this.list = list;

    defineProperty(this, 'length', {
        get: function () {
            return list.length;
        }
    });

    for (var i = 0, len = list.length; i < len; i++) {
        this[i] = list[i];
    }

    Object.freeze(this);
}

extend(ReadOnlyCollection, Collection, {
    /**
     * Gets the number of elements contained in the ReadOnlyCollection.
     * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
     * @returns {Number}
     */
    count: function (predicate) {
        return predicate ? iterableCount(this, predicate) : this.list.length;
    },

    /**
     * Determines whether the ReadOnlyCollection contains a specific value.
     * @param {Object} item The object to locate in the ReadOnlyCollection.
     * @returns {Boolean}
     */
    contains: function (item) {
        return this.list.indexOf(item) !== -1;
    },

    /**
     * Gets the element at the specified index.
     * @param {Number} index The zero-based index of the element to get.
     * @returns {Object}
     */
    get: function (index) {
        return this[index];
    },

    /**
     * Searches for the specified object and returns the zero-based index of the first occurrence within the entire ReadOnlyCollection.
     * @param {Object} item The object to locate in the ReadOnlyCollection.
     * @returns {Number}
     */
    indexOf: function (item) {
        return this.list.indexOf(item);
    },

    /**
     * Returns a shallow copy of a portion of the list into a new array object.
     * @param {Number=} begin Zero-based index at which to begin extraction.
     * @param {Number=} end Zero-based index at which to end extraction
     * @returns {Array}
     */
    slice: ARRAY_PROTOTYPE.slice,

    /**
     * Changes the content of the list by removing existing elements and/or adding new elements.
     * @param {Number} start Index at which to start changing the list.
     * @param {Number} deleteCount An integer indicating the number of old list elements to remove.
     * @param {Object...} items The elements to add to the list.
     * @returns {Array}
     */
    splice: ARRAY_PROTOTYPE.splice,

    /**
     * Buffers collection into an array.
     * @returns {Array}
     */
    toArray: function () {
        return this.list.slice();
    },

    toString: function () {
        return '[ReadOnlyCollection]';
    },

    '@@iterator': function () {
        return new ArrayIterator(this);
    }
});

/**
* Supports both iterable and iterator protocols using specified factory method.
* @param {Function} factory A function to create iterator instance.
*/
function IterableIterator(factory) {
    Iterable.call(this, factory);
    this.next = factory().next;
}

extend(IterableIterator, Iterable);

/// Array of primes larger than: 2 ^ (4 x n)
var primes = [17, 67, 257, 1031, 4099, 16411, 65537, 262147, 1048583, 4194319, 16777259];

function resize(size) {
    for (var i = 0, len = primes.length; i < len; i++) {
        if (primes[i] > size) {
            return primes[i];
        }
    }

    return primes[primes.length - 1];
}

function asArray(value) {
    if (isArrayLike(value)) {                       // array-likes have fixed element count
        return value;
    }

    else if (value instanceof ArrayIterable) {      // ArrayIterable wrapper
        return value.toArray();
    }

    return null;
}

function forOf(source, action) {
    var arr = asArray(source);

    // fast array iteration
    if (arr) {
        var len = arr.length,
            i = 0;

        for (; i < len;) {
            if (action(arr[i++]) !== undefined) {
                break;
            }
        }
    }

    else {
        var it = $iterator(source),
            next;

        while (!(next = it.next()).done) {
            if (action(next.value) !== undefined) {
                break;
            }
        }
    }
}

function HashTable(comparer) {
    this.initialize();
    this.comparer = EqualityComparer.from(comparer);
}


mixin(HashTable.prototype, {
    initialize: function () {
        this.size = 0;                      // total number of slots, including release slots (freeCount)
        this.freeIndex = undefined;         // next free index in the bucket list
        this.freeCount = 0;                 // total number of release slots
        this.buckets = new Array(7);        // bucket list. index: hash, value: slot index;
        this.slots = new Array(7);          // slot list. next: index of the next bucket;
    },

    add: function (key, value) {
        return this.insert(key, value, true);
    },

    clear: function () {
        this.initialize();
    },

    contains: function (key) {
        return this.find(key) !== -1;
    },

    containsValue: function (value) {
        var slots = this.slots,
            count = this.count(),
            comparer = this.comparer;

        for (var i = 0; i < count; i++) {
            if (slots[i].hash !== undefined && comparer.equals(slots[i].value, value)) {
                return true;
            }
        }

        return false;
    },

    count: function () {
        return this.size - this.freeCount;
    },

    entry: function (key) {
        var index = this.find(key);
        return index === -1 ? undefined : [key, this.slots[index].value];
    },

    find: function (key) {
        var comparer = this.comparer,
            hash = comparer.hash(key) & 0x7FFFFFFF,
            slot = null;

        for (var index = this.buckets[hash % this.buckets.length]; index !== undefined;) {
            slot = this.slots[index];

            if (slot.hash === hash && comparer.equals(slot.key, key)) {
                return index;
            }

            index = slot.next;
        }

        return -1;
    },

    forEach: function (callback, target, thisArg) {
        if (thisArg) {
            var _callback = callback;
            callback = function () {
                _callback.apply(thisArg, arguments);
            };
        }

        forOf(this, function (element) {
            callback(element[0], element[1], target);
        });
    },

    insert: function (key, value, add) {
        var comparer = this.comparer,
            hash = comparer.hash(key) & 0x7FFFFFFF,
            bucket = hash % this.buckets.length,
            slot = null,
            index = 0;


        // check for item existance, freed slots have undefined hash-code value and do not need enumeration
        for (index = this.buckets[bucket]; index !== undefined;) {
            slot = this.slots[index];

            if (slot.hash === hash && comparer.equals(slot.key, key)) {
                if (add) {
                    return false;
                }

                slot.value = value;
                return true;
            }

            index = slot.next;
        }



        // item with the same key does not exists, add item

        index = 0;

        // there's already a free index
        if (this.freeCount > 0) {
            index = this.freeIndex;                         // consume free index
            this.freeIndex = this.slots[index].next;      // save new free index
            this.freeCount--;                               // update number of free slots
        }
        else {
            if (this.size === this.buckets.length) {
                this.resize();
                bucket = hash % this.buckets.length;
            }

            // find a new free index
            index = this.size;
            this.size++;
        }

        this.slots[index] = new HashTableSlot(hash, this.buckets[bucket], key, value);
        this.buckets[bucket] = index;

        return true;
    },

    entries: function (keysOnly) {
        var arr = new Array(this.count()),
            slot = null,
            index = 0;

        for (var i = 0; i < this.size; i++) {
            slot = this.slots[i];

            if (slot.hash !== undefined) {
                arr[index++] = keysOnly ? slot.key : [slot.key, slot.value];
            }
        }

        return arr;
    },

    resize: function () {
        var size = this.size,
            newSize = resize(size),
            slot = null,
            bucket = 0;

        this.buckets = new Array(newSize);      // expand buckets
        this.slots.length = newSize;            // expand slots


        // rehash values & update buckets and slots
        for (var index = 0; index < size; index++) {
            slot = this.slots[index];

            // freed slots have undefined hashCode value and do not need rehash
            if (slot.hash !== undefined) {
                bucket = slot.hash % newSize;           // rehash
                slot.next = this.buckets[bucket];       // update slot's next index in the bucket chain
                this.buckets[bucket] = index;           // update bucket index
            }
        }
    },

    remove: function (key) {
        var comparer = this.comparer,
            hash = comparer.hash(key) & 0x7FFFFFFF,     // hash-code of the key
            bucket = hash % this.buckets.length,        // bucket index
            last,
            slot;

        // freed slots have undefined hash-code value and do not need enumeration
        for (var index = this.buckets[bucket]; index !== undefined;) {
            slot = this.slots[index];

            if (slot.hash === hash && comparer.equals(slot.key, key)) {
                // last item in the chained bucket list
                if (last === undefined) {
                    this.buckets[bucket] = slot.next;
                }
                else {
                    this.slots[last].next = slot.next;
                }

                slot.hash = undefined;         // release the slot
                slot.next = this.freeIndex;    // save previous free index
                slot.key = null;
                slot.value = null;

                this.freeIndex = index;         // save new free index
                this.freeCount++;               // update number of free slots
                return true;
            }

            last = index;
            index = slot.next;
        }

        // item does not exist
        return false;
    },

    get: function (key) {
        var index = this.find(key);
        return index === -1 ? undefined : this.slots[index].value;
    },

    set: function (key, value) {
        this.insert(key, value, false);
    },

    '@@iterator': function () {
        return new HashTableIterator(this);
    }
});




function HashTableIterator(table, selector) {
    var index = 0,
        slot = null,
        size = table.size,
        slots = table.slots;

    Iterator.call(this, function () {
        while (index < size) {
            slot = slots[index++];

            // freed slots have undefined as hashCode value and do not enumerate
            if (slot.hash !== undefined) {
                return {
                    value: selector ? selector(slot.key, slot.value) : [slot.key, slot.value],
                    done: false
                };
            }
        }

        return {
            done: true
        };
    });
}

extend(HashTableIterator, Iterator);


function HashTableSlot(hash, next, key, value) {
    this.hash = hash;       // item's key hash-code
    this.next = next;       // index of the next bucket in the chained bucket list
    this.key = key;         // item's key
    this.value = value;     // item's value
}

/**
* Initializes a new instance of the KeyValuePair with the specified key and value.
* @param {Object} key The object defined in each key/value pair.
* @param {Object} value The definition associated with key.
*/
function KeyValuePair(key, value) {
    this.key = key;
    this.value = value;
}

mixin(KeyValuePair.prototype, {
    __hash__: function () {
        return combineHash(runtimeHash(this.key), runtimeHash(this.value));
    },

    __eq__: function (obj) {
        return obj instanceof KeyValuePair &&
            runtimeEquals(this.key, obj.key) &&
            runtimeEquals(this.value, obj.value);
    },

    toString: function () {
        return '[KeyValuePair]';
    }
});

function isNumber(val) {
    return typeof val === 'number';
}

/**
* Initializes a new instance of the Dictionary.
* @param {Dictionary|EqualityComparer|Number} value The Dictionary whose elements are copied to the new Dictionary or the EqualityComparer or Capacity
* @param {EqualityComparer=} comparer The EqualityComparer implementation to use when comparing keys.
*/
function Dictionary(value, comparer) {
    var dic = isType(value, Dictionary) ? value : null,
        cmp = EqualityComparer.from(dic ? comparer : value),
        table = new HashTable(cmp, dic ? dic.count() : (isNumber(value) ? value : 0));

    if (dic) {
        forOf(dic, function (element) {
            table.add(element.key, element.value);
        });
    }

    this.table = table;

    defineProperty(this, 'comparer', {
        get: function () {
            return table.comparer;
        }
    });
}

extend(Dictionary, Collection, {
    /**
    * Adds an element with the provided key and value to the Dictionary.
    * @param {Object} key The object to use as the key of the element to add.
    * @param {Object} value The object to use as the value of the element to add.
    */
    add: function (key, value) {
        if (!this.table.add(key, value)) {
            error(ERROR_DUPLICATE_KEY);
        }
    },

    /**
    * Removes all keys and values from the Dictionary.
    */
    clear: function () {
        this.table.clear();
    },

    /**
    * Gets the number of elements contained in the Dictionary.
    * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
    * @returns {Number}
    */
    count: function (predicate) {
        return predicate ? iterableCount(this, predicate) : this.table.count();
    },

    /**
    * Determines whether the Dictionary contains the specified key.
    * @param {Object} key The key to locate in the Dictionary.
    * @returns {Boolean}
    */
    containsKey: function (key) {
        return this.table.contains(key);
    },

    /**
    * Determines whether the Dictionary contains a specific value.
    * @param {Object} value The value to locate in the Dictionary.
    * @returns {Boolean}
    */
    containsValue: function (value) {
        return this.table.containsValue(value);
    },

    /**
    * Gets a Collection containing the keys of the Dictionary.
    * @returns {Collection}
    */
    keys: function () {
        return new KeyValueIterator(this, function (key) {
            return key;
        });
    },

    /**
    * Gets a Collection containing the values in the Dictionary.
    * @returns {Collection}
    */
    values: function () {
        return new KeyValueIterator(this, function (key, value) {
            return value;
        });
    },

    /**
    * Gets element with the specified key.
    * @param {Object} key The key of the element to get.
    * @returns {Object}
    */
    get: function (key) {
        var entry = this.table.entry(key);
        if (entry !== undefined) {
            return entry[1];
        }

        error(ERROR_KEY_NOT_FOUND);
    },

    /**
    * Sets the element with the specified key.
    * @param {Object} key The key of the element to set.
    * @param {Object} value The object to use as the value of the element to set.
    */
    set: function (key, value) {
        this.table.set(key, value);
    },

    /**
    * Gets the value associated with the specified key.
    * @param {Object} key The key whose value to get.
    * @param {Function} callback When this method returns, callback method is called with the value
    * associated with the specified key, if the key is found; otherwise, null for the type of the value parameter.
    * @returns {Boolean}
    */
    tryGetValue: function (key, callback) {
        assertType(callback, Function);

        var entry = this.table.entry(key);

        if (entry !== undefined) {
            callback(entry[1]);
            return true;
        }

        return false;
    },

    /**
    * Removes the element with the specified key from the Dictionary.
    * @param {Object} key The key of the element to remove.
    * @returns {Boolean}
    */
    remove: function (key) {
        return this.table.remove(key);
    },

    toString: function () {
        return '[Dictionary]';
    },

    '@@iterator': function () {
        return new KeyValueIterator(this, function (key, value) {
            return new KeyValuePair(key, value);
        });
    }
});



function KeyValueIterator(dic, selector) {
    IterableIterator.call(this, function () {
        return new HashTableIterator(dic.table, selector);
    });
}

extend(KeyValueIterator, IterableIterator, {
    toString: function () {
        return '[KeyValue Iterator]';
    }
});

function assertNotNull(obj) {
    if (obj === null || obj === undefined) {
        error('Value cannot be null.');
    }
}

function binarySearch(array, index, length, value, compare) {
    var lo = index,
        hi = index + length - 1,
        order = 0,
        i = 0;

    while (lo <= hi) {
        i = lo + ((hi - lo) >> 1);
        order = compare(array[i], value);

        if (order === 0) {
            return i;
        }
        else if (order < 0) {
            lo = i + 1;
        }
        else {
            hi = i - 1;
        }
    }

    return ~lo;
}

/**
* Initializes a new instance of the List class.
* @param {Number|Iterable|...Object=} value The number of elements, Arbitrary number of arguments or the collection whose elements are copied to the new list.
*/
function List(value) {
    this.length = 0;

    if (arguments.length === 1) {
        if (isNumber(value)) {
            this.length = value;
        }

        else {
            this.addRange(value);
        }
    }
    else {
        this.addRange(arguments);
    }
}

extend(List, Collection, {
    /**
    * Adds an object to the end of the List.
    * @param {Object} item The object to be added to the end of the List.
    */
    add: function (item) {
        this[this.length++] = item;
    },

    /**
    * Adds the elements of the specified collection to the end of the List.
    * @param {Iterable} collection The collection whose elements should be added to the end of the List.
    */
    addRange: function (collection) {
        assertNotNull(collection);
        this.insertRange(this.length, collection);
    },

    /**
    * Returns a read-only wrapper for the current list.
    * @returns {ReadOnlyCollection}
    */
    asReadOnly: function () {
        return new ReadOnlyCollection(this);
    },

    /**
    * Searches a range of elements in the sorted List for an element using the specified comparer and returns the zero-based index of the element.
    * @param {Object} item The object to locate.
    * @param {Comparer=} comparer The Comparer implementation to use when comparing elements.
    * @param {Number=} index The zero-based starting index of the range to search.
    * @param {Number=} count The length of the range to search.
    * @returns {Number}
    */
    binarySearch: function (item, comparer, index, count) {
        index = index || 0;
        count = count || this.length;
        comparer = Comparer.from(comparer);

        return binarySearch(this, index, count, item, comparer.compare);
    },

    /**
    * Removes all items from the List.
    */
    clear: function () {
        shrinkList(this, 0);
    },

    /**
    * Gets the number of elements contained in the List.
    * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
    * @returns {Number}
    */
    count: function (predicate) {
        return predicate ? iterableCount(this, predicate) : this.length;
    },

    /**
    * Determines whether the List contains a specific value.
    * @param {Object} item The object to locate in the List.
    * @returns {Boolean}
    */
    contains: function (item) {
        return this.indexOf(item) !== -1;
    },

    /**
    * Copies the elements of the List to an Array, starting at a particular Array index.
    * @param {Array} array The one-dimensional Array that is the destination of the elements copied from List.
    * @param {Number} arrayIndex The zero-based index in array at which copying begins.
    */
    copyTo: function (array, arrayIndex) {
        bufferTo(this, array, arrayIndex);
    },

    /**
    * Determines whether the List contains elements that match the conditions defined by the specified predicate.
    * @param {Function} match The predicate function that defines the conditions of the elements to search for. eg. function(item)
    * @returns {Boolean}
    */
    exists: function (match) {
        return this.findIndex(match) !== -1;
    },

    /**
    * Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire List.
    * @param {Function} match The predicate function that defines the conditions of the elements to search for. eg. function(item)
    * @returns {Object}
    */
    find: function (match) {
        assertType(match, Function);

        for (var i = 0, len = this.length; i < len; i++) {
            if (match(this[i]) === true) {
                return this[i];
            }
        }
    },

    /**
    * Searches for an element that matches the conditions defined by the specified predicate,
    * and returns the zero-based index of the first occurrence within the range of elements
    * in the List that starts at the specified index and contains the specified number of elements.
    * @param {Number|Function} startIndexOrMatch The zero-based starting index of the search or the predicate function, eg. function(item)
    * @param {Number|Function=} countOrMatch The number of elements in the section to search or the predicate function, eg. function(item)
    * @param {Function=} match The predicate function that defines the conditions of the elements to search for, eg. function(item)
    * @returns {Number}
    */
    findIndex: function (startIndexOrMatch, countOrMatch, match) {
        var len = this.length,
            startIndex = isNumber(startIndexOrMatch) ? startIndexOrMatch : 0,
            count = isNumber(countOrMatch) ? countOrMatch : len - startIndex;

        match = isFunction(startIndexOrMatch) ? startIndexOrMatch : (isFunction(countOrMatch) ? countOrMatch : match);

        assertType(match, Function);
        validateListIndex(this, startIndex);

        while (count-- > 0 && startIndex < len) {
            if (match(this[startIndex]) === true) {
                return startIndex;
            }

            startIndex++;
        }

        return -1;
    },

    /**
    * Searches for an element that matches the conditions defined by the specified predicate,
    * and returns the last occurrence within the entire List.
    * @param {Function} match The predicate function that defines the conditions of the elements to search for. eg. function(item)
    * @returns {Object}
    */
    findLast: function (match) {
        assertType(match, Function);

        var len = this.length;
        while (len-- > 0) {
            if (match(this[len]) === true) {
                return this[len];
            }
        }

        return undefined;
    },

    /**
    * Searches for an element that matches the conditions defined by the specified predicate,
    * and returns the zero-based index  of the last occurrence within the range of elements
    * in the List that contains the specified number of elements and ends at the specified index.
    * @param {Number|Function} startIndexOrMatch The zero-based starting index of the search or the predicate, eg. function(item)
    * @param {Number|Function=} countOrMatch The number of elements in the section to search or the predicate, eg. function(item)
    * @param {Function=} match The predicate function that defines the conditions of the elements to search for, eg. function(item)
    * @returns {Number}
    */
    findLastIndex: function (startIndexOrMatch, countOrMatch, match) {
        var startIndex = isNumber(startIndexOrMatch) ? startIndexOrMatch : this.length - 1,
            count = isNumber(countOrMatch) ? countOrMatch : startIndex;

        match = isFunction(startIndexOrMatch) ? startIndexOrMatch : (isFunction(countOrMatch) ? countOrMatch : match);

        assertType(match, Function);
        validateListIndex(this, startIndex);

        while (count-- > 0 && startIndex > 0) {
            if (match(this[startIndex]) === true) {
                return startIndex;
            }

            startIndex--;
        }

        return -1;
    },

    /**
    * Retrieves all the elements that match the conditions defined by the specified predicate.
    * @param {Function} match The predicate function that defines the conditions of the elements to search for. eg. function(item)
    * @returns {List}
    */
    findAll: function (match) {
        assertType(match, Function);

        var arr = new Array(this.length),
            count = 0;

        for (var i = 0, len = this.length; i < len; i++) {
            if (match(this[i]) === true) {
                arr[count++] = this[i];
            }
        }

        arr.length = count;
        return new List(arr);
    },

    /**
    * Gets the element at the specified index.
    * @param {Number} index The zero-based index of the element to get.
    * @returns {Object}
    */
    get: function (index) {
        validateListIndex(this, index);
        return this[index];
    },

    /**
    * Creates a shallow copy of a range of elements in the source List.
    * @param {Number} index The zero-based List index at which the range starts.
    * @param {Number} count The number of elements in the range.
    * @returns {List}
    */
    getRange: function (index, count) {
        validateListIndex(this, index + count - 1);
        return new List(this.slice(index, index + count));
    },

    /**
    * Searches for the specified object and returns the zero-based index of the first occurrence within
    * the range of elements in the List that extends from the specified index to the last element.
    * @param {Object} item The object to locate in the List.
    * @param {Number=} index The zero-based starting index of the search. 0 (zero) is valid in an empty list.
    * @returns {Number}
    */
    indexOf: ARRAY_PROTOTYPE.indexOf,

    /**
    * Inserts an element into the List at the specified index.
    * @param {Number} index The zero-based index at which item should be inserted.
    * @param {Object} item The object to insert.
    */
    insert: function (index, item) {
        if (index !== this.length) {
            validateListIndex(this, index);
        }

        var len = ++this.length;

        while (len-- > index) {
            this[len] = this[len - 1];
        }

        this[index] = item;
    },

    /**
    * Inserts the elements of a collection into the List at the specified index.
    * @param {Number} index The zero-based index at which item should be inserted.
    * @param {Iterable} collection The collection whose elements should be inserted into the List.
    */
    insertRange: function (index, collection) {
        assertType(index, Number);
        assertNotNull(collection);

        if (index !== this.length) {
            validateListIndex(this, index);
        }

        var arr = buffer(collection),
            count = arr.length,
            len = this.length + count;

        this.length = len;

        while (len-- > index) {
            this[len] = this[len - count];
        }

        while (count-- > 0) {
            this[index + count] = arr[count];
        }
    },

    /**
    * Searches for the specified object and returns the zero-based index of the last occurrence
    * within the range of elements in the List that extends from the specified index to the last element.
    * @param {Object} item The object to locate in the List.
    * @param {Number=} index The zero-based starting index of the search. 0 (zero) is valid in an empty list.
    * @returns {Number}
    */
    lastIndexOf: ARRAY_PROTOTYPE.lastIndexOf,

    /**
    * Removes the first occurrence of a specific object from the List.
    * @param {Object} item The object to remove from the List.
    * @returns {Boolean}
    */
    remove: function (item) {
        var index = this.indexOf(item);

        if (index !== -1) {
            this.removeAt(index);
            return true;
        }

        return false;
    },

    /**
    * Removes all the elements that match the conditions defined by the specified predicate.
    * @param {Function} match The predicate function that defines the conditions of the elements to remove. eg. function(item)
    * @returns {Number}
    */
    removeAll: function (match) {
        assertType(match, Function);

        var freeIndex = 0,
            len = this.length;

        while (freeIndex < len && !match(this[freeIndex])) {
            freeIndex++;
        }

        if (freeIndex >= len) {
            return 0;
        }

        var current = freeIndex + 1;

        while (current < len) {
            while (current < len && match(this[current])) {
                current++;
            }

            if (current < len) {
                this[freeIndex++] = this[current++];
            }
        }

        shrinkList(this, freeIndex);
        return len - freeIndex;
    },

    /**
    * Removes the element at the specified index of the List.
    * @param {Number} index The zero-based index of the element to remove.
    */
    removeAt: function (index) {
        validateListIndex(this, index);

        var i = index,
            len = --this.length;

        for (; i < len; i++) {
            this[i] = this[i + 1];
        }

        delete this[len];
    },

    /**
    * Removes a range of elements from the List.
    * @param {Number} index The zero-based index of the element to remove.
    * @param {Number} count The number of elements to remove.
    */
    removeRange: function (index, count) {
        validateListIndex(this, index + count - 1);

        var len = this.length - count;

        for (; index < len; index++) {
            this[index] = this[index + count];
        }

        shrinkList(this, len);
    },

    /**
    * Reverses the order of the elements in the specified range.
    * @param {Number=} index The zero-based starting index of the range to reverse.
    * @param {Number=} count The number of elements in the range to reverse.
    */
    reverse: function (index, count) {
        index = index || 0;
        count = count || this.length;
        validateListIndex(this, index + count - 1);

        var arr = this.slice(index, index + count).reverse(),
            len = arr.length;

        while (len-- > 0) {
            this[len + index] = arr[len];
        }

        return this;
    },

    /**
    * Returns a shallow copy of a portion of the list into a new array object.
    * @param {Number=} begin Zero-based index at which to begin extraction.
    * @param {Number=} end Zero-based index at which to end extraction
    * @returns {Array}
    */
    slice: ARRAY_PROTOTYPE.slice,

    /**
    * Changes the content of the list by removing existing elements and/or adding new elements.
    * @param {Number} start Index at which to start changing the list.
    * @param {Number} deleteCount An integer indicating the number of old list elements to remove.
    * @param {Object...} items The elements to add to the list.
    * @returns {Array}
    */
    splice: ARRAY_PROTOTYPE.splice,

    /**
    * Sets the element at the specified index.
    * @param {Number} index The zero-based index of the element to set.
    * @param {Object} item The object to be added at the specified index.
    */
    set: function (index, value) {
        validateListIndex(this, index);
        this[index] = value;
    },

    /**
    * Sorts the elements in a range of elements in List using the specified comparer.
    * @param {Number|Function|Comparer} val The starting index, the comparison function or the Comparer.
    * @param {Number=} count The length of the range to sort.
    * @param {Comparer=} comparer The Comparer implementation to use when comparing elements.
    */
    sort: function (indexOrComparer, count, comparer) {
        var index = isNumber(indexOrComparer) ? indexOrComparer : 0,
            total = count || this.length - index,
            comparision = indexOrComparer === null ? null :
                (isFunction(indexOrComparer) ? indexOrComparer :
                    Comparer.from(comparer || indexOrComparer).compare);

        validateListIndex(this, index + total - 1);

        var arr = this.slice(index, index + total).sort(comparision),
            len = arr.length;

        while (len-- > 0) {
            this[len + index] = arr[len];
        }
    },

    /**
    * Copies the elements of the List to a new array.
    * @returns {Array}
    */
    toArray: function () {
        return this.slice();
    },

    /**
    * Determines whether every element in the List matches the conditions defined by the specified predicate.
    * @param {Function} match The Predicate function that defines the conditions to check against the elements, eg. function(item)
    * @returns {Boolean}
    */
    trueForAll: function (match) {
        assertType(match, Function);

        for (var i = 0, len = this.length; i < len; i++) {
            if (match(this[i]) === false) {
                return false;
            }
        }

        return true;
    },

    toString: function () {
        return '[List]';
    },

    '@@iterator': function () {
        return new ArrayIterator(this);
    }
});


/// helper method to shrink the list to lower size and delete upper indexes
function shrinkList(list, newSize) {
    var size = list.length;
    list.length = newSize;

    if (size < newSize) {
        do {
            delete list[newSize];
        }
        while (newSize-- < size);
    }
}


/// helper method to validate index against being out of range
function validateListIndex(list, index) {
    if (index < 0 || index >= list.length) {
        error(ERROR_ARGUMENT_OUT_OF_RANGE);
    }
}

/**
* Represents a node in a LinkedList.
* Initializes a new instance of the LinkedListNode class, containing the specified value.
* @param {Object} value The value to contain in the LinkedListNode
*/
function LinkedListNode(value) {
    this._value = value;
    this._list = null;
    this._next = null;
    this._prev = null;
}

mixin(LinkedListNode, {
    /**
    * Gets the value contained in the node.
    * @returns {Object}
    */
    value: function () {
        return this._value;
    },

    /**
    * Gets the LinkedList that the LinkedListNode belongs to.
    * @returns {LinkedList}
    */
    list: function () {
        return this._list;
    },

    /**
    * Gets the next node in the LinkedList.
    * @returns {LinkedListNode}
    */
    next: function () {
        return this._next === null || this._next === this._list.head ? null : this._next;
    },

    /**
    * Gets the previous node in the LinkedList.
    * @returns {LinkedListNode}
    */
    previous: function () {
        return this._prev === null || this === this._list.head ? null : this._prev;
    },

    toString: function () {
        return '[LinkedList Node]';
    }
});

/**
* Represents a doubly linked list.
* Initializes a new instance of the LinkedList class that that is empty or contains elements copied from the specified collection.
* @param {Iterable=} collection The collection to copy elements from.
*/
function LinkedList(collection) {
    this.size = 0;
    this.head = null;

    if (collection) {
        var list = this;
        forOf(collection, function (element) {
            list.addLast(element);
        });
    }
}

extend(LinkedList, Collection, {
    /**
    * Adds an item to the LinkedList.
    * @param {Object} item The object to add to the LinkedList.
    */
    add: function (item) {
        this.addLast(item);
    },

    /**
    * Removes all nodes from the LinkedList.
    */
    clear: function () {
        while (this.head !== null) {
            var temp = this.head;
            this.head = this.head.next();   // use next() the instead of "_next", otherwise it will loop forever
            temp._list = null;
            temp._next = null;
            temp._prev = null;
        }

        this.head = null;
        this.size = 0;
    },

    /**
    * Gets the number of elements contained in the LinkedList.
    * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
    * @returns {Number}
    */
    count: function (predicate) {
        return predicate ? iterableCount(this, predicate) : this.size;
    },

    /**
    * Determines whether a value is in the LinkedList.
    * @param {Object} value The value to locate in the LinkedList.
    * @returns {Boolean}
    */
    contains: function (item) {
        return this.find(item) !== null;
    },

    /**
    * Gets the first node of the LinkedList.
    * @returns {LinkedListNode}
    */
    getFirst: function () {
        return this.head;
    },

    /**
    * Gets the last node of the LinkedList.
    * @returns {LinkedListNode}
    */
    getLast: function () {
        var head = this.head;
        return head === null ? null : head._prev;
    },

    /**
    * Adds the specified new node after the specified existing node in the LinkedList.
    * @param {LinkedListNode} node The LinkedListNode after which to insert newNode.
    * @param {LinkedListNode|Object} value The value or the LinkedListNode to add to the LinkedList.
    * @returns {LinkedListNode}
    */
    addAfter: function (node, value) {
        assertType(node, LinkedListNode);

        var newNode;

        if (value instanceof LinkedListNode) {
            newNode = value;
            this.insertNodeBefore(node._next, newNode);
        }
        else {
            newNode = new LinkedListNode(value);
            this.addAfter(node, newNode);
        }

        return newNode;
    },

    /**
    * Adds the specified new node before the specified existing node in the LinkedList.
    * @param {LinkedListNode} node The LinkedListNode before which to insert newNode.
    * @param {LinkedListNode|Object} value The value or the LinkedListNode to add to the LinkedList.
    * @returns {LinkedListNode}
    */
    addBefore: function (node, value) {
        assertType(node, LinkedListNode);

        var newNode;

        if (value instanceof LinkedListNode) {
            newNode = value;
            this.insertNodeBefore(node, newNode);
            if (node === this.head) {
                this.head = newNode;
            }
        }
        else {
            newNode = new LinkedListNode(value);
            this.addBefore(node, newNode);
        }

        return newNode;
    },

    /**
    * Adds the specified new node at the start of the LinkedList.
    * @param {LinkedListNode|Object} value The value or the LinkedListNode to add at the start of the LinkedList.
    * @returns {LinkedListNode}
    */
    addFirst: function (value) {
        var node;

        if (value instanceof LinkedListNode) {
            node = value;
            validateNode(node, null);

            if (this.head === null) {
                this.insertNodeToEmptyList(node);
            }
            else {
                this.insertNodeBefore(this.head, node);
                this.head = node;
            }
        }
        else {
            node = new LinkedListNode(value);
            this.addFirst(node);
        }

        return node;
    },

    /**
        * Adds the specified new node at the end of the LinkedList.
        * @param {LinkedListNode|Object} value The value or the LinkedListNode to add at the end of the LinkedList.
        * @returns {LinkedListNode}
        */
    addLast: function (value) {
        var node;

        if (value instanceof LinkedListNode) {
            node = value;
            validateNode(node, null);

            if (this.head === null) {
                this.insertNodeToEmptyList(node);
            }
            else {
                this.insertNodeBefore(this.head, node);
            }
        }
        else {
            node = new LinkedListNode(value);
            this.addLast(node);
        }

        return node;
    },

    /**
    * Finds the first node that contains the specified value.
    * @param {Object} value The value to locate in the LinkedList.
    * @returns {LinkedListNode}
    */
    find: function (value) {
        var node = this.head;

        if (node !== null) {
            if (value !== null) {
                do {
                    if (runtimeEquals(node._value, value)) {
                        return node;
                    }
                    node = node._next;
                }
                while (node !== this.head);
            }
            else {
                do {
                    if (node._value === null) {
                        return node;
                    }

                    node = node._next;
                }
                while (node !== this.head);
            }
        }

        return null;
    },

    /**
    * Finds the last node that contains the specified value.
    * @param {Object} value The value to locate in the LinkedList.
    * @returns {LinkedListNode}
    */
    findLast: function (value) {
        if (this.head === null) {
            return null;
        }

        var last = this.head._prev,
            node = last;

        if (node !== null) {
            if (value !== null) {
                do {
                    if (runtimeEquals(node._value, value)) {
                        return node;
                    }

                    node = node._prev;
                }
                while (node !== last);
            }
            else {
                do {
                    if (node._value === null) {
                        return node;
                    }

                    node = node._prev;
                }
                while (node !== last);
            }
        }

        return null;
    },

    /**
    * Removes Removes the specified node or the first occurrence of the specified value from the LinkedList.
    * @param {LinkedListNode|Object} value The LinkedListNode or the value to remove from the LinkedList.
    * @returns {Boolean}
    */
    remove: function (value) {
        var node;

        if (value instanceof LinkedListNode) {
            node = value;
            validateNode(node, this);

            if (node._next === node) {
                this.head = null;
            }
            else {
                node._next._prev = node._prev;
                node._prev._next = node._next;

                if (this.head === node) {
                    this.head = node._next;
                }
            }
            node._list = null;
            node._next = null;
            node._prev = null;
            this.size--;

            return true;
        }
        else {
            if ((node = this.find(value)) !== null) {
                this.remove(node);
                return true;
            }
            return false;
        }
    },

    /**
    * Removes the node at the start of the LinkedList.
    */
    removeFirst: function () {
        if (this.head === null) {
            error(ERROR_EMPTY_COLLECTION);
        }

        this.remove(this.head);
    },

    /**
    * Removes the node at the end of the LinkedList.
    */
    removeLast: function () {
        if (this.head === null) {
            error(ERROR_EMPTY_COLLECTION);
        }

        this.remove(this.head._prev);
    },

    insertNodeBefore: function (node, newNode) {
        assertType(node, LinkedListNode);
        assertType(newNode, LinkedListNode);

        validateNode(newNode, null);
        validateNode(node, this);

        newNode._list = this;
        newNode._next = node;
        newNode._prev = node._prev;

        node._prev._next = newNode;
        node._prev = newNode;
        this.size++;
    },

    insertNodeToEmptyList: function (newNode) {
        assertType(newNode, LinkedListNode);
        validateNode(newNode, null);

        newNode._list = this;
        newNode._next = newNode;
        newNode._prev = newNode;

        this.head = newNode;
        this.size++;
    },

    toString: function () {
        return '[Linked List]';
    },

    '@@iterator': function () {
        var head = this.head,
            node = head;

        return new Iterator(function () {
            if (node !== null) {
                var current = node._value;

                node = node._next;
                if (node === head) {
                    node = null;
                }

                return {
                    value: current,
                    done: false
                };
            }

            return {
                done: true
            };
        });
    }
});

function validateNode(node, list) {
    if ((list === null && node._list !== null) || node._list !== list) {
        error('Invalid node list.');
    }
}

function Grouping(key, elements) {
    this.key = key;
    this.elements = elements;
    Collection.call(this, elements);
}

extend(Grouping, Collection, {
    /**
    * Gets the number of elements in the Grouping.
    * @returns {Number}
    */
    count: function () {
        return this.elements.length;
    },

    /**
    * Creates an array from the Grouping.
    * @returns {Array}
    */
    toArray: function () {
        return this.elements;
    },

    toString: function () {
        return '[Grouping]';
    }
});

var emptyGrouping = new Grouping(null, []);

function LookupTable(comparer) {
    this.size = 0;
    this.slots = new Array(7);
    this.buckets = new Array(7);
    this.comparer = EqualityComparer.from(comparer);
}


mixin(LookupTable.prototype, {
    add: function (key, value) {
        this.getGrouping(key, value, true);
    },

    get: function (key) {
        return this.getGrouping(key, null, false) || emptyGrouping;
    },

    contains: function (key) {
        return this.getGrouping(key, null, false) !== null;
    },

    entries: function () {
        var arr = new Array(this.size),
            index = 0,
            slot = null;

        for (var i = 0, count = this.slots.length; i < count; i++) {
            slot = this.slots[i];
            if (slot !== undefined) {
                arr[index++] = slot.grouping;
            }
        }

        return arr;
    },

    getGrouping: function (key, value, create) {
        var comparer = this.comparer,
            hash = comparer.hash(key) & 0x7FFFFFFF,
            bucket = hash % this.buckets.length,
            index = this.buckets[bucket],
            grouping = null,
            slot = null;


        while (index !== undefined) {
            slot = this.slots[index];

            if (slot.hash === hash && comparer.equals(slot.grouping.key, key)) {
                grouping = slot.grouping;
                break;
            }

            index = slot.next;
        }


        if (create === true) {
            if (grouping === null) {
                if (this.size === this.slots.length) {
                    this.resize();
                    bucket = hash % this.buckets.length;
                }

                index = this.size;
                this.size++;

                grouping = new Grouping(key, [value]);
                this.slots[index] = new LookupTableSlot(hash, grouping, this.buckets[bucket]);
                this.buckets[bucket] = index;
            }
            else {
                grouping.elements.push(value);
            }
        }

        return grouping;
    },

    resize: function () {
        var size = this.size,
            newSize = resize(size),
            slot = null,
            bucket = 0;

        this.slots.length = newSize;
        this.buckets = new Array(newSize);

        // rehash values & update buckets and slots
        for (var index = 0; index < size; index++) {
            slot = this.slots[index];
            bucket = slot.hash % newSize;
            slot.next = this.buckets[bucket];
            this.buckets[bucket] = index;
        }
    },

    '@@iterator': function () {
        return new LookupTableIterator(this);
    }
});



function LookupTableIterator(lookup) {
    var index = -1,
        size = lookup.size,
        slots = lookup.slots;

    Iterator.call(this, function () {
        if (++index < size) {
            return {
                value: slots[index].grouping,
                done: false
            };
        }

        return {
            done: true
        };
    });
}

extend(LookupTableIterator, Iterator);


function LookupTableSlot(hash, grouping, next) {
    this.hash = hash;
    this.next = next;
    this.grouping = grouping;
}

function Lookup(source, keySelector, elementSelector, comparer) {
    assertNotNull(source);
    assertType(keySelector, Function);

    if (elementSelector) {
        assertType(elementSelector, Function);
    }

    var table = new LookupTable(comparer);
    this.table = table;

    forOf(source, function (element) {
        table.add(keySelector(element), elementSelector ? elementSelector(element) : element);
    });
}


extend(Lookup, Collection, {
    get: function (key) {
        return this.table.get(key);
    },

    contains: function (key) {
        return this.table.contains(key);
    },

    count: function (predicate) {
        return predicate ? iterableCount(this, predicate) : this.table.size;
    },

    toArray: function () {
        return this.table.entries();
    },

    toString: function () {
        return '[Lookup]';
    },

    '@@iterator': function () {
        return new LookupTableIterator(this.table);
    }
});

/**
* Initializes a new instance of the HashSet class.
* @param {Iterable=} iterable The Iterable whose elements are copied to the new set.
* @param {EqualityComparer=} comparer the EqualityComparer implementation to use when comparing values in the set.
*/
function HashSet(iterable, comparer) {
    var table = new HashTable(EqualityComparer.from(comparer));

    if (iterable) {
        forOf(iterable, function (element) {
            table.add(element);
        });
    }

    this.table = table;
    defineProperty(this, 'comparer', {
        get: function () {
            return table.comparer;
        }
    });
}

extend(HashSet, Collection, {
    /**
    * Adds an element to the current set.
    * @param {Object} item The element to add to the set.
    * @returns {Boolean}
    */
    add: function (item) {
        return this.table.add(item);
    },

    /**
    * Removes all elements from a HashSet object.
    */
    clear: function () {
        this.table.clear();
    },

    /**
    * Gets the number of elements contained in the HashSet.
    * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
    * @returns {Number}
    */
    count: function (predicate) {
        return predicate ? iterableCount(this, predicate) : this.table.count();
    },

    /**
    * Determines whether a HashSet object contains the specified element.
    * @param {Object} item The element to locate in the HashSet object.
    * @returns {Boolean}
    */
    contains: function (item) {
        return this.table.contains(item);
    },

    /**
    * Removes all elements in the specified collection from the current set.
    * @param {Iterable} other The collection of items to remove from the set.
    */
    exceptWith: function (other) {
        assertNotNull(other);

        if (this.count() === 0) {
            return;
        }

        else if (other === this) {
            this.clear();
            return;
        }

        var table = this.table;
        forOf(other, function (element) {
            table.remove(element);
        });
    },

    /**
    * Modifies the current set so that it contains only elements that are also in a specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    */
    intersectWith: function (other) {
        assertNotNull(other);

        // intersection of anything with empty set is empty set, so return if count is 0
        if (this.count() === 0) {
            return;
        }

        var c = collectionCount(other);

        if (c !== -1) {
            if (c === 0) {
                this.clear();
                return;
            }

            // If other is a HashSet, it has unique elements according to its equality comparer,
            // but if they're using different equality comparers, then assumption of uniqueness
            // will fail. So first check if other is a hashset using the same equality comparer;
            // intersect is a lot faster if we can assume uniqueness.

            if (areEqualityComparersEqual(this, other)) {
                var arr = this.table.entries(true),
                    item;

                c = this.count();

                while (c-- > 0) {
                    item = arr[c];
                    if (!other.contains(item)) {
                        this.table.remove(item);
                    }
                }

                return;
            }
        }

        this.intersectWith(new HashSet(other, this.compare));
    },

    /**
    * Determines whether the current set is a proper (strict) subset of a specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    isProperSubsetOf: function (other) {
        assertNotNull(other);

        var c = collectionCount(other);

        if (c !== -1) {
            if (this.count() === 0) {
                return c > 0;
            }

            // faster if other is a hashset (and we're using same equality comparer)
            else if (areEqualityComparersEqual(this, other)) {
                if (this.count() >= c) {
                    return false;
                }

                // this has strictly less than number of items in other, so the following
                // check suffices for proper subset.
                else {
                    return containsAllElements(other, this);
                }
            }
        }

        var result = checkUniqueAndUnfoundElements(this, other, false);
        return (result.uniqueCount === this.count() && result.unfoundCount > 0);
    },

    /**
    * Determines whether the current set is a proper (strict) superset of a specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    isProperSupersetOf: function (other) {
        assertNotNull(other);

        // the empty set isn't a proper superset of any set.
        if (this.count() === 0) {
            return false;
        }

        var c = collectionCount(other);

        if (c !== -1) {
            // if other is the empty set then this is a superset
            if (c === 0) {
                return true;
            }

            // faster if other is a hashset with the same equality comparer
            else if (areEqualityComparersEqual(this, other)) {
                if (c >= this.count()) {
                    return false;
                }

                else {
                    return containsAllElements(this, other);
                }
            }
        }

        var result = checkUniqueAndUnfoundElements(this, other, true);
        return (result.uniqueCount < this.count() && result.unfoundCount === 0);
    },

    /**
    * Determines whether a set is a subset of a specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    isSubsetOf: function (other) {
        assertNotNull(other);

        // The empty set is a subset of any set
        if (this.count() === 0) {
            return true;
        }

        else if (areEqualityComparersEqual(this, other)) {
            if (this.count() > other.count()) {
                return false;
            }

            else {
                return containsAllElements(other, this);
            }
        }

        var result = checkUniqueAndUnfoundElements(this, other, false);
        return (result.uniqueCount === this.count() && result.unfoundCount >= 0);
    },

    /**
    * Determines whether the current set is a superset of a specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    isSupersetOf: function (other) {
        assertNotNull(other);

        var c = collectionCount(other);

        if (c !== -1) {
            // if other is the empty set then this is a superset
            if (c === 0) {
                return true;
            }

            else if (areEqualityComparersEqual(this, other)) {
                if (c > this.count()) {
                    return false;
                }
            }
        }

        return containsAllElements(this, other);
    },

    /**
    * Determines whether the current set overlaps with the specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    overlaps: function (other) {
        assertNotNull(other);

        if (this.count() === 0) {
            return false;
        }

        var table = this.table,
            res = false;

        forOf(other, function (element) {
            if (table.contains(element)) {
                res = true;
                return res;
            }
        });

        return res;
    },

    /**
    * Removes the specified element from a HashSet object.
    * @param {Object} item The element to remove.
    * @returns {Boolean}
    */
    remove: function (item) {
        return this.table.remove(item);
    },

    /**
    * Removes all elements that match the conditions defined by the specified predicate from a HashSet collection.
    * @param {Function} match The predicate function that defines the conditions of the elements to remove. eg. function(item)
    * @returns {Number}
    */
    removeWhere: function (match) {
        assertType(match, Function);

        var len = this.count(),
            arr = this.table.entries(true),
            removed = 0,
            item;


        while (len-- > 0) {
            item = arr[len];

            if (match(item) && this.table.remove(item)) {
                removed++;
            }
        }

        return removed;
    },

    /**
    * Determines whether the current set and the specified collection contain the same elements.
    * @param {Iterable} other The collection to compare to the current set.
    * @returns {Boolean}
    */
    setEquals: function (other) {
        assertNotNull(other);

        if (areEqualityComparersEqual(this, other)) {
            if (this.count() !== other.count()) {
                return false;
            }

            /// already confirmed that the sets have the same number of distinct elements,
            /// so if one is a superset of the other then they must be equal

            return containsAllElements(this, other);
        }

        var c = collectionCount(other);

        if (c !== -1) {
            // if this count is 0 but other contains at least one element, they can't be equal
            if (this.count() === 0 && c > 0) {
                return false;
            }
        }

        var result = checkUniqueAndUnfoundElements(this, other, true);
        return (result.uniqueCount === this.count() && result.unfoundCount === 0);
    },

    /**
    * Modifies the current set so that it contains only elements that are present
    * either in the current set or in the specified collection, but not both.
    * @param {Iterable} other The collection to compare to the current set.
    */
    symmetricExceptWith: function (other) {
        assertNotNull(other);

        if (this.count() === 0) {
            this.unionWith(other);
            return;
        }

        else if (other === this) {
            this.clear();
            return;
        }

        // If other is a HashSet, it has unique elements according to its equality comparer,
        // but if they're using different equality comparers, then assumption of uniqueness
        // will fail. So first check if other is a hashset using the same equality comparer;
        // symmetric except is a lot faster if we can assume uniqueness

        if (areEqualityComparersEqual(this, other)) {
            var table = this.table;

            forOf(other, function (element) {
                if (!table.remove(element)) {
                    table.add(element, null);
                }
            });
        }
        else {
            this.symmetricExceptWith(new HashSet(other, this.comparer));
        }
    },

    /**
    * Modifies the current set so that it contains all elements that are present
    * in either the current set or the specified collection.
    * @param {Iterable} other The collection to compare to the current set.
    */
    unionWith: function (other) {
        assertNotNull(other);

        var table = this.table;

        forOf(other, function (element) {
            table.add(element);
        });
    },

    /**
    * Creates an array from the HashSet.
    * @returns {Array}
    */
    toArray: function () {
        return this.table.entries(true);
    },

    toString: function () {
        return '[HashSet]';
    },

    '@@iterator': function () {
        return new HashSetIterator(this);
    }
});


function HashSetIterator(set) {
    HashTableIterator.call(this, set.table, function (key) {
        return key;
    });
}

extend(HashSetIterator, HashTableIterator, {
    toString: function () {
        return '[HashSet Iterator]';
    }
});


function ElementCount(uniqueCount, unfoundCount) {
    this.uniqueCount = uniqueCount;
    this.unfoundCount = unfoundCount;
}


function areEqualityComparersEqual(set1, set2) {
    return set1 instanceof HashSet && set2 instanceof HashSet && set1.comparer === set2.comparer;
}


function containsAllElements(set, other) {
    var res = true;

    forOf(other, function (element) {
        if (!set.contains(element)) {
            res = false;
            return res;
        }
    });

    return res;
}


function checkUniqueAndUnfoundElements(set, other, returnIfUnfound) {
    // need special case in case this has no elements.
    if (set.count() === 0) {
        if (!$iterator(other).next().done) {
            // all we want to know is whether other has 0 or 1 elements
            return new ElementCount(0, 1);
        }
    }

    var unfoundCount = 0,                      // count of items in other not found in this
        uniqueFoundCount = 0,                  // count of unique items in other found in this
        otable = new HashTable(set.comparer);

    forOf(other, function (element) {
        if (set.contains(element)) {
            if (otable.add(element)) {
                uniqueFoundCount++;
            }
        }
        else {
            unfoundCount++;
            if (returnIfUnfound) {
                return false;
            }
        }
    });

    return new ElementCount(uniqueFoundCount, unfoundCount);
}

/**
* Initializes a new instance of the Map class that that is empty or contains elements copied from the specified iterable.
* @param {Iterable=} iterable An iterable object whose all of its elements will be added to the new Map.
* @param {EqualityComparer=} comparer An equality comparer to compare items.
*/
function Map(iterable, comparer) {
    var table = new HashTable(comparer);

    if (iterable) {
        forOf(iterable, function (element) {
            if (isArray(element)) {
                table.add(element[0], element[1]);
            }
            else {
                error('Iterator value ' + element + ' is not an entry object');
            }
        });
    }

    this.table = table;
    this.size = this.table.count();

    defineProperty(this, 'comparer', {
        get: function () {
            return table.comparer;
        }
    });
}

extend(Map, Collection, {
    /**
    * Removes all elements from the Map object.
    */
    clear: function () {
        this.table.clear();
        this.size = 0;
    },

    /**
    * Returns the number of values in the Map object.
    * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
    */
    count: function (predicate) {
        return predicate ? iterableCount(this, predicate) : this.size;
    },

    /**
    * Removes any value associated to the key and returns the value that Map.prototype.has(key) would have previously returned.
    * @param {Object} key The key of the element to remove from the Map object.
    * @returns {Object}
    */
    delete: function (key) {
        var value = this.table.get(key),
            result = this.table.remove(key);

        this.size = this.table.count();
        return result ? value : false;
    },

    /**
    * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
    * @returns {Iterator}
    */
    entries: function () {
        return new MapIterator(this);
    },

    /**
    * Calls callback once for each value present in the Map object, in insertion order.
    * @param {Function} callback Function to execute for each element.
    * @param {Object=} thisArg If a provided, it will be used as the this value for each callback.
    */
    forEach: function (callback, thisArg) {
        this.table.forEach(callback, this, thisArg);
    },

    /**
    * Returns a boolean asserting whether a value has been associated to the key in the Map object or not.
    * @param {Object} key The key of the element to return from the Map object.
    * @returns {Object}
    */
    get: function (key) {
        return this.table.get(key);
    },

    /**
    * Returns a boolean asserting whether an element is present with the given value in the Map object or not.
    * @param {Object} key The key of the element to test for presence in the Map object.
    * @returns {Boolean}
    */
    has: function (key) {
        return this.table.contains(key);
    },

    /**
    * Returns a new Iterator object that contains the keys for each element in the Map object in insertion order.
    * @returns {Iterator}
    */
    keys: function () {
        return new MapIterator(this, function (key) {
            return key;
        });
    },

    /**
    * Sets the value for the key in the Map object. Returns the Map object.
    * @param {Object} key The key of the element to add to the Map object.
    * @param {Object} value The value of the element to add to the Map object.
    * @returns {Map}
    */
    set: function (key, value) {
        this.table.set(key, value);
        this.size = this.table.count();
        return this;
    },

    /**
    * Returns a new Iterator object that contains the values for each element in the Map object in insertion order.
    * @returns {Iterator}
    */
    values: function () {
        return new MapIterator(this, function (key, value) {
            return value;
        });
    },

    /**
    * Creates an array from the Map.
    * @returns {Array}
    */
    toArray: function () {
        return this.table.entries(false);
    },

    toString: function () {
        return '[Map]';
    },

    /**
    * Returns a new Iterator object that contains an array of [key, value] for each element in the Map object in insertion order.
    * @returns {Iterator}
    */
    '@@iterator': function () {
        return new MapIterator(this);
    }
});




function MapIterator(map, selector) {
    IterableIterator.call(this, function () {
        return new HashTableIterator(map.table, selector);
    });
}

extend(MapIterator, IterableIterator, {
    toString: function () {
        return '[Map Iterator]';
    }
});

/**
* Initializes a new instance of the Set class that that is empty or contains elements copied from the specified iterable.
* @param {Iterable=} iterable An iterable object whose all of its elements will be added to the new Set.
* @param {EqualityComparer=} comparer An equality comparer to compare items.
*/
function Set(iterable, comparer) {
    var table = new HashTable(comparer);

    if (iterable) {
        forOf(iterable, function (element) {
            table.add(element, element);
        });
    }

    this.table = table;
    this.size = this.table.count();

    defineProperty(this, 'comparer', {
        get: function () {
            return table.comparer;
        }
    });
}

extend(Set, Collection, {
    /**
    * Appends a new element with the given value to the Set object. Returns the Set object.
    * @param {Object} value array The value of the element to add to the Set object.
    */
    add: function (value) {
        this.table.add(value, value);
        this.size = this.table.count();
        return this;
    },

    /**
    * Removes all elements from the Set object.
    */
    clear: function () {
        this.table.clear();
        this.size = 0;
    },

    /**
    * Returns the number of values in the Set object.
    * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
    */
    count: function (predicate) {
        return predicate ? iterableCount(this, predicate) : this.size;
    },

    /**
    * Removes the element associated to the value and returns the value that Set.prototype.has(value) would have previously returned.
    * @param {Object} value The element to delete from the Set.
    * @returns {Object}
    */
    delete: function (value) {
        var result = this.table.remove(value);
        this.size = this.table.count();
        return result ? value : false;
    },

    /**
    * Returns a new Iterator object that contains an array of [value, value] for each element in the Set object, in insertion order.
    * @returns {Iterator}
    */
    entries: function () {
        return new SetIterator(this);
    },

    /**
    * Calls callback once for each value present in the Set object, in insertion order.
    * @param {Function} callback The callback function.
    * @param {Object=} thisArg If a provided, it will be used as the this value for each callback.
    */
    forEach: function (callback, thisArg) {
        this.table.forEach(callback, this, thisArg);
    },

    /**
    * Returns a boolean asserting whether an element is present with the given value in the Set object or not.
    * @param {Object} value The value to test for presence in the Set object.
    * @returns {Boolean}
    */
    has: function (value) {
        return this.table.contains(value);
    },

    /**
    * Returns a new Iterator object that contains the values for each element in the Set object in insertion order.
    * @returns {Iterator}
    */
    keys: function () {
        return new SetIterator(this, function (key) {
            return key;
        });
    },

    /**
    * Returns a new Iterator object that contains the values for each element in the Set object in insertion order.
    * @returns {Iterator}
    */
    values: function () {
        return new SetIterator(this, function (key, value) {
            return value;
        });
    },

    /**
    * Creates an array from the Set.
    * @returns {Array}
    */
    toArray: function () {
        return this.table.entries(true);
    },

    toString: function () {
        return '[Set]';
    },

    /**
    * Returns a new Iterator object that contains the values for each element in the Set object in insertion order.
    * @returns {Iterator}
    */
    '@@iterator': function () {
        return this.keys();
    }
});



function SetIterator(set, selector) {
    IterableIterator.call(this, function () {
        return new HashTableIterator(set.table, selector);
    });
}

extend(SetIterator, IterableIterator, {
    toString: function () {
        return '[Set Iterator]';
    }
});

/**
* Initializes a new instance of the Queue class that that is empty or contains elements copied from the specified collection.
* @param {Iterable=} collection The collection to copy elements from.
*/
function Queue(collection) {
    var items = collection ? buffer(collection) : [];
    Collection.call(this, items);
}

extend(Queue, Collection, {
    /**
    * Removes all objects from the Stack.
    */
    clear: function () {
        this[iterableSymbol].length = 0;
    },

    /**
    * Determines whether an element is in the Stack.
    * @param {Object} item The object to locate in the Stack.
    * @returns {Boolean}
    */
    contains: function (item) {
        return this[iterableSymbol].indexOf(item) !== -1;
    },

    /**
    * Removes and returns the object at the beginning of the Queue.
    * @returns {Object}
    */
    dequeue: function () {
        if (this.count() > 0) {
            return this[iterableSymbol].shift();
        }

        error(ERROR_EMPTY_COLLECTION);
    },

    /**
    * Adds an object to the end of the Queue.
    * @param {Object} item The object to add to the Queue.
    */
    enqueue: function (item) {
        this[iterableSymbol].push(item);
    },

    /**
    * Returns the object at the beginning of the Queue without removing it.
    * @returns {Object}
    */
    peek: function () {
        var items = this[iterableSymbol];

        if (items.length > 0) {
            return items[0];
        }

        error(ERROR_EMPTY_COLLECTION);
    },

    toString: function () {
        return '[Queue]';
    }
});

/**
* Initializes a new instance of the Stack class that that is empty or contains elements copied from the specified collection.
* @param {Iterable=} collection The collection to copy elements from.
*/
function Stack(collection) {
    var items = collection ? buffer(collection) : [];
    Collection.call(this, items);
}

extend(Stack, Collection, {
    /**
    * Removes all objects from the Stack.
    */
    clear: function () {
        this[iterableSymbol].length = 0;
    },

    /**
    * Determines whether an element is in the Stack.
    * @param {Object} item The object to locate in the Stack.
    * @returns {Boolean}
    */
    contains: function (item) {
        return this[iterableSymbol].indexOf(item) !== -1;
    },

    /**
    * Returns the object at the top of the Stack without removing it.
    * @returns {Object}
    */
    peek: function () {
        var items = this[iterableSymbol];

        if (items.length > 0) {
            return items[items.length - 1];
        }

        error(ERROR_EMPTY_COLLECTION);
    },

    /**
    *   Removes and returns the object at the top of the Stack.
    *   @returns {Object}
    */
    pop: function () {
        if (this.count() > 0) {
            return this[iterableSymbol].pop();
        }

        error(ERROR_EMPTY_COLLECTION);
    },

    /**
    * Inserts an object at the top of the Stack.
    * @param {Object} item The object to push onto the Stack.
    */
    push: function (item) {
        this[iterableSymbol].push(item);
    },

    toString: function () {
        return '[Stack]';
    }
});

/**
 * Initializes a new instance of the SortedList class.
 * @param {Dictionary|Comparer|Number=} value The Dictionary whose elements are copied to the new SortedList, he Comparer implementation to use when comparing keys or The initial number of elements that the SortedList can contain.
 * @param {Comparer=} comparer The Comparer implementation to use when comparing keys.
 */
function SortedList(value, comparer) {
    var dic = isType(value, Dictionary) ? value : null,
        capacity = isNumber(value, Number) ? value : (dic ? dic.count() : 0);

    comparer = Comparer.from(comparer || value);
    this.slot = new SortedListSlot(capacity, dic ? dic.count() : 0, comparer);

    if (dic) {
        var arr = buffer(dic).sort(function (x, y) {
            return comparer.compare(x.key, y.key);
        });

        while (capacity-- > 0) {
            this.slot.keys[capacity] = arr[capacity].key;
            this.slot.values[capacity] = arr[capacity].value;
        }
    }
}


extend(SortedList, Collection, {
    /**
     * Adds an element with the specified key and value into the SortedList.
     * @param {Object} key The key of the element to add.
     * @param {Object} value The value of the element to add.
     */
    add: function (key, value) {
        assertNotNull(key);

        var index = binarySearch(this.slot.keys, 0, this.slot.size, key, this.slot.comparer.compare);

        if (index >= 0) {
            error(ERROR_DUPLICATE_KEY);
        }

        this.insert(~index, key, value);
    },

    /**
     * Gets or sets the number of elements that the SortedList can contain.
     * @param {Number} value The number of elements that the SortedList can contain.
     * @returns {Number}
     */
    capacity: function (value) {
        if (value === null || value === undefined) {
            return this.slot.keys.length;
        } else {
            assertType(value, Number);

            if (value !== this.slot.keys.length) {
                if (value < this.slot.size) {
                    error(ERROR_ARGUMENT_OUT_OF_RANGE);
                }

                this.slot.keys.length = value;
                this.slot.values.length = value;
            }
        }
    },


    /**
     * Removes all elements from the SortedList.
     */
    clear: function () {
        this.slot.keys.length = 0;
        this.slot.values.length = 0;
    },


    /**
     * Gets the Comparer for the sorted list.
     * @returns {Comparer}
     */
    comparer: function () {
        return this.slot.comparer;
    },


    /**
     * Determines whether the SortedList contains a specific key.
     * @param {Object} key The key to locate in the SortedList.
     * @returns {Boolean}
     */
    containsKey: function (key) {
        return this.indexOfKey(key) >= 0;
    },


    /**
     * Determines whether the SortedList contains a specific value.
     * @param {Object} value The value to locate in the SortedList.
     * @returns {Boolean}
     */
    containsValue: function (value) {
        return this.indexOfValue(value) >= 0;
    },

    /**
     * Gets the number of key/value pairs contained in the SortedList.
     * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
     * @returns {Number}
     */
    count: function (predicate) {
        return predicate ? iterableCount(this, predicate) : this.slot.size;
    },


    /**
     * Gets the value associated with the specified key.
     * @param {Object} key The key whose value to get.
     * @returns {Object}
     */
    get: function (key) {
        var index = this.indexOfKey(key);

        if (index >= 0) {
            return this.slot.values[index];
        }

        error(ERROR_KEY_NOT_FOUND);
    },


    /**
     * Gets a collection containing the keys in the SortedList, in sorted order.
     * @returns {Collection}
     */
    keys: function () {
        return this.slot.keys;
    },

    /**
     * Gets a collection containing the values in the SortedLis.
     * @returns {Collection}
     */
    values: function () {
        return this.slot.values;
    },


    /**
     * Searches for the specified key and returns the zero-based index within the entire SortedList.
     * @param {Object} key The key to locate in the SortedList.
     * @returns {Number}
     */
    indexOfKey: function (key) {
        assertNotNull(key);
        return binarySearch(this.slot.keys, 0, this.slot.size, key, this.slot.comparer.compare);
    },

    /**
     * Searches for the specified value and returns the zero-based index of the first occurrence within the entire SortedList.
     * @param {Object} value The value to locate in the SortedList.
     * @returns {Number}
     */
    indexOfValue: function (value) {
        return this.slot.values.indexOf(value);
    },

    /**
     * Removes the element with the specified key from the SortedList.
     * Returns true if the element is successfully removed; otherwise, false.This method also returns false if key was not found in the original SortedList.
     * @param { Object } key The key of the element to remove.
     * @returns { Boolean }
     */
    remove: function (key) {
        var index = this.indexOfKey(key);

        if (index >= 0) {
            this.removeAt(index);
            return true;
        }

        return false;
    },

    /**
     * Removes the element at the specified index of the SortedList.
     * @param {Number} index The zero-based index of the element to remove.
     */
    removeAt: function (index) {
        assertType(index, Number);

        if (index < 0 || index >= this.slot.size) {
            error(ERROR_ARGUMENT_OUT_OF_RANGE);
        }

        this.slot.size--;
        this.slot.keys.splice(index, 1);
        this.slot.values.splice(index, 1);
        this.slot.keys.length++;
        this.slot.values.length++;
    },

    /**
     * Sets the value associated with the specified key.
     * @param {Object} key The key whose value to get or set.
     * @param {Object} value The value associated with the specified key.
     */
    set: function (key, value) {
        var index = this.indexOfKey(key);

        if (index >= 0) {
            this.slot.values[index] = value;
            return;
        }

        this.insert(~index, key, value);
    },

    /**
     * Sets the capacity to the actual number of elements in the SortedList, if that number is less than 90 percent of current capacity.
     */
    trimExcess: function () {
        var threshold = this.slot.keys.length * 0.9;

        if (this.slot.size < threshold) {
            this.capacity(this.slot.size);
        }
    },

    /**
     * Gets the value associated with the specified key.
     * @param {Object} key The key whose value to get.
     * @param {Function} callback When this method returns, callback method is called with the value
     * associated with the specified key, if the key is found; otherwise, null for the type of the value parameter.
     * @returns {Boolean}
     */
    tryGetValue: function (key, callback) {
        assertType(callback, Function);

        var index = this.indexOfKey(key);

        if (index >= 0) {
            callback(this.slot.values[index]);
            return true;
        }

        return false;
    },


    insert: function (index, key, value) {
        var slot = this.slot;

        if (slot.size === slot.keys.length) {
            var newCapacity = slot.keys.length === 0 ? 4 : slot.keys.length * 2,
                max = Number.MAX_VALUE,
                min = slot.size + 1;

            if (newCapacity > max) {
                newCapacity = max;
            }

            if (newCapacity < min) {
                newCapacity = min;
            }

            this.capacity(newCapacity);
        }

        if (index < slot.size) {
            slot.keys.splice(index, 0, key);
            slot.values.splice(index, 0, value);
        }

        slot.size++;
        slot.keys[index] = key;
        slot.values[index] = value;
    },

    toString: function () {
        return '[SortedList]';
    },

    '@@iterator': function () {
        var keys = this.slot.keys,
            values = this.slot.values,
            size = this.slot.size,
            index = -1;

        return new Iterator(function () {
            while (++index < size) {
                return {
                    value: new KeyValuePair(keys[index], values[index]),
                    done: false
                };
            }

            return {
                done: true
            };
        });
    }
});



function SortedListSlot(capacity, size, comparer) {
    this.size = size;
    this.comparer = comparer;
    this.keys = new Array(capacity);
    this.values = new Array(capacity);
}

function OrderedIterable(source, keySelector, comparer, descending, parent) {
    assertNotNull(source);
    assertType(keySelector, Function);
    comparer = Comparer.from(comparer);

    var sorter = new OrderedIterableSorter(keySelector, comparer, descending);

    if (parent) {
        sorter = parent.sorter.create(sorter);
    }

    Iterable.call(this, source);
    this.sorter = sorter;
}


function OrderedIterableSorter(keySelector, comparer, descending, next) {
    this.keySelector = keySelector;
    this.comparer = comparer;
    this.descending = descending;
    this.next = next;
}


extend(OrderedIterable, Iterable, {
    /**
    * Performs a subsequent ordering of the elements in a sequence in ascending order by using a comparer.
    * @param {Function} keySelector A function to extract a key from each element. eg. function(item)
    * @param {Comparer=} comparer A Comparer to compare keys.
    * @returns {OrderedIterable}
    */
    thenBy: function (keySelector, comparer) {
        return new OrderedIterable(this[iterableSymbol], keySelector, comparer, false, this);
    },

    /**
    * Performs a subsequent ordering of the elements in a sequence in descending order by using a comparer.
    * @param {Function} keySelector A function to extract a key from each element. eg. function(item)
    * @param {Comparer=} comparer A Comparer to compare keys.
    * @returns {OrderedIterable}
    */
    thenByDescending: function (keySelector, comparer) {
        return new OrderedIterable(this[iterableSymbol], keySelector, comparer, true, this);
    },

    toString: function () {
        return '[Ordered Iterable]';
    },

    '@@iterator': function () {
        var index = 0,
            arr = buffer(this[iterableSymbol]),
            len = arr.length,
            map = this.sorter.sort(arr);

        return new Iterator(function () {
            if (index < len) {
                return {
                    value: arr[map[index++]],
                    done: false
                };
            }
            return {
                done: true
            };
        });
    }
});


mixin(OrderedIterableSorter.prototype, {
    create: function (next) {
        return new OrderedIterableSorter(
            this.keySelector,
            this.comparer,
            this.descending,
            this.next ? this.next.create(next) : next
        );
    },

    computeKeys: function (elements) {
        var count = elements.length,
            keys = new Array(count),
            selector = this.keySelector;

        for (var i = 0; i < count; i++) {
            keys[i] = selector(elements[i]);
        }

        if (this.next !== undefined) {
            this.next.computeKeys(elements, count);
        }

        this.keys = keys;
    },

    compareKeys: function (index1, index2) {
        var c = this.comparer.compare(this.keys[index1], this.keys[index2]);

        if (c === 0) {
            if (this.next === undefined) {
                return index1 - index2;
            }
            return this.next.compareKeys(index1, index2);
        }

        return this.descending ? -c : c;
    },

    sort: function (elements) {
        var count = elements.length,
            map = new Array(count);

        this.computeKeys(elements);

        for (var i = 0; i < count; i++) {
            map[i] = i;
        }

        this.quickSort(map, 0, count - 1);

        return map;
    },

    quickSort: function (map, left, right) {
        do {
            var i = left,
                j = right,
                x = map[i + ((j - i) >> 1)];

            do {
                while (i < map.length && this.compareKeys(x, map[i]) > 0) {
                    i++;
                }

                while (j >= 0 && this.compareKeys(x, map[j]) < 0) {
                    j--;
                }

                if (i > j) {
                    break;
                }

                if (i < j) {
                    var temp = map[i];
                    map[i] = map[j];
                    map[j] = temp;
                }
                i++;
                j--;
            } while (i <= j);

            if (j - left <= right - i) {
                if (left < j) {
                    this.quickSort(map, left, j);
                }

                left = i;
            }
            else {
                if (i < right) {
                    this.quickSort(map, i, right);
                }

                right = j;
            }
        } while (left < right);
    }
});

function rangeIterator(start, count) {
    assertType(start, Number);
    assertType(count, Number);

    var max = start + count - 1;

    if (count < 0 || max > Number.MAX_VALUE) {
        error(ERROR_ARGUMENT_OUT_OF_RANGE);
    }

    return new Iterable(function () {
        var index = -1;

        return new Iterator(function () {
            if (++index < count) {
                return {
                    value: start + index,
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}

function repeatIterator(element, count) {
    assertType(count, Number);

    if (count < 0) {
        error(ERROR_ARGUMENT_OUT_OF_RANGE);
    }

    return new Iterable(function () {
        var index = count;

        return new Iterator(function () {
            if (index-- > 0) {
                return {
                    value: element,
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}

function identityFunction(val) {
    return val;
}

function trueFunction() {
    return true;
}

function aggregateIterator(source, seed, func, resultSelector) {
    assertNotNull(source);
    assertType(func, Function);
    resultSelector = resultSelector || identityFunction;
    assertType(resultSelector, Function);

    var result = seed;

    forOf(source, function (element) {
        result = func(result, element);
    });

    return resultSelector(result);
}

function allIterator(source, predicate) {
    assertNotNull(source);
    assertType(predicate, Function);

    var result = true;

    forOf(source, function (element) {
        if (!predicate(element)) {
            result = false;
            return result;
        }
    });

    return result;
}

function anyIterator(source, predicate) {
    assertNotNull(source);
    predicate = predicate || trueFunction;
    assertType(predicate, Function);

    var result = false;

    forOf(source, function (element) {
        if (predicate(element)) {
            result = true;
            return result;
        }
    });

    return result;
}

function selectIterator(source, selector) {
    assertNotNull(source);
    assertType(selector, Function);

    return new Iterable(function () {
        var it = $iterator(source),
            index = 0,
            next;

        return new Iterator(function () {
            if (!(next = it.next()).done) {
                return {
                    value: selector(next.value, index++),
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}

function averageIterator(source, selector) {
    assertNotNull(source);

    if (selector) {
        return averageIterator(selectIterator(source, selector));
    }

    var sum = 0,
        count = 0;

    forOf(source, function (element) {
        sum += element;
        count++;
    });

    if (count === 0) {
        error(ERROR_NO_ELEMENTS);
    }

    if (isNaN(sum)) {
        error(ERROR_NON_NUMERIC_TYPE);
    }

    return sum / count;
}

function concatIterator(first, second) {
    assertNotNull(first);
    assertNotNull(second);

    return new Iterable(function () {
        var itFirst = $iterator(first),
            itSecond = $iterator(second),
            next;

        return new Iterator(function () {
            if (!(next = itFirst.next()).done || !(next = itSecond.next()).done) {
                return {
                    value: next.value,
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}

function containsIterator(source, value, comparer) {
    assertNotNull(source);
    comparer = EqualityComparer.from(comparer);

    var result = false;

    forOf(source, function (element) {
        if (comparer.equals(element, value)) {
            result = true;
            return result;
        }
    });

    return result;
}

function defaultIfEmptyIterator(source, defaultValue) {
    assertNotNull(source);

    return new Iterable(function () {
        var it = $iterator(source),
            next = it.next(),
            empty = next.done;

        return new Iterator(function () {
            if (!next.done) {
                var result = {
                    value: next.value,
                    done: false
                };

                next = it.next();
                return result;
            }
            else if (empty) {
                empty = false;
                return {
                    value: defaultValue,
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}

function distinctIterator(source, comparer) {
    assertNotNull(source);

    return new Iterable(function () {
        var it = $iterator(source),
            table = new HashTable(comparer),
            next;

        return new Iterator(function () {
            if (!(next = it.next()).done) {
                if (table.add(next.value)) {
                    return {
                        value: next.value,
                        done: false
                    };
                }
            }
            return {
                done: true
            };
        });
    });
}

function elementAtIterator(source, index) {
    assertNotNull(source);
    assertType(index, Number);

    if (index < 0) {
        error(ERROR_ARGUMENT_OUT_OF_RANGE);
    }

    var arr = asArray(source);

    // fast find for array-like objects
    if (arr !== null) {
        if (index < arr.length) {
            return arr[index];
        }
    }

    else {
        var it = $iterator(source),
            next;

        while (!(next = it.next()).done) {
            if (index-- === 0) {
                return next.value;
            }
        }
    }

    error(ERROR_ARGUMENT_OUT_OF_RANGE);
}

function exceptIntersectIterator(first, second, comparer, intersect) {
    assertNotNull(first);
    assertNotNull(second);

    var result = intersect ? true : false;

    return new Iterable(function () {
        var it = $iterator(first),
            table = new HashTable(comparer),
            next;

        return new Iterator(function () {
            forOf(second, function (element) {
                table.add(element);
            });

            while (!(next = it.next()).done) {
                if (table.contains(next.value) === result) {
                    return {
                        value: next.value,
                        done: false
                    };
                }
            }
            return {
                done: true
            };
        });
    });
}

function firstOrDefaultIterator(source, predicate, defaultValue) {
    assertNotNull(source);
    predicate = predicate || trueFunction;
    assertType(predicate, Function);

    var arr = asArray(source),
        result = defaultValue === undefined ? null : defaultValue;

    if (arr !== null) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (predicate(arr[i])) {
                return arr[i];
            }
        }
    }
    else {
        forOf(source, function (element) {
            if (predicate(element)) {
                result = element;
                return true;
            }
        });
    }

    return result;
}

function firstIterator(source, predicate) {
    var value = {},
        result = firstOrDefaultIterator(source, predicate, value);

    if (result === value) {
        error(predicate ? ERROR_NO_MATCH : ERROR_NO_ELEMENTS);
    }

    return result;
}

function forEachIterator(source, action, thisArg) {
    assertNotNull(source);
    assertType(action, Function);

    var index = 0;

    forOf(source, function (element) {
        if (thisArg) {
            action.call(thisArg, element, index++);
        }
        else {
            action(element, index++);
        }
    });
}

function groupIterator(source, keySelector, elementSelector, resultSelector, comparer) {
    assertNotNull(source);
    assertType(keySelector, Function);

    return new Iterable(function () {
        var lookup = new Lookup(source, keySelector, elementSelector, comparer),
            it = $iterator(lookup),
            next;

        return new Iterator(function () {
            if (!(next = it.next()).done) {
                return {
                    value: resultSelector ? resultSelector(next.value.key, new Iterable(next.value.elements)) : next.value,
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}

function groupJoinIterator(outer, inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
    assertNotNull(inner);
    assertType(outerKeySelector, Function);
    assertType(innerKeySelector, Function);
    assertType(resultSelector, Function);

    return new Iterable(function () {
        var lookup = new Lookup(inner, innerKeySelector, null, comparer),
            it = $iterator(outer),
            next;

        return new Iterator(function () {
            while (!(next = it.next()).done) {
                return {
                    value: resultSelector(next.value, lookup.get(outerKeySelector(next.value))),
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}

function joinIterator(outer, inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
    assertNotNull(inner);
    assertType(outerKeySelector, Function);
    assertType(innerKeySelector, Function);
    assertType(resultSelector, Function);

    return new Iterable(function () {
        var lookup = new Lookup(inner, innerKeySelector, null, comparer),
            it = $iterator(outer),
            elements = null,
            index = 0,
            next;

        return new Iterator(function () {
            while (index !== 0 || !(next = it.next()).done) {
                if (elements === null) {
                    elements = lookup.get(outerKeySelector(next.value)).elements;
                }
                if (index < elements.length) {
                    return {
                        value: resultSelector(next.value, elements[index++]),
                        done: false
                    };
                }
                else {
                    index = 0;
                    elements = null;
                }
            }

            return {
                done: true
            };
        });
    });
}

function lastOrDefaultIterator(source, predicate, defaultValue) {
    assertNotNull(source);
    predicate = predicate || trueFunction;
    assertType(predicate, Function);

    var arr = asArray(source),
        result = defaultValue === undefined ? null : defaultValue;

    // fast iteration for array-like iterables
    if (arr !== null) {
        var len = arr.length;

        while (len-- > 0) {
            if (predicate(arr[len])) {
                return arr[len];
            }
        }
    }
    else {
        forOf(source, function (element) {
            if (predicate(element)) {
                result = element;
            }
        });
    }

    return result;
}

function lastIterator(source, predicate) {
    var value = {},
        result = lastOrDefaultIterator(source, predicate, value);

    if (result === value) {
        error(predicate ? ERROR_NO_MATCH : ERROR_NO_ELEMENTS);
    }

    return result;
}

function minMaxIterator(source, max, selector) {
    assertNotNull(source);

    if (selector) {
        assertType(selector, Function);
        return minMaxIterator(selectIterator(source, selector), max);
    }

    var arr = asArray(source),
        result = max ? 1 : -1,
        hasValue = false,
        value;

    // fast iteration for array-like iterables
    if (arr !== null) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (hasValue) {
                if (compare(arr[i], value) === result) {
                    value = arr[i];
                }
            }
            else {
                value = arr[i];
                hasValue = true;
            }
        }
    }
    else {
        forOf(source, function (element) {
            if (hasValue) {
                if (compare(element, value) === result) {
                    value = element;
                }
            }
            else {
                value = element;
                hasValue = true;
            }
        });
    }

    if (!hasValue) {
        error(ERROR_NO_ELEMENTS);
    }

    return value;
}

function ofTypeIterator(source, type) {
    assertNotNull(source);
    assertType(type, Function);

    return new Iterable(function () {
        var it = $iterator(source),
            next;

        return new Iterator(function () {
            if (!(next = it.next()).done) {
                if (isType(next.value, type)) {
                    return {
                        value: next.value,
                        done: false
                    };
                }
            }
            return {
                done: true
            };
        });
    });
}

function reverseIterator(source) {
    assertNotNull(source);

    return new Iterable(function () {
        var arr = asArray(source) || buffer(source),
            len = arr.length;

        return new Iterator(function () {
            if (len-- > 0) {
                return {
                    value: arr[len],
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}

function selectManyIterator(source, collectionSelector, resultSelector) {
    assertNotNull(source);
    assertType(collectionSelector, Function);
    if (resultSelector) {
        assertType(resultSelector, Function);
    }

    return new Iterable(function () {
        var it = $iterator(source),
            next = it.next(),
            itcol,
            nextcol,
            index = 0;

        return new Iterator(function () {
            if (!next.done) {
                do {
                    itcol = itcol || $iterator(collectionSelector(next.value, index++));

                    while (!(nextcol = itcol.next()).done) {
                        return {
                            value: resultSelector ? resultSelector(next.value, nextcol.value) : nextcol.value,
                            done: false
                        };
                    }

                    itcol = null;
                }
                while (!(next = it.next()).done);
            }

            return {
                done: true
            };
        });
    });
}

function sequenceEqualIterator(first, second, comparer) {
    assertNotNull(first);
    assertNotNull(second);
    comparer = EqualityComparer.from(comparer);

    var it1 = $iterator(first),
        it2 = $iterator(second),
        next1,
        next2;

    while (!(next1 = it1.next()).done) {
        if ((next2 = it2.next()).done || !comparer.equals(next1.value, next2.value)) {
            return false;
        }
    }

    if (!it2.next().done) {
        return false;
    }

    return true;
}

function singleOrDefaultIterator(source, predicate, defaultValue) {
    assertNotNull(source);
    predicate = predicate || trueFunction;
    assertType(predicate, Function);

    var arr = asArray(source),
        result = defaultValue === undefined ? null : defaultValue,
        count = 0;

    // fast iteration for array-like iterables
    if (arr !== null) {
        for (var i = 0, len = arr.length; i < len && count <= 1; i++) {
            if (predicate(arr[i])) {
                result = arr[i];
                count++;
            }
        }
    }
    else {
        forOf(source, function (element) {
            if (predicate(element)) {
                if (count > 1) {
                    return false;
                }

                result = element;
                count++;
            }
        });
    }

    if (count < 2) {
        return result;
    }

    error(ERROR_MORE_THAN_ONE_ELEMENT);
}

function singleIterator(source, predicate) {
    var value = {},
        result = singleOrDefaultIterator(source, predicate, value);

    if (result === value) {
        error(predicate ? ERROR_NO_MATCH : ERROR_NO_ELEMENTS);
    }

    return result;
}

function skipIterator(source, count) {
    assertNotNull(source);
    assertType(count, Number);
    count = Math.max(count, 0);

    var arr = asArray(source);

    if (arr !== null) {
        return new Iterable(buffer(arr).slice(count));
    }

    return new Iterable(function () {
        var it = $iterator(source),
            next;

        return new Iterator(function () {
            while (count > 0 && !it.next().done) {
                count--;
            }
            if (count <= 0) {
                while (!(next = it.next()).done) {
                    return {
                        value: next.value,
                        done: false
                    };
                }
            }
            return {
                done: true
            };
        });
    });
}

function skipWhileIterator(source, predicate) {
    assertNotNull(source);
    assertType(predicate, Function);

    return new Iterable(function () {
        var it = $iterator(source),
            yielding = false,
            index = 0,
            next;

        return new Iterator(function () {
            while (!(next = it.next()).done) {
                if (!yielding && !predicate(next.value, index++)) {
                    yielding = true;
                }

                if (yielding) {
                    return {
                        value: next.value,
                        done: false
                    };
                }
            }
            return {
                done: true
            };
        });
    });
}

function sumIterator(source, selector) {
    assertNotNull(source);

    if (selector) {
        assertType(selector, Function);
        return sumIterator(selectIterator(source, selector));
    }

    var arr = asArray(source),
        sum = 0;

    // fast iteration for array-like iterables
    if (arr !== null) {
        for (var i = 0, len = arr.length; i < len; i++) {
            sum += arr[i];
        }
    }
    else {
        forOf(source, function (element) {
            sum += element;
        });
    }

    if (isNaN(sum)) {
        error(ERROR_NON_NUMERIC_TYPE);
    }

    return sum;
}

function takeIterator(source, count) {
    assertNotNull(source);
    assertType(count, Number);
    count = Math.max(count, 0);

    var arr = asArray(source);

    if (arr !== null) {
        return new Iterable(buffer(arr).slice(0, count));
    }

    return new Iterable(function () {
        var it = $iterator(source),
            next;

        return new Iterator(function () {
            if (!(next = it.next()).done && count-- > 0) {
                return {
                    value: next.value,
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}

function takeWhileIterator(source, predicate) {
    assertNotNull(source);
    assertType(predicate, Function);

    return new Iterable(function () {
        var it = $iterator(source),
            index = 0,
            next;

        return new Iterator(function () {
            while (!(next = it.next()).done && predicate(next.value, index++)) {
                return {
                    value: next.value,
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}

function toDictionary(source, keySelector, valueSelector, comparer) {
    assertNotNull(source);
    assertType(keySelector, Function);

    if (valueSelector) {
        assertType(valueSelector, Function);
    }

    var dic = new Dictionary(EqualityComparer.from(comparer));

    forOf(source, function (element) {
        dic.add(keySelector(element), valueSelector ? valueSelector(element) : element);
    });

    return dic;
}

function unionIterator(first, second, comparer) {
    assertNotNull(first);
    assertNotNull(second);

    return new Iterable(function () {
        var table = new HashTable(comparer),
            it1 = $iterator(first),
            it2 = $iterator(second),
            next;

        return new Iterator(function () {
            while (!(next = it1.next()).done || !(next = it2.next()).done) {
                if (table.add(next.value)) {
                    return {
                        value: next.value,
                        done: false
                    };
                }
            }

            return {
                done: true
            };
        });
    });
}

function whereIterator(source, predicate) {
    assertNotNull(source);
    assertType(predicate, Function);

    return new Iterable(function () {
        var it = $iterator(source),
            index = 0,
            next;

        return new Iterator(function () {
            while (!(next = it.next()).done) {
                if (predicate(next.value, index++)) {
                    return {
                        value: next.value,
                        done: false
                    };
                }
            }
            return {
                done: true
            };
        });
    });
}

function zipIterator(first, second, resultSelector) {
    assertNotNull(first);
    assertNotNull(second);
    assertType(resultSelector, Function);

    return new Iterable(function () {
        var it1 = $iterator(first),
            it2 = $iterator(second),
            next1,
            next2;

        return new Iterator(function () {
            if (!(next1 = it1.next()).done && !(next2 = it2.next()).done) {
                return {
                    value: resultSelector(next1.value, next2.value),
                    done: false
                };
            }
            return {
                done: true
            };
        });
    });
}

function linq(iterable) {
    mixin(iterable, {

        /**
        * Returns an empty Iterable.
        * @returns {Iterable}
        */
        empty: function () {
            return new EmptyIterable();
        },

        /**
        * Generates a sequence of integral numbers within a specified range.
        * @param {Number} start The value of the first integer in the sequence.
        * @param {Number} count The number of sequential integers to generate.
        * @returns {Iterable}
        */
        range: rangeIterator,

        /**
        * Generates a sequence that contains one repeated value.
        * @param {Object} element The value to be repeated.
        * @param {Number} count The number of times to repeat the value in the generated sequence.
        * @returns {Iterable}
        */
        repeat: repeatIterator
    });

    mixin(iterable.prototype, {

        /**
        * Applies an accumulator function over a sequence.
        * @param {Object} seed The initial accumulator value.
        * @param {Function} func An accumulator function to be invoked on each element. eg. function(accumulate, item)
        * @param {Function} resultSelector A function to transform the final accumulator value into the result value. eg. function(accumulate)
        * @returns {Object}
        */
        aggregate: function (seed, func, resultSelector) {
            return aggregateIterator(this, seed, func, resultSelector);
        },

        /**
        * Determines whether all elements of a sequence satisfy a condition.
        * Returns true if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
        * @param {Function} predicate A function to test each element for a condition. eg. function(item).
        * @returns {Boolean}
        */
        all: function (predicate) {
            return allIterator(this, predicate);
        },

        /**
        * Determines whether a sequence contains any elements.
        * Returns true if any elements in the source sequence contains any elements or pass the test in the specified predicate; otherwise, false.
        * @param {Function=} predicate A function to test each element for a condition. eg. function(item).
        * @returns {Boolean}
        */
        any: function (predicate) {
            return anyIterator(this, predicate);
        },

        /**
        * Computes the average of a sequence of numeric values.
        * @param {Function=} selector A transform function to apply to each element. eg.function(item).
        * @returns {Number}
        */
        average: function (selector) {
            return averageIterator(this, selector);
        },

        /**
        * Concatenates two sequences.
        * @param {Iterable} second The sequence to concatenate to current sequence.
        * @returns {Iterable}
        */
        concat: function (second) {
            return concatIterator(this, second);
        },

        /**
        * Determines whether a sequence contains a specified element by using an equality comparer.
        * @param {Object} value The value to locate in the sequence.
        * @param {EqualityComparer=} comparer An equality comparer to compare values.
        * @returns {Boolean}
        */
        contains: function (value, comparer) {
            return containsIterator(this, value, comparer);
        },

        /**
        * Returns the number of elements in a sequence.
        * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
        * @returns {Number}
        */
        count: function (predicate) {
            return iterableCount(this, predicate);
        },

        /**
        * Returns the elements of the specified sequence or the specified value in a collection if the sequence is empty.
        * @param {Object=} defaultValue The value to return if the sequence is empty.
        * @returns {Iterable}
        */
        defaultIfEmpty: function (defaultValue) {
            return defaultIfEmptyIterator(this, defaultValue);
        },

        /**
        * Produces the set difference of two sequences by using the EqualityComparer to compare values.
        * @param {EqualityComparer=} comparer An EqualityComparer to compare values.
        * @returns {Iterable}
        */
        distinct: function (comparer) {
            return distinctIterator(this, comparer);
        },

        /**
        * Returns the element at a specified index in a sequence. Throws an error if the index is less than 0 or greater than or equal to the number of elements in source.
        * @param {Number} index The zero-based index of the element to retrieve.
        * @returns {Object}
        */
        elementAt: function (index) {
            return elementAtIterator(this, index);
        },

        /**
        * Produces the set difference of two sequences by using the specified EqualityComparer to compare values.
        * @param {Iterable} second An Iterable whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
        * @param {EqualityComparer=} comparer An EqualityComparer to compare values.
        * @returns {Iterable}
        */
        except: function (second, comparer) {
            return exceptIntersectIterator(this, second, comparer, false);
        },

        /**
        * Returns the first element in a sequence that satisfies a specified condition. this method throws an exception if there is no element in the sequence.
        * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
        * @returns {Object}
        */
        first: function (predicate) {
            return firstIterator(this, predicate);
        },

        /**
        * Returns the first element of the sequence that satisfies a condition or a default value if no such element is found.
        * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
        * @param {Object=} defaultValue The value to return if no element exists with specified condition.
        * @returns {Object}
        */
        firstOrDefault: function (predicate, defaultValue) {
            return firstOrDefaultIterator(this, predicate, defaultValue);
        },

        /**
        * Performs the specified action on each element of an Iterable.
        * @param {Function} action The action function to perform on each element of an Iterable. eg. function(item, index)
        * @param {Object=} thisArg Value to use as this when executing callback.
        */
        forEach: function (action, thisArg) {
            return forEachIterator(this, action, thisArg);
        },

        /**
        * Groups the elements of a sequence according to a key selector function.
        * @param {Function} keySelector A function to extract the key for each element. eg. function(item)
        * @param {Function|EqualityComparer=} elementSelectorOrComparer A function to map each source element to an element in the Grouping. eg. function(item) or an equality comparer
        * @param {Function|EqualityComparer=} resultSelectorOrComparer A function to extract the key for each element. eg. function(item) or an equality comparer
        * @param {EqualityComparer=} comparer An equality comparer to compare values.
        * @returns {Iterable}
        */
        groupBy: function (keySelector, elementSelectorOrComparer, resultSelectorOrComparer, comparer) {
            var args = arguments.length,
                elementSelector = isFunction(elementSelectorOrComparer) ? elementSelectorOrComparer : null,
                resultSelector = isFunction(resultSelectorOrComparer) ? resultSelectorOrComparer : null;

            comparer = args === 3 && elementSelector === null ? elementSelectorOrComparer :
                (args === 4 && resultSelector === null ? resultSelectorOrComparer : comparer);

            return groupIterator(this, keySelector, elementSelector, resultSelector, comparer);
        },

        /**
        * Correlates the elements of two sequences based on key equality and groups the results. A specified EqualityComparer is used to compare keys.
        * @param {Iterable} inner The sequence to join to the current sequence.
        * @param {Function} outerKeySelector A function to extract the join key from each element of the first sequence. eg. function(outer)
        * @param {Function} innerKeySelector A function to extract the join key from each element of the second sequence. function(inner)
        * @param {Function} resultSelector A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence. eg. function(outer, inner)
        * @param {EqualityComparer=} comparer An equality comparer to compare values.
        * @returns {Iterable}
        */
        groupJoin: function (inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
            return groupJoinIterator(this, inner, outerKeySelector, innerKeySelector, resultSelector, comparer);
        },

        /**
        * Produces the set intersection of two sequences by using the default equality comparer to compare values.
        * @param {Iterable} second An Iterable whose distinct elements that also appear in the first sequence will be returned.
        * @param {EqualityComparer=} comparer An EqualityComparer to compare values.
        * @returns {Iterable}
        */
        intersect: function (second, comparer) {
            return exceptIntersectIterator(this, second, comparer, true);
        },

        /**
        * Correlates the elements of two sequences based on matching keys. A specified EqualityComparer is used to compare keys.
        * @param {Iterable} inner The sequence to join to the current sequence.
        * @param {Function} outerKeySelector A function to extract the join key from each element of the first sequence. eg. function(outer)
        * @param {Function} innerKeySelector A function to extract the join key from each element of the second sequence. function(inner)
        * @param {Function} resultSelector A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence. eg. function(outer, inner)
        * @param {EqualityComparer=} comparer An equality comparer to compare values.
        * @returns {Iterable}
        */
        join: function (inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
            return joinIterator(this, inner, outerKeySelector, innerKeySelector, resultSelector, comparer);
        },

        /**
        * Returns the last element of a sequence that satisfies a specified condition.
        * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
        * @returns {Object}
        */
        last: function (predicate) {
            return lastIterator(this, predicate);
        },

        /**
        * Returns the last element of a sequence that satisfies a condition or a default value if no such element is found.
        * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
        * @param {Object=} defaultValue The value to return if no element exists with specified condition.
        * @returns {Object}
        */
        lastOrDefault: function (predicate, defaultValue) {
            return lastOrDefaultIterator(this, predicate, defaultValue);
        },

        /**
        * Invokes a transform function on each element of a sequence and returns the maximum value.
        * @param {Function=} selector A transform function to apply to each element. eg. function(item)
        * @returns {Object}
        */
        max: function (selector) {
            return minMaxIterator(this, true, selector);
        },

        /**
        * Invokes a transform function on each element of a sequence and returns the minimum value.
        * @param {Function=} selector A transform function to apply to each element. eg. function(item)
        * @returns {Object}
        */
        min: function (selector) {
            return minMaxIterator(this, false, selector);
        },

        /**
        * Filters the elements of an Iterable based on a specified type.
        * @param {Function} type The type to filter the elements of the sequence on.
        * @returns {Iterable}
        */
        ofType: function (type) {
            return ofTypeIterator(this, type);
        },

        /**
        * Sorts the elements of a sequence in ascending order by using a specified comparer.
        * @param {Function} keySelector A function to extract a key from each element. eg. function(item)
        * @param {Comparer=} comparer A Comparer to compare keys.
        * @returns {OrderedIterable}
        */
        orderBy: function (keySelector, comparer) {
            return new OrderedIterable(this, keySelector, comparer, false);
        },

        /**
        * Sorts the elements of a sequence in descending order by using a specified comparer.
        * @param {Function} keySelector A function to extract a key from each element. eg. function(item)
        * @param {Comparer=} comparer A Comparer to compare keys.
        * @returns {OrderedIterable}
        */
        orderByDescending: function (keySelector, comparer) {
            return new OrderedIterable(this, keySelector, comparer, true);
        },

        /**
        * Inverts the order of the elements in a sequence.
        * @returns {Iterable}
        */
        reverse: function () {
            return reverseIterator(this);
        },

        /**
        * Projects each element of a sequence into a new form.
        * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element. eg. function(item, index)
        * @returns {Iterable}
        */
        select: function (selector) {
            return selectIterator(this, selector);
        },

        /**
        * Projects each element of a sequence to an Iterable and flattens the resulting sequences into one sequence.
        * @param {Function} collectionSelector A transform function to apply to each source element; the second parameter of the function represents the index of the source element. eg. function(item, index)
        * @param {Function=} resultSelector A transform function to apply to each element of the intermediate sequence. eg. function(item, collection)
        * @returns {Iterable}
        */
        selectMany: function (collectionSelector, resultSelector) {
            return selectManyIterator(this, collectionSelector, resultSelector);
        },

        /**
        * Determines whether two sequences are equal by comparing their elements by using an EqualityComparer.
        * @param {Iterable} second An Iterable to compare to the first sequence.
        * @param {EqualityComparer=} comparer The EqualityComparer to compare values.
        * @returns {Boolean}
        */
        sequenceEqual: function (second, comparer) {
            return sequenceEqualIterator(this, second, comparer);
        },

        /**
        * Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.
        * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
        * @returns {Object}
        */
        single: function (predicate) {
            return singleIterator(this, predicate);
        },

        /**
        * Returns the only element of a sequence that satisfies a specified condition or a default value if no such element exists; this method throws an exception if more than one element satisfies the condition.
        * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
        * @param {Object=} defaultValue The value to return if no element exists with specified condition.
        * @returns {Object}
        */
        singleOrDefault: function (predicate, defaultValue) {
            return singleOrDefaultIterator(this, predicate, defaultValue);
        },

        /**
        * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
        * @param {Number} count The number of elements to skip before returning the remaining elements.
        * @returns {Iterable}
        */
        skip: function (count) {
            return skipIterator(this, count);
        },

        /**
        * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements. The element's index is used in the logic of the predicate function.
        * @param {Function=} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element. eg. function(item, index)
        * @returns {Iterable}
        */
        skipWhile: function (predicate) {
            return skipWhileIterator(this, predicate);
        },

        /**
        * Computes the sum of the sequence of values that are obtained by invoking a transform function on each element of the input sequence.
        * @param {Function=} selector A transform function to apply to each element. eg. function(item)
        * @returns {Number}
        */
        sum: function (selector) {
            return sumIterator(this, selector);
        },

        /**
        * Returns a specified number of contiguous elements from the start of a sequence.
        * @param {Number} count The number of elements to return.
        * @returns {Iterable}
        */
        take: function (count) {
            return takeIterator(this, count);
        },

        /**
        * Returns elements from a sequence as long as a specified condition is true. The element's index is used in the logic of the predicate function.
        * @param {Function=} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element. eg. Function(item, index)
        * @returns {Iterable}
        */
        takeWhile: function (predicate) {
            return takeWhileIterator(this, predicate);
        },

        /**
        * Creates a Dictionary from an Iterable according to a specified key selector function, a comparer, and an element selector function.
        * @param {Function} keySelector A function to extract a key from each element. eg. function(item)
        * @param {Function=} valueSelector A transform function to produce a result element value from each element. eg. function(item)
        * @param {EqualityComparer=} comparer An equality comparer to compare values.
        * @returns {Dictionary}
        */
        toDictionary: function (keySelector, valueSelector, comparer) {
            return toDictionary(this, keySelector, valueSelector, comparer);
        },

        /**
        * Creates an array from an Iterable.
        * @returns {Array}
        */
        toArray: function () {
            return buffer(this);
        },

        /**
        * Creates a List from an Iterable.
        * @returns {List}
        */
        toList: function () {
            return new List(this);
        },

        /**
        * Creates a Lookup from an Iterable according to a specified key selector function, a comparer and an element selector function.
        * @param {Function} keySelector A function to extract a key from each element. eg. function(item)
        * @param {Function=} valueSelector A transform function to produce a result element value from each element. eg. function(item)
        * @param {EqualityComparer=} comparer An equality comparer to compare values.
        * @returns {Lookup}
        */
        toLookup: function (keySelector, valueSelector, comparer) {
            return new Lookup(this, keySelector, valueSelector, comparer);
        },

        /**
        * Produces the set union of two sequences by using a specified EqualityComparer.
        * @param {Iterable} second An Iterable whose distinct elements form the second set for the union.
        * @param {EqualityComparer=} comparer The EqualityComparer to compare values.
        * @returns {Iterable}
        */
        union: function (second, comparer) {
            return unionIterator(this, second, comparer);
        },

        /**
         * Filters a sequence of values based on a predicate. Each element's index is used in the logic of the predicate function.
         * @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element. eg. function(item, index)
         * @returns {Iterable}
         */
        where: function (predicate) {
            return whereIterator(this, predicate);
        },

        /**
        * Merges two sequences by using the specified predicate function.
        * @param {Iterable} second The second sequence to merge.
        * @param {Function} resultSelector A function that specifies how to merge the elements from the two sequences. eg. function(first, second)
        * @returns {Iterable}
        */
        zip: function (second, resultSelector) {
            return zipIterator(this, second, resultSelector);
        }
    });
}

linq(Iterable);


/**
* Creates a new Iterable instance.
* @param {Iterable|Array|String|Function|Function*|Object} value An Iterable object.
* @returns {Iterable}
*/
function mx(value) {
    return $iterable(value);
}



mx.runtime = runtime;
mx.hash = runtimeHash;
mx.equals = runtimeEquals;
mx.compare = compare;

mx.empty = Iterable.empty;
mx.range = Iterable.range;
mx.repeat = Iterable.repeat;
mx.iter = $iterator;

mx.Iterable = Iterable;
mx.Iterator = Iterator;
mx.Comparer = Comparer;
mx.EqualityComparer = EqualityComparer;
mx.Collection = Collection;
mx.ReadOnlyCollection = ReadOnlyCollection;
mx.Dictionary = Dictionary;
mx.KeyValuePair = KeyValuePair;
mx.List = List;
mx.LinkedList = LinkedList;
mx.LinkedListNode = LinkedListNode;
mx.Lookup = Lookup;
mx.HashSet = HashSet;
mx.Map = Map;
mx.Set = Set;
mx.Queue = Queue;
mx.Stack = Stack;
mx.SortedList = SortedList;

return mx;

})));

