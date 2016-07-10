/*!
* Multiplex.js - Comprehensive data-structure and LINQ library for JavaScript.
* Version 2.0.0 (July 11, 2016)

* Created and maintained by Kamyar Nazeri <Kamyar.Nazeri@yahoo.com>
* Licensed under MIT License
* https://github.com/multiplex/multiplex.js
*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.mx = factory());
}(this, function () { 'use strict';

    var iteratorSymbol = (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') ?
        Symbol.iterator : '@@iterator';

    function error(msg) {
        throw new Error(msg);
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
    * Supports a simple iteration over an Iterable .
    * @param {Function} factory A function to yield the next item in the sequence.
    */
    function Iterator(factory) {
        assertType(factory, Function);
        this.next = factory;
    }

    function isFunc(fn) {
        return typeof fn === 'function';
    }

    var toString = Object.prototype.toString;
    var TypedArray = typeof Int8Array !== 'undefined' ? Object.getPrototypeOf(Int8Array) : function TypedArray() { };
    var NodeListType = typeof NodeList !== 'undefined' ? NodeList : function NodeList() { };

    function isArrayLike(obj) {
        if (
            typeof obj === 'string' ||                              // String
            obj instanceof Array ||                                 // Arrays
            obj instanceof TypedArray ||                            // typed-array
            obj instanceof NodeListType) {                          // NodeList: document.querySelectorAll
            return true;
        }
        else if (obj !== null &&
            typeof obj === 'object' &&
            typeof obj.length === 'number') {                       // Array-likes have 'length' property (excelude 'function' type)

            if (typeof obj.splice === 'function' ||                 // third party libraries. eg. jQuery
                toString.call(obj) === '[object Arguments]') {      // arguments
                return true;
            }
        }

        return false;
    }

    function iteratorFactory(obj) {
        obj = obj || [];


        /// iterable/generator function
        if (isFunc(obj)) {
            return obj();
        }


        // iterable: Array, String, Map, Set, NodeList, Arguments, Iterable objects
        else if (isFunc(obj[iteratorSymbol])) {
            return obj[iteratorSymbol]();
        }


        // array-like objects
        else if (isArrayLike(obj)) {
            var _index = -1,
                _length = obj.length;

            return new Iterator(function () {
                if (++_index < _length) {
                    return {
                        value: obj[_index],
                        done: false
                    };
                }

                return {
                    done: true
                };
            });
        }


        // Object.entries iterator
        else if (typeof obj === 'object') {
            var _index = -1,
                _keys = Object.keys(obj),
                _length = _keys.length;

            // [key, value] iterator
            return new Iterator(function () {
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


        // simple iterator over non-objects
        return iteratorFactory([obj]);
    }

    function Multiplex(obj) {
        this._iterable = obj;
    }

    Multiplex.prototype[iteratorSymbol] = function () {
        return iteratorFactory(this._iterable);
    };

    /**
    * Creates a new Multiplex instance.
    * @param {Multiplex|Iterable|Array|String|Function|Function*|Object} value An Multiplex object.
    * @returns {Multiplex}
    */
    function mx(value) {
        return value instanceof Multiplex ? value : new Multiplex(value);
    }

    function valueOf(obj) {
        if (obj instanceof Date) {
            return typeof obj.getTime === 'function' ? obj.getTime() : 0;
        }
        else {
            return typeof obj.valueOf === 'function' ? obj.valueOf() : 0;
        }
    }

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

    var hashSymbol = '__hash__';

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

            // Compute overriden 'hash' method
            else if (typeof obj.__hash__ === 'function') {
                _hash = obj.__hash__() >> 32;
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

            // Compute overriden 'equals' method for Object types
            else if (typeof objA.__eq__ === 'function') {
                return objA.__eq__(objB);
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

        // Compute overriden 'compare' method for Object types
        else if (typeof objA.__cmp__ === 'function') {
            return objA.__cmp__(objB);
        }

        // All other objects are compared using 'valudOf' method
        else {
            var _v1 = valueOf(objA),
                _v2 = valueOf(objB);

            return _v1 > _v2 ? 1 : (_v1 < _v2 ? -1 : 0);
        }
    }

    var compareSymbol = '__cmp__';

    mx.hash = hash;
    mx.hashSymbol = hashSymbol;
    mx.equals = equals;
    mx.equalsSymbol = equalsSymbol;
    mx.compare = compare;
    mx.compareSymbol = compareSymbol;
    mx.iteratorSymbol = iteratorSymbol;

    mx.Iterator = Iterator;
    mx.Multiplex = Multiplex;
    mx.version = '2.0.0';

    return mx;

}));

