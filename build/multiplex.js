/*!
* Multiplex.js - Comprehensive data-structure and LINQ library for JavaScript.
* Version 2.0.0 (August 09, 2016)

* Created and maintained by Kamyar Nazeri <Kamyar.Nazeri@yahoo.com>
* Licensed under MIT License
* https://github.com/multiplex/multiplex.js
*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.mx = factory());
}(this, function () { 'use strict';

    function isFunction(fn) {
        return typeof fn === 'function';
    }

    function mixin(obj, properties, attributes) {
        attributes = attributes || {};

        for (var _prop in properties) {
            if (properties.hasOwnProperty(_prop)) {
                define(obj, _prop, {
                    value: properties[_prop],
                    writable: attributes.writable || true,
                    enumerable: attributes.enumerable || false,
                    configurable: attributes.configurable || false
                });
            }
        }

        return obj;
    }

    function define(obj, prop, attributes) {
        if (isFunction(Object.defineProperty)) {
            Object.defineProperty(obj, prop, attributes);
        }
        else {
            obj[prop] = attributes.get ? attributes.get.apply(obj) : attributes.value;
        }
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

    /*jshint newcap:false*/
    function extend(type, superType) {
        if (isFunction(Object.create)) {
            type.prototype = Object.create(superType.prototype);
        }
        else {
            var Super = function () { };
            Super.prototype = superType.prototype;
            type.prototype = new Super();
        }

        type.prototype.constructor = type;
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

    extend(ArrayIterator, Iterator);

    mixin(ArrayIterator.prototype, {
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

    extend(ObjectIterator, Iterator);

    mixin(ObjectIterator.prototype, {
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

    extend(EmptyIterator, Iterator);

    mixin(EmptyIterator.prototype, {
        toString: function () {
            return '[Empty Iterator]';
        }
    });

    var iteratorSymbol = (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') ?
        Symbol.iterator : '@@iterator';

    /**
    * Supports an iteration over an .Net Enumerable.
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


    extend(EnumerableIterator, Iterator);

    mixin(EnumerableIterator.prototype, {
        toString: function () {
            return '[Enumerable Iterator]';
        }
    });

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

    /**
    * Defines abstract Iterable class.
    * @param {Iterable|Array|String|Function|Function*|Object} source An Iterable object.
    */
    function Iterable(source) {
        if (source !== null && source !== undefined) {
            this._source = source;
        }
    }

    Iterable.prototype[iteratorSymbol] = function () {
        return iterator(this._source);
    };

    mixin(Iterable.prototype, {
        toString: function () {
            return '[Iterable]';
        },

        valueOf: function () {
            return this._source;
        }
    });

    /**
    * Creates a new ArrayIterable instance.
    * @param {Array|String|Array-like} value An array-like object.
    */
    function ArrayIterable(value) {
        Iterable.call(this, value);
    }

    extend(ArrayIterable, Iterable);

    ArrayIterable.prototype[iteratorSymbol] = function () {
        var arr = this.valueOf();
        return isFunction(arr[iteratorSymbol]) ? arr[iteratorSymbol]() : new ArrayIterator(arr);
    };

    mixin(ArrayIterable.prototype, {
        toString: function () {
            return '[Array Iterable]';
        }
    });

    /**
    * Creates a new ObjectIterable instance.
    * @param {Object} value An object instance.
    */
    function ObjectIterable(value) {
        Iterable.call(this, value);
    }

    extend(ObjectIterable, Iterable);

    ObjectIterable.prototype[iteratorSymbol] = function () {
        return new ObjectIterator(this.valueOf());
    };

    mixin(ObjectIterable.prototype, {
        toString: function () {
            return '[Object Iterable]';
        }
    });

    /**
    * Creates a new EmptyIterable instance.
    */
    function EmptyIterable() {
    }

    extend(EmptyIterable, Iterable);

    EmptyIterable.prototype[iteratorSymbol] = function () {
        return new EmptyIterator();
    };

    mixin(EmptyIterable.prototype, {
        toString: function () {
            return '[Empty Iterable]';
        }
    });

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
            return isFunction(obj.getTime) ? obj.getTime() : 0;
        }
        else {
            return isFunction(obj.valueOf) ? obj.valueOf() : 0;
        }
    }

    var hashSymbol = '__hash__';

    function combineHash(h1, h2) {
        return ((h1 << 7) | (h1 >> 25)) ^ h2;
    }

    var POSITIVE_INFINITY = Number.POSITIVE_INFINITY || Infinity;
    var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY || -Infinity;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 0x1FFFFFFFFFFFFF;
    var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -0x1FFFFFFFFFFFFF;

    function compute31BitNumberHash(val) {
        var _hash = 0;

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

                var _exponent = Math.floor(Math.log(val) / Math.log(2)),
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
        var _hash = 0X7FFF,         // string hash seed
            _len = val.length,
            _i = 0;

        for (; _i < _len;) {
            _hash = ((((_hash << 5) - _hash) | 0) + val.charCodeAt(_i++)) | 0;
        }

        return _hash >> 32;
    }

    function compute31BitDateHash(date) {
        var _time = valueOf(date);
        return _time ^ (_time >> 5);
    }

    function isObjectLiteral(obj) {
        return Object.getPrototypeOf(obj) === Object.prototype;
    }

    var __objectHashSeed = Math.floor(Math.random() * 0XFFFF) + 0XFFFF;
    var __objectHashIndex = __objectHashSeed;
    var compute31BitObjecHash;

    if (typeof WeakMap === 'function') {
        var __objectHashMap = new WeakMap();

        // using Weakmap as 'hash' repository when possible
        compute31BitObjecHash = function (obj) {
            var _hash = __objectHashMap.get(obj);

            if (_hash === undefined) {
                // create object-literals hash based on their visible properties
                if (isObjectLiteral(obj)) {
                    _hash = __objectHashSeed;

                    // early seed prevents mutually recursive structures to stack overflow
                    __objectHashMap.set(obj, 0);

                    // only object literals fall into following code, no need to check for hasOwnProperty
                    for (var _p in obj) {
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
        };
    }
    else {
        compute31BitObjecHash = function (obj) {
            var _hash = 0;
            var _extensible = Object.isExtensible && Object.isExtensible(obj);

            // only override 'hash' method when object is extensible (not sealed or frozen)
            if (_extensible) {
                // create object-literals hash based on their visible properties
                obj[hashSymbol] = function () {
                    return _hash;
                };
            }


            if (isObjectLiteral(obj)) {
                _hash = __objectHashSeed;

                // only object literals fall into following code, no need to check for hasOwnProperty
                for (var _p in obj) {
                    if (_p === hashSymbol) {
                        continue;
                    }

                    _hash = combineHash(_hash, compute31BitStringHash(_p) + hash(obj[_p]));
                }
            }
            else {
                // return constant hash codes for non-extensible class instances
                _hash = _extensible ? __objectHashIndex++ >> 32 : __objectHashSeed;
            }

            return _hash;
        };
    }

    /**
    * Serves as a hash function for a particular type, suitable for use in hashing algorithms and data structures such as a hash table.
    * @param {Object} obj An object to retrieve the hash code for.
    * @param {...Objects} rest Optional number of objects to combine their hash codes.
    * @returns {Number}
    */
    function hash(obj) {
        var _hash;

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
        if (arguments.length > 1) {
            var _len = arguments.length,
                _i = 1;

            while (_i < _len) {
                _hash = combineHash(_hash, hash(arguments[_i++]));
            }
        }

        return _hash;
    }

    var equalsSymbol = '__eq__';

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

        var _val, _prop;

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

            // Object types
            return computeObjectEquals(objA, objB);
        }


        // Objects are already not equal
        return false;
    }

    var compareSymbol = '__cmp__';

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
        else if (typeof objA[compareSymbol] === 'function') {
            return objA[compareSymbol](objB);
        }

        // All other objects are compared using 'valudOf' method
        else {
            var v1 = valueOf(objA),
                v2 = valueOf(objB);

            return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
        }
    }

    /**
    * Provides a base class for implementations of Comparer.
    */
    function Comparer(comparison) {
        assertType(comparison, Function);
        this._comparison = comparison;
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
        compare: function (objA, objB) {
            this._comparison(objA, objB);
        },

        toString: function () {
            return '[Comparer]';
        }
    });


    mixin(Comparer, {

        /**
        * Gets a default sort order comparer for the type specified by the generic argument.
        */
        defaultComparer: defaultComparer,

        /**
        * Gets or creates a new Comparer object.
        * @param {Comparer|Object} value A Comparer object.
        * @returns {Comparer}
        */
        from: function (value) {
            if (value instanceof Comparer) {
                return value;
            }

            else if (value && isFunction(value.compare)) {
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

        this._hash = hashCodeProvider;
        this._equals = equality;
    }


    var defaultEqualityComparer = new EqualityComparer(hash, equals);


    mixin(EqualityComparer.prototype, {
        /**
        * Determines whether the specified objects are equal.
        * @param {Object} x The first object of type Object to compare.
        * @param {Object} y The second object of type Object to compare.
        * @returns true if the specified objects are equal; otherwise, false.
        */
        equals: function (x, y) {
            return this._equals(x, y);
        },

        /**
        * Returns a hash code for the specified object.
        * @param {Object} obj The Object for which a hash code is to be returned.
        * @returns A hash code for the specified object.
        */
        hash: function (obj) {
            return this._hash(obj);
        },

        toString: function () {
            return '[EqualityComparer]';
        }
    });


    mixin(EqualityComparer, {
        /**
        * Gets a default sort order comparer for the type specified by the generic argument.
        */
        defaultComparer: defaultEqualityComparer,

        /**
        * Gets or creates a new EqualityComparer object.
        * @param {EqualityComparer|Object} value An EqualityComparer object.
        * @returns {EqualityComparer}
        */
        from: function (value) {
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
    });

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
            var it = iterator(value),
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

        ArrayIterable.call(this, value);
    }

    extend(Collection, ArrayIterable);

    mixin(Collection.prototype, {
        /**
        * Gets the number of elements contained in the Collection.
        * @returns {Number}
        */
        count: function () {
            return this.valueOf() ? this.valueOf().length : 0;
        },

        /**
        * Copies the Collection to an existing one-dimensional Array, starting at the specified array index.
        * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Collection.
        * @param {Number} arrayIndex The zero-based index in array at which copying begins.
        */
        copyTo: function (array, arrayIndex) {
            bufferTo(this.valueOf(), array, arrayIndex);
        },

        toString: function () {
            return '[Collection]';
        }
    });

    function Grouping(key, elements) {
        this.key = key;
        this.elements = elements;
    }

    extend(Grouping, Collection);

    mixin(Grouping.prototype, {
        valueOf: function () {
            return this.elements;
        },

        toString: function () {
            return '[Grouping]';
        }
    });

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
            return value.valueOf();
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
            var it = iterator(source),
                next;

            while (!(next = it.next()).done) {
                if (action(next.value) !== undefined) {
                    break;
                }
            }
        }
    }

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

        getGrouping: function (key, value, create) {
            var hash = this.comparer.hash(key) & 0x7FFFFFFF,
                equals = this.comparer.equals,
                bucket = hash % this.buckets.length,
                index = this.buckets[bucket],
                grouping = null,
                slot = null;


            while (index !== undefined) {
                slot = this.slots[index];

                if (slot.hash === hash && equals(slot.grouping.key, key)) {
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
                    this.slots[index] = new Slot(hash, grouping, this.buckets[bucket]);
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
            this.buckets.length = newSize;


            // rehash values & update buckets and slots
            for (var index = 0; index < size; index++) {
                slot = this.slots[index];
                bucket = slot.hash % newSize;
                slot.next = this.buckets[bucket];
                this.buckets[bucket] = index;
            }
        },

        keys: function () {
            var arr = new Array(this.size),
                index = 0;

            for (var i = 0, count = this.slots.length; i < count; i++) {
                arr[index++] = this.slots[i].grouping.key;
            }

            return arr;
        }
    });


    mixin(LookupTable, {
        create: function (source, keySelector, comparer) {
            var lookup = new LookupTable(comparer);

            forOf(source, function (element) {
                lookup.add(keySelector(element), element);
            });

            return lookup;
        }
    });


    LookupTable.prototype[iteratorSymbol] = function () {
        var slots = this.slots,
            length = slots.length,
            index = 0;

        return new Iterator(function () {
            if (++index < length) {
                return {
                    value: slots[index],
                    done: false
                };
            }

            return {
                done: true
            };
        });
    };


    function Slot(hash, grouping, next) {
        this.hash = hash;
        this.next = next;
        this.grouping = grouping;
    }

    function assertNotNull(obj) {
        if (obj === null || obj === undefined) {
            error('Value cannot be null.');
        }
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


    extend(Lookup, Collection);


    mixin(Lookup.prototype, {
        get: function (key) {
            return this.table.get(key);
        },

        contains: function (key) {
            return this.table.contains(key);
        },

        count: function () {
            return this.table.size;
        },

        valueOf: function () {
            this.table.keys();
        },

        toString: function () {
            return '[Lookup]';
        }
    });

    Lookup[iteratorSymbol] = function () {
        return this.table[Symbol.iterator]();
    };

    function List(value) {
        this._value = value;
    }

    extend(List, Collection);

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
            var it = iterator(source),
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
            var itFirst = iterator(first),
                itSecond = iterator(second),
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

    function whereIterator(source, predicate) {
        assertNotNull(source);
        assertType(predicate, Function);

        return new Iterable(function () {
            var it = iterator(source),
                index = 0,
                next;

            return new Iterator(function () {
                if (!(next = it.next()).done) {
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
            var it = iterator(value),
                count = 0;

            while (!it.next().done) {
                count++;
            }

            return count;
        }
    }

    function countIterator(source, predicate) {
        assertNotNull(source);

        if (predicate) {
            return count(whereIterator(source, predicate));
        }

        return count(source);
    }

    function defaultIfEmptyIterator(source, defaultValue) {
        assertNotNull(source);

        return new Iterable(function () {
            var it = iterator(source),
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

    function HashTable(comparer) {
        this.initialize();
        this.comparer = EqualityComparer.from(comparer);
    }


    mixin(HashTable.prototype, {
        initialize: function () {
            this.size = 0;                      // total number of entries, including release entries (freeCount)
            this.freeIndex = undefined;         // next free index in the bucket list
            this.freeCount = 0;                 // total number of release entries
            this.buckets = new Array(7);        // bucket list. index: hash, value: entry index;
            this.entries = new Array(7);        // entry list. next: index of the next bucket;
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

        count: function () {
            return this.size - this.freeCount;
        },

        find: function (key) {
            var hash = this.comparer.hash(key) & 0x7FFFFFFF,
                equals = this.comparer.equals,
                entry = null;

            for (var index = this.buckets[hash % this.buckets.length]; index !== undefined;) {
                entry = this.entries[index];

                if (entry.hash === hash && equals(entry.key, key)) {
                    return index;
                }

                index = entry.next;
            }

            return -1;
        },

        insert: function (key, value, add) {
            var hash = this.comparer.hash(key) & 0x7FFFFFFF,
                equals = this.comparer.equals,
                bucket = hash % this.buckets.length,
                entry = null,
                index = 0;


            // check for item existance, freed entries have undefined hash-code value and do not need enumeration
            for (index = this.buckets[bucket]; index !== undefined;) {
                entry = this.entries[index];

                if (entry.hash === hash && equals(entry.key, key)) {
                    if (add) {
                        return false;
                    }

                    entry.value = value;
                    return true;
                }

                index = entry.next;
            }



            // item with the same key does not exists, add item

            index = 0;

            // there's already a free index
            if (this.freeCount > 0) {
                index = this.freeIndex;                         // consume free index
                this.freeIndex = this.entries[index].next;      // save new free index
                this.freeCount--;                               // update number of free entries
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

            this.entries[index] = new Entry(hash, this.buckets[bucket], key, value);
            this.buckets[bucket] = index;

            return true;
        },

        keys: function () {
            var arr = new Array(this.count()),
                entries = this.entries,
                entry = null,
                index = 0;

            for (var i = 0, count = this.size; i < count; i++) {
                entry = entries[i];

                if (entry.hash !== undefined) {
                    arr[index++] = entry.key;
                }
            }

            return arr;
        },

        resize: function () {
            var size = this.size,
                newSize = resize(size),
                entry = null,
                bucket = 0;

            this.buckets.length = newSize;          // expand buckets
            this.entries.length = newSize;          // expand entries


            // rehash values & update buckets and entries
            for (var index = 0; index < size; index++) {
                entry = this.entries[index];

                // freed entries have undefined hashCode value and do not need rehash
                if (entry.hash !== undefined) {
                    bucket = entry.hash % newSize;          // rehash
                    entry.next = this.buckets[bucket];      // update entry's next index in the bucket chain
                    this.buckets[bucket] = index;           // update bucket index
                }
            }
        },

        remove: function (key) {
            var equals = this.comparer.equals,
                hash = this.comparer.hash(key) & 0x7FFFFFFF,    // hash-code of the key
                bucket = hash % this.buckets.length,                 // bucket index
                last,
                entry;

            // freed entries have undefined hash-code value and do not need enumeration
            for (var index = this.buckets[bucket]; index !== undefined;) {
                entry = this.entries[index];

                if (entry.hash === hash && equals(entry.key, key)) {
                    // last item in the chained bucket list
                    if (last === undefined) {
                        this.buckets[bucket] = entry.next;
                    }
                    else {
                        this.entries[last].next = entry.next;
                    }

                    entry.hash = undefined;         // release the entry
                    entry.next = this.freeIndex;    // save previous free index
                    entry.key = null;
                    entry.value = null;

                    this.freeIndex = index;         // save new free index
                    this.freeCount++;               // update number of free entries
                    return true;
                }

                last = index;
                index = entry.next;
            }

            // item does not exist
            return false;
        },

        get: function (key) {
            var index = this.find(key);
            return index === -1 ? undefined : this.entries[index].value;
        },

        set: function (key, value) {
            this.insert(key, value, false);
        }
    });


    HashTable.prototype[iteratorSymbol] = function () {
        var index = 0,
            entry = null,
            size = this.size,
            entries = this.entries;

        return new Iterator(function () {
            while (index < size) {
                entry = entries[index++];

                // freed entries have undefined as hashCode value and do not enumerate
                if (entry.hash !== undefined) {
                    return {
                        value: [entry.key, entry.value],
                        done: false
                    };
                }
            }

            return {
                done: true
            };
        });
    };


    function Entry(hash, next, key, value) {
        this.hash = hash;       // item's key hash-code
        this.next = next;       // index of the next bucket in the chained bucket list
        this.key = key;         // item's key
        this.value = value;     // item's value
    }

    function distinctIterator(source, comparer) {
        assertNotNull(source);

        return new Iterable(function () {
            var it = iterator(source),
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
            var it = iterator(source),
                next;

            while (!(next = it.next()).done) {
                if (index-- === 0) {
                    return next.value;
                }
            }
        }

        error(ERROR_ARGUMENT_OUT_OF_RANGE);
    }

    function exceptIntersectIterator(first, second, intersect, comparer) {
        assertNotNull(first);
        assertNotNull(second);

        var result = intersect ? true : false;

        return new Iterable(function () {
            var it = iterator(first),
                table = new HashTable(comparer),
                next;

            return new Iterator(function () {
                forOf(second, function (element) {
                    table.add(element);
                });

                if (!(next = it.next()).done) {
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
                it = iterator(lookup),
                next;

            return new Iterator(function () {
                if (!(next = it.next()).done) {
                    return {
                        value: resultSelector ? resultSelector(next.value.key, next.value) : next.value,
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
                it = iterator(outer),
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
                it = iterator(outer),
                elements = null,
                index = 0,
                next;

            return new Iterator(function () {
                while (!(next = it.next()).done) {
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
            var it = iterator(source),
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
            var it = iterator(source),
                next = it.next(),
                itcol,
                nextcol,
                index = 0;

            return new Iterator(function () {
                if (!next.done) {
                    do {
                        itcol = itcol || iterator(collectionSelector(next.value, index++));

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

        var it1 = iterator(first),
            it2 = iterator(second),
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

    function singleIterator(source, predicate) {
        var value = {},
            result = firstOrDefaultIterator(source, predicate, value);

        if (result === value) {
            error(predicate ? ERROR_NO_MATCH : ERROR_NO_ELEMENTS);
        }

        return result;
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

    function skipIterator(source, count) {
        assertNotNull(source);
        assertType(count, Number);

        var arr = asArray(source);

        if (arr !== null) {
            return new Iterable(buffer(arr).slice(count));
        }

        return new Iterable(function () {
            var it = iterator(source),
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
            var it = iterator(source),
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

        var arr = asArray(source);

        if (arr !== null) {
            return new Iterable(buffer(arr).slice(0, count));
        }

        return new Iterable(function () {
            var it = iterator(source),
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
            var it = iterator(source),
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

    function unionIterator(first, second, comparer) {
        assertNotNull(first);
        assertNotNull(second);

        return new Iterable(function () {
            var table = new HashTable(comparer),
                it1 = iterator(first),
                it2 = iterator(second),
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

    function zipIterator(first, second, resultSelector) {
        assertNotNull(first);
        assertNotNull(second);
        assertType(resultSelector, Function);

        return new Iterable(function () {
            var it1 = iterator(first),
                it2 = iterator(second),
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
                return aggregateIterator(this, func, resultSelector);
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
                return countIterator(this, predicate);
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
                return exceptIntersectIterator(this, second, false, comparer);
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
                return exceptIntersectIterator(this, second, true, comparer);
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
                return joinIterator(this, inner, outerKeySelector, innerKeySelector, comparer);
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
        return iterable(value);
    }



    mx.hash = hash;
    mx.hashSymbol = hashSymbol;
    mx.equals = equals;
    mx.equalsSymbol = equalsSymbol;
    mx.compare = compare;
    mx.compareSymbol = compareSymbol;
    mx.iteratorSymbol = iteratorSymbol;

    mx.empty = Iterable.empty;
    mx.range = Iterable.range;
    mx.repeat = Iterable.repeat;

    mx.Iterable = Iterable;
    mx.Iterator = Iterator;
    mx.Comparer = Comparer;
    mx.EqualityComparer = EqualityComparer;
    mx.Collection = Collection;
    mx.Lookup = Lookup;
    mx.version = '2.0.0';

    return mx;

}));

