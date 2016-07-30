/*!
* Multiplex.js - Comprehensive data-structure and LINQ library for JavaScript.
* Version 2.0.0 (July 30, 2016)

* Created and maintained by Kamyar Nazeri <Kamyar.Nazeri@yahoo.com>
* Licensed under MIT License
* https://github.com/multiplex/multiplex.js
*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.mx = factory());
}(this, function () { 'use strict';

    function isObject(obj) {
        return typeof obj === 'object';
    }

    function isFunction(fn) {
        return typeof fn === 'function';
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
            typeof obj === 'object' &&                      // array-likes are objects
            typeof obj.length === 'number') {               // array-likes have 'length' property

            if (typeof obj.splice === 'function' ||             // third party libraries. eg. jQuery
                toString(obj) === '[object Arguments]') {       // arguments object
                return true;
            }

            else {
                let len = obj.length;
                if (len > 0 &&                                  // length property must be > 0
                    len % 1 === 0 &&                            // length property must be integer
                    obj[len - 1] !== undefined) {               // at least one index is being checked)
                    return true;
                }
            }
        }

        return false;
    }

    function error(msg) {
        throw new Error(msg);
    }

    const ERROR_ARGUMENT_OUT_OF_RANGE = 'Argument was out of the range of valid values.';
    const ERROR_ARRAY_SIZE = 'The number of elements in the source is greater than the number of elements that the destination array can contain.';
    const ERROR_NO_ELEMENTS = 'Sequence contains no elements.';
    const ERROR_NON_NUMERIC_TYPE = 'Value is not a number.';

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
    class Iterator {
        constructor(factory) {
            assertType(factory, Function);
            this.next = factory;
        }

        get [Symbol.toStringTag]() {
            return 'Iterator';
        }

        toString() {
            return '[Iterator]';
        }
    }

    /**
    * Supports an iteration over an Array or Array-Like object.
    * @param {Array|String|Array-like} arr An array or array-like object.
    */
    class ArrayIterator extends Iterator {
        constructor(arr) {
            let index = -1,
                length = arr.length;

            super(() => {
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

        get [Symbol.toStringTag]() {
            return 'Array Iterator';
        }

        toString() {
            return '[Array Iterator]';
        }
    }

    /**
    * Supports an iteration over Object properties.
    * @param {Object} obj An object instance.
    */
    class ObjectIterator extends Iterator {
        constructor(obj) {
            let index = -1,
                keys = Object.keys(obj),
                length = keys.length;

            // [key, value] iterator
            super(() => {
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

        get [Symbol.toStringTag]() {
            return 'Object Iterator';
        }

        toString() {
            return '[Object Iterator]';
        }
    }

    /**
    * Supports an iteration over an empty Iterable.
    */
    class EmptyIterator extends Iterator {
        constructor() {
            super(() => ({ done: true }));
        }

        get [Symbol.toStringTag]() {
            return 'Empty Iterator';
        }

        toString() {
            return '[Empty Iterator]';
        }
    }

    /**
    * Creates an iterator object
    * @param {Object} obj An object to create iterator from.
    */
    function iterator(obj) {
        // empty iteration
        if (obj === null || obj === undefined) {
            return new EmptyIterator();
        }


        // iterable/generator function
        else if (isFunction(obj)) {
            return obj();
        }

        // iterable: Array, String, Map, Set, NodeList, Arguments, Iterable objects
        else if (isFunction(obj[Symbol.iterator])) {
            return obj[Symbol.iterator]();
        }


        // array-like objects
        else if (isArrayLike(obj)) {
            return new ArrayIterator(obj);
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

    /**
    * Defines abstract Iterable class.
    * @param {Iterable|Array|String|Function|Function*|Object} source An Iterable object.
    */
    class Iterable {
        constructor(source = null) {
            if (source !== null && source !== undefined) {
                this._source = source;
            }
        }

        [Symbol.iterator]() {
            return iterator(this._source);
        }

        get [Symbol.toStringTag]() {
            return 'Iterable';
        }

        toString() {
            return '[Iterable]';
        }

        valueOf() {
            return this._source;
        }
    }

    /**
    * Creates a new ArrayIterable instance.
    * @param {Array|String|Array-like} value An array-like object.
    */
    class ArrayIterable extends Iterable {
        constructor(value) {
            super(value);
        }

        [Symbol.iterator]() {
            let arr = this.valueOf();
            return isFunction(arr[Symbol.iterator]) ? arr[Symbol.iterator]() : new ArrayIterator(arr);
        }

        get [Symbol.toStringTag]() {
            return 'Array Iterable';
        }

        toString() {
            return '[Array Iterable]';
        }
    }

    /**
    * Creates a new ObjectIterable instance.
    * @param {Object} value An object instance.
    */
    class ObjectIterable extends Iterable {
        constructor(value) {
            super(value);
        }

        [Symbol.iterator]() {
            return new ObjectIterator(this.valueOf());
        }

        get [Symbol.toStringTag]() {
            return 'Object Iterable';
        }

        toString() {
            return '[Object Iterable]';
        }
    }

    /**
    * Creates a new EmptyIterable instance.
    */
    class EmptyIterable extends Iterable {
        constructor() {
            super();
        }

        [Symbol.iterator]() {
            return new EmptyIterator();
        }

        get [Symbol.toStringTag]() {
            return 'Empty Iterable';
        }

        toString() {
            return '[Empty Iterable]';
        }
    }

    function iterable(value) {
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

        else if (isFunction(value[Symbol.iterator])) {
            return new Iterable(value);
        }

        else if (isObject(value)) {
            return new ObjectIterable(value);
        }

        return new ArrayIterable([value]);
    }

    function valueOf(obj) {
        if (obj instanceof Date) {
            return isFunction(obj.getTime) ? obj.getTime() : 0;
        }
        else {
            return isFunction(obj.valueOf) ? obj.valueOf() : 0;
        }
    }

    const hashSymbol =  '__hash__';

    function combineHash(h1, h2) {
        return ((h1 << 7) | (h1 >> 25)) ^ h2;
    }

    const POSITIVE_INFINITY = Number.POSITIVE_INFINITY || Infinity;
    const NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY || -Infinity;
    const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 0x1FFFFFFFFFFFFF;
    const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -0x1FFFFFFFFFFFFF;

    function compute31BitNumberHash(val) {
        let _hash = 0;

        // integer number
        if (val <= MAX_SAFE_INTEGER && val >= MIN_SAFE_INTEGER && val % 1 === 0) {
            return val >> 32;
        }

        // non-integer numbers
        switch (val) {
            case POSITIVE_INFINITY: _hash = 0x7F800000; break;
            case NEGATIVE_INFINITY: _hash = 0xFF800000; break;
            default:
                // NaN
                if (val !== val) {
                    _hash = 0;
                    break;
                }

                if (val <= -0.0) {
                    _hash = 0x80000000;
                    val = -val;
                }

                let _exponent = Math.floor(Math.log(val) / Math.log(2)),
                    _significand = ((val / Math.pow(2, _exponent)) * 0x00800000) | 0;

                _exponent += 127;

                if (_exponent >= 0xFF) {
                    _exponent = 0xFF;
                    _significand = 0;
                }
                else if (_exponent < 0) {
                    _exponent = 0;
                }

                _hash = _hash | (_exponent << 23);
                _hash = _hash | (_significand & ~(-1 << 23));
                break;
        }

        return _hash >> 32;
    }

    function compute31BitStringHash(val) {
        let _hash = 0X7FFF,         // string hash seed
            _len = val.length,
            _i = 0;

        for (; _i < _len;) {
            _hash = ((((_hash << 5) - _hash) | 0) + val.charCodeAt(_i++)) | 0;
        }

        return _hash >> 32;
    }

    function compute31BitDateHash(val) {
        let _time = valueOf(val);
        return _time ^ (_time >> 5);
    }

    function isObjectLiteral(obj) {
        return Object.getPrototypeOf(obj) === Object.prototype;
    }

    const __objectHashSeed = Math.floor(Math.random() * 0XFFFF) + 0XFFFF;
    const __objectHashMap = new WeakMap();
    let __objectHashIndex = __objectHashSeed;


    function compute31BitObjecHash(obj) {
        let _hash = __objectHashMap.get(obj);

        // hash not found in the repositoty
        if (_hash === undefined) {
            // create object-literals hash based on their visible properties
            if (isObjectLiteral(obj)) {
                _hash = __objectHashSeed;

                // early seed prevents mutually recursive structures to stack overflow
                __objectHashMap.set(obj, 0);

                // only object literals fall into following code, no need to check for hasOwnProperty
                for (let _p in obj) {
                    _hash = combineHash(_hash, compute31BitStringHash(_p) + hash(obj[_p]));
                }
            }
            else {
                _hash = __objectHashIndex++ >> 32;
            }

            // assign the hash value until the lifetime of the object
            __objectHashMap.set(obj, _hash);
        }

        return _hash;
    }

    /**
    * Serves as a hash function for a particular type, suitable for use in hashing algorithms and data structures such as a hash table.
    * @param {Object} obj An object to retrieve the hash code for.
    * @param {...Objects} rest Optional number of objects to combine their hash codes.
    * @returns {Number}
    */
    function hash(obj, ...rest) {
        let _hash;

        // null/undefined hash is 0
        if (obj === null || obj === undefined) {
            _hash = 0;
        }


        // Compute 'Number' primitive type hash (does not incluede 'new Number(value)')
        else if (typeof obj === 'number') {
            _hash = compute31BitNumberHash(obj);
        }


        // Compute 'String' primitive type hash (does not incluede 'new String(value)')
        else if (typeof obj === 'string') {
            _hash = compute31BitStringHash(obj);
        }


        // Compute 'Boolean' primitive type hash (does not incluede 'new Boolean(value)')
        else if (typeof obj === 'boolean') {
            _hash = obj ? 1 : 0;
        }


        // Compute 'Objects' hash
        else {
            // Compute 'Date' object type hash
            if (obj instanceof Date) {
                _hash = compute31BitDateHash(obj);
            }

            // Compute built-in types hash
            else if (
                obj instanceof Number ||
                obj instanceof String ||
                obj instanceof Boolean) {
                _hash = hash(valueOf(obj));
            }

            // Compute overridden 'hash' method
            else if (typeof obj[hashSymbol] === 'function') {
                _hash = obj[hashSymbol]() >> 32;
            }

            // Compute 'Object' type hash for all other types
            else {
                _hash = compute31BitObjecHash(obj);
            }
        }


        // Combine hash codes for given inputs
        if (rest.length) {
            let _len = rest.length,
                _i = 0;

            while (_i < _len) {
                _hash = combineHash(_hash, hash(rest[_i++]));
            }
        }

        return _hash;
    }

    const equalsSymbol =  '__eq__';

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

        let _val, _prop;

        for (_prop in objA) {
            _val = objA[_prop];

            /// Object methods are not considered for equality
            if (typeof _val === 'function') {
                continue;
            }

            if (!equals(_val, objB[_prop])) {
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
    * @returns {Boolean} if the objA parameter is the same instance as the objB parameter, or if both are null, or if objA.equals(objB) returns true; otherwise, false.
    */
    function equals(objA, objB) {
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
        else if (objA !== objA && objB !== objB) {
            return true;
        }


        // object types equality
        else if (typeof objA === 'object' && typeof objB === 'object') {
            // built-in object types
            if (
                (objA instanceof Date && objB instanceof Date) ||
                (objA instanceof Number && objB instanceof Number) ||
                (objA instanceof String && objB instanceof String) ||
                (objA instanceof Boolean && objB instanceof Boolean)) {
                return valueOf(objA) === valueOf(objB);
            }

            // Compute overridden 'equals' method for Object types
            else if (typeof objA[equalsSymbol] === 'function') {
                return objA[equalsSymbol](objB);
            }

            return computeObjectEquals(objA, objB);
        }


        // Objects are already not equal
        return false;
    }

    const compareSymbol = '__cmp__';

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
            let res = objA.localeCompare(objB);
            return res > 0 ? 1 : (res < 0 ? -1 : 0);
        }

        // Compute overridden 'compare' method for Object types
        else if (typeof objA[compareSymbol] === 'function') {
            return objA[compareSymbol](objB);
        }

        // All other objects are compared using 'valudOf' method
        else {
            let v1 = valueOf(objA),
                v2 = valueOf(objB);

            return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
        }
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
    * @returns {Array}
    */
    function buffer(value) {
        if (value === null || value === undefined) {        // empty value
            return [];
        }

        else if (isArrayLike(value)) {                      // array-likes have fixed element count
            return arrayBuffer(value);
        }

        else if (value instanceof ArrayIterable) {          // ArrayIterable wrapper
            return arrayBuffer(value.valueOf());
        }

        else if (value instanceof Collection) {             // Collections have 'toArray' method
            return value.toArray();
        }

        // do it the hard way
        else {
            return [...iterable(value)];
        }
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

        let source = buffer(value),
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
    * @param {Iterable=} value Iterable whose elements are copied to the new collection.
    */
    class Collection extends Iterable {
        constructor(value = null) {
            if (value !== null && value !== undefined) {
                value = buffer(value);
            }

            super(value);
        }

        /**
        * Gets the number of elements contained in the Collection.
        * @returns {Number}
        */
        count() {
            return this.valueOf() ? this.valueOf().length : 0;
        }

        /**
        * Copies the Collection to an existing one-dimensional Array, starting at the specified array index.
        * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Collection.
        * @param {Number} arrayIndex The zero-based index in array at which copying begins.
        */
        copyTo(array, arrayIndex) {
            bufferTo(this.valueOf(), array, arrayIndex);
        }

        /**
        * Creates an array of the elements from Collection.
        * @returns {Array}
        */
        toArray() {
            return (this.valueOf() || []).concat();
        }

        get [Symbol.toStringTag]() {
            return 'Collection';
        }

        toString() {
            return '[Collection]';
        }
    }

    function mixin(obj, properties, attributes) {
        attributes = attributes || {};

        for (var _prop in properties) {
            if (properties.hasOwnProperty(_prop)) {
                Object.defineProperty(obj, _prop, {
                    value: properties[_prop],
                    writable: attributes.writable || false,
                    enumerable: attributes.enumerable || false,
                    configurable: attributes.configurable || false
                });
            }
        }

        return obj;
    }

    function rangeIterator(start, count) {
        assertType(start, Number);
        assertType(count, Number);

        let max = start + count - 1;

        if (count < 0 || max > Number.MAX_VALUE) {
            error(ERROR_ARGUMENT_OUT_OF_RANGE);
        }

        return new Iterable(function* () {
            let index = -1;

            while (++index < count) {
                yield start + index;
            }
        });
    }

    function repeatIterator(element, count) {
        assertType(count, Number);

        if (count < 0) {
            error(ERROR_ARGUMENT_OUT_OF_RANGE);
        }

        return new Iterable(function* () {
            let index = count;

            while (index-- > 0) {
                yield element;
            }
        });
    }

    function assertNotNull(obj) {
        if (obj === null || obj === undefined) {
            error('Value cannot be null.');
        }
    }

    function aggregateIterator(source, seed, func, resultSelector = item => item) {
        assertNotNull(source);
        assertType(func, Function);
        assertType(resultSelector, Function);

        let result = seed;

        for (let element of source) {
            result = func(result, element);
        }

        return resultSelector(result);
    }

    function allIterator(source, predicate) {
        assertNotNull(source);
        assertType(predicate, Function);

        for (let element of source) {
            if (!predicate(element)) {
                return false;
            }
        }

        return true;
    }

    function anyIterator(source, predicate = () => true) {
        assertNotNull(source);
        assertType(predicate, Function);

        for (let element of source) {
            if (predicate(element)) {
                return true;
            }
        }

        return false;
    }

    function selectIterator(source, selector) {
        assertNotNull(source);
        assertType(selector, Function);

        return new Iterable(function* () {
            let index = 0;

            for (let element of source) {
                yield selector(element, index++);
            }
        });
    }

    function averageIterator(source, selector = null) {
        assertNotNull(source);

        if (selector) {
            return averageIterator(selectIterator(source, selector));
        }

        let sum = 0,
            count = 0;

        for (let element of source) {
            sum += element;
            count++;
        }

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

        return new Iterable(function* () {
            for (let element of first) {
                yield element;
            }

            for (let element of second) {
                yield element;
            }
        });
    }

    /**
    * Provides a base class for implementations of the EqualityComparer.
    */
    class EqualityComparer {
        constructor(hashCodeProvider, equality) {
            assertType(hashCodeProvider, Function);
            assertType(equality, Function);

            this._hash = hashCodeProvider;
            this._equals = equality;
        }

        /**
        * Determines whether the specified objects are equal.
        * @param {Object} x The first object of type Object to compare.
        * @param {Object} y The second object of type Object to compare.
        * @returns true if the specified objects are equal; otherwise, false.
        */
        equals(x, y) {
            return this._equals(x, y);
        }

        /**
        * Returns a hash code for the specified object.
        * @param {Object} obj The Object for which a hash code is to be returned.
        * @returns A hash code for the specified object.
        */
        hash(obj) {
            return this._hash(obj);
        }

        /**
        * Gets a default sort order comparer for the type specified by the generic argument.
        */
        static get defaultComparer() {
            return defaultEqualityComparer;
        }

        /**
        * Gets or creates a new EqualityComparer object.
        * @param {EqualityComparer|Object} value An EqualityComparer object.
        * @returns {EqualityComparer}
        */
        static from(value) {
            if (value instanceof EqualityComparer) {
                return value;
            }

            else if (value && isFunction(value.hash) && isFunction(value.equals)) {
                return new EqualityComparer(value.hash, value.equals);
            }

            else {
                return defaultEqualityComparer;
            }
        }

        get [Symbol.toStringTag]() {
            return 'EqualityComparer';
        }

        toString() {
            return '[EqualityComparer]';
        }
    }


    const defaultEqualityComparer = new EqualityComparer(hash, equals);

    function containsIterator(source, value, comparer = null) {
        assertNotNull(source);
        comparer = EqualityComparer.from(comparer);

        for (let element of source) {
            if (comparer.equals(element, value)) {
                return true;
            }
        }

        return false;
    }

    function whereIterator(source, predicate) {
        assertNotNull(source);
        assertType(predicate, Function);

        return new Iterable(function* () {
            let index = 0;

            for (let element of source) {
                if (predicate(element, index++)) {
                    yield element;
                }
            }
        });
    }

    /*jshint unused:false*/
    function count(value) {
        if (isArrayLike(value)) {
            return value.length;
        }

        else if (value instanceof ArrayIterable) {
            return value.valueOf().length;
        }

        else if (value instanceof Collection) {
            return value.count();
        }

        else {
            let count = 0;

            for (let element in iterable(value)) {
                count++;
            }

            return count;
        }
    }

    function countIterator(source, predicate = null) {
        assertNotNull(source);

        if (predicate) {
            return count(whereIterator(source, predicate));
        }

        return count(source);
    }

    function defaultIfEmptyIterator(source, defaultValue) {
        assertNotNull(source);

        return new Iterable(function* () {
            let it = iterator(source),
                next = it.next();

            if (!next.done) {
                do {
                    yield next.value;
                }
                while (!(next = it.next()).done);
            }
            else {
                yield defaultValue;
            }
        });
    }

    function asArray(value) {
        if (isArrayLike(value)) {                       // array-likes have fixed element count
            return value;
        }

        else if (value instanceof ArrayIterable) {      // ArrayIterable wrapper
            return value.valueOf();
        }

        return null;
    }

    function elementAtIterator(source, index) {
        assertNotNull(source);
        assertType(index, Number);

        if (index < 0) {
            error(ERROR_ARGUMENT_OUT_OF_RANGE);
        }

        let arr = asArray(source);

        // fast find for array-like objects
        if (arr !== null) {
            if (index < arr.length) {
                return arr[index];
            }
        }

        else {
            let it = iterator(source),
                next;

            while (!(next = it.next()).done) {
                if (index-- === 0) {
                    return next.value;
                }
            }
        }

        error(ERROR_ARGUMENT_OUT_OF_RANGE);
    }

    function forEachIterator(source, action) {
        assertNotNull(source);
        assertType(action, Function);

        let index = 0;

        for (let element of source) {
            action(element, index++);
        }
    }

    function zipIterator(first, second, resultSelector) {
        assertNotNull(first);
        assertNotNull(second);
        assertType(resultSelector, Function);

        return new Iterable(function* () {
            let it1 = iterator(first),
                it2 = iterator(second),
                next1,
                next2;

            while (!(next1 = it1.next()).done && !(next2 = it2.next()).done) {
                yield resultSelector(next1.value, next2.value);
            }
        });
    }

    function linq(iterable) {
        mixin(iterable, {

            /**
            * Returns an empty Iterable.
            * @returns {Iterable}
            */
            empty() {
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
            aggregate(seed, func, resultSelector = element => element) {
                return aggregateIterator(this, func, resultSelector);
            },

            /**
            * Determines whether all elements of a sequence satisfy a condition.
            * Returns true if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
            * @param {Function} predicate A function to test each element for a condition. eg. function(item).
            * @returns {Boolean}
            */
            all(predicate) {
                return allIterator(this, predicate);
            },

            /**
            * Determines whether a sequence contains any elements.
            * Returns true if any elements in the source sequence contains any elements or pass the test in the specified predicate; otherwise, false.
            * @param {Function=} predicate A function to test each element for a condition. eg. function(item).
            * @returns {Boolean}
            */
            any(predicate = () => true) {
                return anyIterator(this, predicate);
            },

            /**
            * Computes the average of a sequence of numeric values.
            * @param {Function=} selector A transform function to apply to each element. eg.function(item).
            * @returns {Number}
            */
            average(selector = null) {
                return averageIterator(this, selector);
            },

            /**
            * Concatenates two sequences.
            * @param {Iterable} second The sequence to concatenate to current sequence.
            * @returns {Iterable}
            */
            concat(second) {
                return concatIterator(this, second);
            },

            /**
            * Determines whether a sequence contains a specified element by using an equality comparer.
            * @param {Object} value The value to locate in the sequence.
            * @param {EqualityComparer=} comparer An equality comparer to compare values.
            * @returns {Boolean}
            */
            contains(value, comparer = null) {
                return containsIterator(this, value, comparer);
            },

            /**
            * Returns the number of elements in a sequence.
            * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
            * @returns {Number}
            */
            count(predicate) {
                return countIterator(this, predicate);
            },

            /**
            * Returns the elements of the specified sequence or the specified value in a collection if the sequence is empty.
            * @param {Object=} defaultValue The value to return if the sequence is empty.
            * @returns {Iterable}
            */
            defaultIfEmpty(defaultValue) {
                return defaultIfEmptyIterator(this, defaultValue);
            },

            /**
            * Returns the element at a specified index in a sequence. Throws an error if the index is less than 0 or greater than or equal to the number of elements in source.
            * @param {Number} index The zero-based index of the element to retrieve.
            * @returns {Object}
            */
            elementAt(index) {
                return elementAtIterator(this, index);
            },

            /**
            * Performs the specified action on each element of an Iterable.
            * @param {Function} action The action function to perform on each element of an Iterable. eg. function(item, index)
            */
            forEach(action) {
                return forEachIterator(this, action);
            },

            /**
            * Projects each element of a sequence into a new form.
            * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element. eg. function(item, index)
            * @returns {Iterable}
            */
            select(selector) {
                return selectIterator(this, selector);
            },

            /**
            * Creates an array from an Iterable.
            * @returns {Array}
            */
            toArray() {
                return buffer(this);
            },

            /**
            * Filters a sequence of values based on a predicate. Each element's index is used in the logic of the predicate function.
            * @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element. eg. function(item, index)
            * @returns {Iterable}
            */
            where(predicate) {
                return whereIterator(this, predicate);
            },

            /**
            * Merges two sequences by using the specified predicate function.
            * @param {Iterable} second The second sequence to merge.
            * @param {Function} resultSelector A function that specifies how to merge the elements from the two sequences. eg. function(first, second)
            * @returns {Iterable}
            */
            zip(second, resultSelector) {
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
        return iterable(value);
    }



    mx.hash = hash;
    mx.hashSymbol = hashSymbol;
    mx.equals = equals;
    mx.equalsSymbol = equalsSymbol;
    mx.compare = compare;
    mx.compareSymbol = compareSymbol;
    mx.iteratorSymbol = Symbol.iterator;

    mx.empty = Iterable.empty;
    mx.range = Iterable.range;
    mx.repeat = Iterable.repeat;

    mx.Iterable = Iterable;
    mx.Iterator = Iterator;
    mx.Collection = Collection;
    mx.version = '2.0.0';

    return mx;

}));

