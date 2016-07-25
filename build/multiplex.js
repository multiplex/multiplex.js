/*!
* Multiplex.js - Comprehensive data-structure and LINQ library for JavaScript.
* Version 2.0.0 (July 26, 2016)

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
            define(obj, _prop, {
                value: properties[_prop],
                writable: attributes.writable || false,
                enumerable: attributes.enumerable || false,
                configurable: attributes.configurable || false
            });
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

    var ERROR_ARRAY_SIZE = 'The number of elements in the source is greater than the number of elements that the destination array can contain.';

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

    var iteratorSymbol = (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') ?
        Symbol.iterator : '@@iterator';

    /**
    * Defines abstract Iterable class.
    * @param {Object} source An Iterable object.
    */
    function Iterable(source) {
        if (source != null) {
            this._source = source;
        }
    }

    Iterable.prototype[iteratorSymbol] = function () {
        return this._source[Symbol.iterator]();
    };

    mixin(Iterable.prototype, {
        toString: function () {
            return '[Iterable]';
        },

        valueOf: function () {
            return this._source;
        }
    });

    function isObject(obj) {
        return typeof obj === 'object';
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

    function extend(Type, Base) {
        if (isFunction(Object.create)) {
            Type.prototype = Object.create(Base.prototype);
        }
        else {
            var _ = function () { };
            _.prototype = Base.prototype;
            Type.prototype = new _();
        }

        Type.prototype.constructor = Type;
    }

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
    * Creates a new GeneratorIterable instance.
    * @param {Function|Function*} value A generator function.
    */
    function GeneratorIterable(value) {
        Iterable.call(this, value);
    }

    extend(GeneratorIterable, Iterable);

    GeneratorIterable.prototype[iteratorSymbol] = function () {
        return this.valueOf()();
    };

    mixin(GeneratorIterable.prototype, {
        toString: function () {
            return '[Generator Iterable]';
        }
    });

    /**
    * Creates a new EmptyIterable instance.
    */
    function EmptyIterable() {
    }

    extend(EmptyIterable, Iterable);

    EmptyIterable.prototype[iteratorSymbol] = function () {
        return new Iterator(function () {
            return { done: true };
        });
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
            return new GeneratorIterable(value);
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
            return typeof obj.getTime === 'function' ? obj.getTime() : 0;
        }
        else {
            return typeof obj.valueOf === 'function' ? obj.valueOf() : 0;
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
                return objB !== objB ? 0 : -1;
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
            var _res = objA.localeCompare(objB);
            return _res > 0 ? 1 : (_res < 0 ? -1 : 0);
        }

        // Compute overridden 'compare' method for Object types
        else if (typeof objA[compareSymbol] === 'function') {
            return objA[compareSymbol](objB);
        }

        // All other objects are compared using 'valudOf' method
        else {
            var _v1 = valueOf(objA),
                _v2 = valueOf(objB);

            return _v1 > _v2 ? 1 : (_v1 < _v2 ? -1 : 0);
        }
    }

    function isArray(val) {
        return val instanceof Array;
    }

    function isString(val) {
        return val != null && typeof val === 'string';
    }

    /**
    * Creates an iterator object
    * @param {Object} obj An object to create iterator from.
    */
    function iterator(obj) {
        return iterable(obj)[Symbol.iterator]();
    }

    /**
    * Buffers an Iterale object into an array.
    * @param {Iterale} value An Iterale object.
    * @returns {Array}
    */
    function buffer(value) {
        if (value == null) {                                // empty value
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

        var source = buffer(value),
            sourcelen = source.length,
            arraylen = array.length;

        if (index > arraylen || sourcelen > arraylen) {
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
        if (value != null) {
            Iterable.call(this, buffer(value));
        }
    }

    extend(Collection, Iterable);

    mixin(Collection.prototype, {
        /**
        * Gets the number of elements contained in the Collection.
        * @returns {Number}
        */
        count: function () {
            return (this.valueOf() || []).length;
        },

        /**
        * Copies the Collection to an existing one-dimensional Array, starting at the specified array index.
        * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Collection.
        * @param {Number} arrayIndex The zero-based index in array at which copying begins.
        */
        copyTo: function (array, arrayIndex) {
            bufferTo(this.valueOf() || [], array, arrayIndex);
        },

        /**
        * Creates an array of the elements from Collection.
        * @returns {Array}
        */
        toArray: function () {
            return (this.valueOf() || []).concat();
        },

        toString: function () {
            return '[Collection]';
        }
    });

    function select(source, selector) {
        assertType(selector, Function);

        return new Iterable(function () {
            var it = iterator(source),
                index = 0,
                result;

            return new Iterator(function () {
                if (!(result = it.next()).done) {
                    return {
                        value: selector(result.value, index++),
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
        });

        mixin(iterable.prototype, {
            select: function (selector) {
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
        return iterable(value);
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

