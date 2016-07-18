/*!
* Multiplex.js - Comprehensive data-structure and LINQ library for JavaScript.
* Version 2.0.0 (July 19, 2016)

* Created and maintained by Kamyar Nazeri <Kamyar.Nazeri@yahoo.com>
* Licensed under MIT License
* https://github.com/multiplex/multiplex.js
*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.mx = factory());
}(this, function () { 'use strict';

    function error(msg) {
        throw new Error(msg);
    }

    function arraySizeError() {
        error('The number of elements in the source is greater than the number of elements that the destination array can contain.');
    }

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
    }


    /**
    * Supports an iteration over an Array or Array-Like.
    * @param {Array} arr An array or array-like object.
    */
    class ArrayIterator extends Iterator {
        constructor(arr) {
            let _index = -1,
                _length = arr.length;

            super(() => {
                if (++_index < _length) {
                    return {
                        value: arr[_index],
                        done: false
                    };
                }

                return {
                    done: true
                };
            });
        }
    }


    /**
    * Supports an iteration over an Object.
    * @param {Object} obj An object instance.
    */
    class ObjectIterator extends Iterator {
        constructor(obj) {
            let _index = -1,
                _keys = Object.keys(obj),
                _length = _keys.length;

            // [key, value] iterator
            super(() => {
                if (++_index < _length) {
                    return {
                        value: [
                            _keys[_index],
                            obj[_keys[_index]]
                        ],
                        done: false
                    };
                }
                return {
                    done: true
                };
            });
        }
    }


    /**
    * Creates an empty iteration.
    */
    class EmptyIterator extends Iterator {
        constructor() {
            super(() => ({ done: true }));
        }
    }

    const iteratorSymbol = Symbol.iterator;

    function isFunction(fn) {
        return typeof fn === 'function';
    }

    function toString(obj) {
        return typeof obj.toString === 'function' ? obj.toString() : '';
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


        else if (obj != null &&
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
        else if (isFunction(obj[iteratorSymbol])) {
            return obj[iteratorSymbol]();
        }


        // array-like objects
        else if (isArrayLike(obj)) {
            return new ArrayIterator(obj);
        }


        // Object.entries iterator
        else if (typeof obj === 'object') {
            return new ObjectIterator(obj);
        }

        // simple iterator over non-objects
        else {
            return new ArrayIterator([obj]);
        }
    }

    /**
    * Creates a new Iterable instance.
    * @param {Iterable|Array|String|Function|Function*|Object} source An Iterable object.
    * @returns {Iterable}
    */
    class Iterable {
        constructor(source = null) {
            if (source != null) {
                this._source = source;
            }
        }

        [Symbol.iterator]() {
            return iterator(this._source);
        }

        static from(value) {
            return value instanceof Iterable ? value : new Iterable(value);
        }

        toString() {
            return '[Iterable]';
        }

        valueOf() {
            return this._source == null ? this : this._source;
        }
    }

    function valueOf(obj) {
        if (obj instanceof Date) {
            return typeof obj.getTime === 'function' ? obj.getTime() : 0;
        }
        else {
            return typeof obj.valueOf === 'function' ? obj.valueOf() : 0;
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
            return objA == objB;
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
            return objB == objA ? 0 : -1;
        }

        // Everything is greater than null or undefined
        else if (objB === null || objB === undefined) {
            return objA == objB ? 0 : 1;
        }

        // numbers compare using 'gt' operator
        else if (typeof objA === 'number') {
            // objA: NaN
            if (objA !== objA) {
                return objB != objB ? 0 : -1;
            }
            // objB: NaN
            else if (objB !== objB) {
                return 1;
            }
            return objA > objB ? 1 : -1;
        }

        // booleans compare using 'gt' operator
        else if (typeof objA === 'boolean') {
            return objA > objB ? 1 : -1;
        }

        // Strings are compared using String.prototype.localeCompare method
        else if (typeof objA === 'string') {
            let _res = objA.localeCompare(objB);
            return _res > 0 ? 1 : (_res < 0 ? -1 : 0);
        }

        // Compute overridden 'compare' method for Object types
        else if (typeof objA[compareSymbol] === 'function') {
            return objA[compareSymbol](objB);
        }

        // All other objects are compared using 'valudOf' method
        else {
            let _v1 = valueOf(objA),
                _v2 = valueOf(objB);

            return _v1 > _v2 ? 1 : (_v1 < _v2 ? -1 : 0);
        }
    }

    function isString(val) {
        return val != null && typeof val === 'string';
    }

    function isArray(val) {
        return val instanceof Array;
    }

    /**
    * Buffers an Iterale object into an array.
    * @param {Iterale} value An Iterale object.
    * @returns {Array}
    */
    function buffer(value) {
        value = value || [];

        if (isArray(value)) {                               // fast buffer arrays
            return value.concat();                          // 'concat' is fastest way to duplicate an array
        }

        else if (isString(value)) {                         // fast buffer strings
            return value.split('');                         // buffer string to char-array
        }

        else {
            if (isType(value, Iterable)) {
                let source = value.valueOf();

                if (isArray(source)) {                      // fast buffer array/string enumerable
                    return source.concat();                 // 'concat' is fastest way to duplicate an array
                }
                else if (isString(source)) {                // fast buffer strings
                    return source.split('');                // buffer string to char-array
                }
                else if (isFunction(source.slice)) {        // fast buffer enumerable with slice function: List
                    return source.slice(0);
                }
            }

            // do it the hard way
            // collections have fixed element count
            if (value instanceof Collection) {
                let count = 0,
                    arr = new Array(value.count());

                for (let element of value) {
                    arr[count++] = element;
                }

                return arr;
            }
            else {
                let count = 0,
                    length = 16,
                    arr = new Array(length);

                for (let element of value) {
                    if (count >= length) {
                        length *= 4;
                        arr.length = length;
                    }

                    arr[count++] = element;
                }

                arr.length = count;
                return arr;
            }
        }
    }

    function assertNotNull(obj) {
        if (obj == null) {
            error('Value cannot be null.');
        }
    }

    /**
    * Buffers an Iterable instance into a given array.
    * @param {Iterable} value An Iterable object.
    * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Iterable.
    * @param {Number} index The zero-based index in array at which copying begins.
    */
    function bufferTo(value, array, index) {
        assertNotNull(array);
        assertType(index, Number);

        if (index > array.length || value.count() > array.length) {
            arraySizeError();
        }

        let arr = buffer(value),
            len = arr.length,
            i = -1;


        while (++i < len) {
            array[index + i] = arr[i];
        }
    }

    /**
    * Initializes a new instance of the abstract Collection class.
    * @param {Iterable=} value Iterable whose elements are copied to the new collection.
    */
    class Collection extends Iterable {
        constructor(value = null) {
            super(buffer(value));
        }

        /**
        * Gets the number of elements contained in the Collection.
        * @returns {Number}
        */
        count() {
            return this.valueOf().length;
        }

        /**
        * Copies the Collection to an existing one-dimensional Array, starting at the specified array index.
        * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Collection.
        * @param {Number} arrayIndex The zero-based index in array at which copying begins.
        */
        copyTo(array, arrayIndex) {
            bufferTo(this.valueOf(), array, arrayIndex);
        }
    }

    function mixin(obj, properties, attributes) {
        attributes = attributes || {};

        for (var _prop in properties) {
            Object.defineProperty(obj, _prop, {
                value: properties[_prop],
                writable: attributes.writable || false,
                enumerable: attributes.enumerable || false,
                configurable: attributes.configurable || false
            });
        }

        return obj;
    }

    function select(source, selector) {
        assertType(selector, Function);

        return new Iterable(function* () {
            let index = 0;

            for (let element of source) {
                yield selector(element, index++);
            }
        });
    }

    function linq(iterable) {
        mixin(iterable, {
        });

        mixin(iterable.prototype, {
            select(selector) {
                return select(this, selector);
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
        return value instanceof Iterable ? value : new Iterable(value);
    }



    mx.hash = hash;
    mx.hashSymbol = hashSymbol;
    mx.equals = equals;
    mx.equalsSymbol = equalsSymbol;
    mx.compare = compare;
    mx.compareSymbol = compareSymbol;
    mx.iteratorSymbol = iteratorSymbol;

    mx.Iterable = Iterable;
    mx.Iterator = Iterator;
    mx.Collection = Collection;
    mx.version = '2.0.0';

    return mx;

}));

