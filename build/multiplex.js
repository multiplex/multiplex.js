/*!
* Multiplex.js - Comprehensive data-structure and LINQ library for JavaScript.
* Version 2.0.0 (July 04, 2016)

* Created and maintained by Kamyar Nazeri <Kamyar.Nazeri@yahoo.com>
* Licensed under Apache License Version 2.0
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
    class Iterator {
        constructor(factory) {
            assertType(factory, Function);
            this.next = factory;
        }
    }

    const iteratorSymbol = Symbol.iterator;

    const toString = Object.prototype.toString;
    const TypedArray = Object.getPrototypeOf(Int8Array);

    function isArrayLike(obj) {
        if (
            typeof obj === 'string' ||                              // String
            obj instanceof Array ||                                 // Arrays
            obj instanceof TypedArray ||                            // typed-array
            obj instanceof NodeList) {                              // NodeList: document.querySelectorAll
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

    class Multiplex {
        constructor(obj) {
            this._iterable = obj;
        }

        [iteratorSymbol]() {
            return iteratorFactory(this._iterable);
        }
    }


    function iteratorFactory(obj) {
        obj = obj || [];


        /// iterable/generator function
        if (typeof obj === 'function') {
            return obj();
        }


        // iterable: Array, String, Map, Set, NodeList, Arguments, Iterable objects
        else if (typeof obj[iteratorSymbol] === 'function') {
            return obj[iteratorSymbol]();
        }


        // array-like objects
        else if (isArrayLike(obj)) {
            let _index = -1,
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


        else {
            // simple iterator over non-objects
            if (typeof obj !== 'object') {
                return iteratorFactory([obj]);
            }

            let _index = -1,
                _keys = Object.keys(obj),
                _length = _keys.length;

            // key-value iterator
            return new Iterator(function () {
                if (++_index < _length) {
                    return {
                        value: {
                            key: _keys[_index],
                            value: obj[_keys[_index]]
                        },
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
    * Creates a new Multiplex instance.
    * @param {Multiplex|Iterable|Array|String|Function|Function*|Object} value An Multiplex object.
    * @returns {Multiplex}
    */
    function mx(value) {
        return value instanceof Multiplex ? value : new Multiplex(value);
    }

    const hashSymbol =  Symbol('hash');

    const POSITIVE_INFINITY = Number.POSITIVE_INFINITY || Infinity;
    const NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY || -Infinity;
    const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 0x1FFFFFFFFFFFFF;
    const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -0x1FFFFFFFFFFFFF;

    function compute31BitNumberHash(obj) {
        let _hash = 0;

        // integer number
        if (obj < MAX_SAFE_INTEGER && obj > MIN_SAFE_INTEGER && obj % 1 === 0) {
            return obj >> 32;
        }

        // non-integer numbers
        switch (obj) {
            case POSITIVE_INFINITY: _hash = 0x7F800000; break;
            case NEGATIVE_INFINITY: _hash = 0xFF800000; break;
            default:

                if (obj <= -0.0) {
                    _hash = 0x80000000;
                    obj = -obj;
                }

                let _exponent = Math.floor(Math.log(obj) / Math.log(2)),
                    _significand = ((obj / Math.pow(2, _exponent)) * 0x00800000) | 0;

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

    function compute31BitStringHash(obj) {
        let _hash = 0X7FFF,         // string hash seed
            _len = obj.length,
            _i = 0;

        for (; _i < _len;) {
            _hash = ((((_hash << 5) - _hash) | 0) + obj.charCodeAt(_i++)) | 0;
        }

        return _hash >> 32;
    }

    function compute31BitDateHash(obj) {
        let _time = obj.getTime();
        return _time ^ (_time >> 5);
    }

    function isObjectLiteral(obj) {
        return Object.getPrototypeOf(obj) === Object.prototype;
    }

    const __objectHashSeed = Math.floor(Math.random() * 0XFFFF) + 0XFFFF;
    const __objectHashMap = new WeakMap();
    let __objetHashIndex = __objectHashSeed;


    function compute31BitObjecHash(obj) {
        let _hash = __objectHashMap.get(obj);

        if (_hash == null) {
            if (isObjectLiteral(obj)) {
                _hash = __objectHashSeed;
                __objectHashMap.set(obj, 0);           // prevents recursion

                // only object literals fall into following code, no need to check for hasOwnProperty

                for (let _p in obj) {
                    // Josh Bloch hash method
                    _hash = ((17 * 31 + _hash) * 31 + compute31BitStringHash(_p) + hash(obj[_p])) >> 32;
                }
            }
            else {
                _hash = __objetHashIndex++ >> 32;
            }

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
        if (obj == null) {
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

            // Compute overriden 'hash' method
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
                // Josh Bloch hash method to combine 2 hash
                _hash = ((17 * 31 + _hash) * 31 + hash(rest[_i++])) >> 32;
            }
        }

        return _hash;
    }

    const equalsSymbol =  Symbol('equals');

    /**
    * Determines whether the specified object instances are considered equal.
    * @param {Object} objA The first object to compare.
    * @param {Object} objB The second object to compare.
    * @param {EqualityComparer=} comparer An equality comparer to compare values.
    * @returns {Boolean} if the objA parameter is the same instance as the objB parameter, or if both are null, or if objA.equals(objB) returns true; otherwise, false.
    */
    function equals(objA, objB, comparer = null) {
        // Objects are identical (including null)
        if (objA === objB) {
            return true;
        }

        // null is not equal to any object
        else if (objA == null || objB == null) {
            return false;
        }


        // compare using 'equalityComparer' provided
        if (comparer) {
            return comparer.hash(objA) === comparer.hash(objB) && comparer.equals(objA, objB);
        }


        // Objects check for equality for primitive types
        if (typeof objA === 'number' ||
            typeof objA === 'string' ||
            typeof objA === 'boolean') {
            return objA == objB;
        }

        else if (typeof objA === 'object') {
            // Objects are from 'Date' type
            if (objA instanceof Date) {
                return objB instanceof Date && objA.getTime() === objB.getTime();
            }

            // Compute overriden 'equals' method for Object types
            else if (typeof objA[equalsSymbol] === 'function') {
                return objA[equalsSymbol](objB);
            }

            // Object types
            else if (typeof objB === 'object') {
                // Objects having different hash code are not equal
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

            // Objects are equal (with auto type conversion)
            // Objects from the same type are considered equal (eg. new Number(1) and 1)
            return objA == objB;
        }


        // Objects are already not equal
        return false;
    }

    const compareSymbol = Symbol('compare');

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
        else if (objA == null) {
            return -1;
        }

        // Everything is greater than null or undefined
        else if (objB == null) {
            return 1;
        }
        else {
            // numbers compare using 'gt' operator
            if (typeof objA === 'number') {
                return Number.isNaN(objA) ? -1 :
                    Number.isNaN(objB) ? 1 :
                        objA > objB ? 1 : -1;
            }

            // booleans compare using 'gt' operator
            if (typeof objA === 'boolean') {
                return objA > objB ? 1 : -1;
            }

            // Strings are compared using String.prototype.localeCompare method
            else if (typeof objA === 'string') {
                return objA.localeCompare(objB);
            }

            else {
                try {
                    // Dates are compared using 'getTime' method
                    if (objA instanceof Date &&
                        objB instanceof Date) {
                        let _t1 = objA.getTime(),
                            _t2 = objB.getTime();

                        return _t1 > _t2 ? 1 : (_t1 < _t2 ? -1 : 0);
                    }

                    // Compute overriden 'compare' method for Object types
                    else if (typeof objA[compareSymbol] === 'function') {
                        return objA[compareSymbol](objB);
                    }

                    // All other objects are compared using 'valudOf' method
                    else {
                        let _v1 = typeof objA.valueOf === 'function' ? objA.valueOf() : 0,
                            _v2 = typeof objB.valueOf === 'function' ? objB.valueOf() : 0;

                        return _v1 > _v2 ? 1 : (_v1 < _v2 ? -1 : 0);
                    }
                }
                // in case 'getTime' or 'valueOf' throw error
                catch (e) {
                    return 0;
                }
            }
        }
    }

    mx.hash = hash;
    mx.hashSymbol = hashSymbol;
    mx.equals = equals;
    mx.equalsSymbol = equalsSymbol;
    mx.compare = compare;
    mx.compareSymbol = compareSymbol;
    mx.version = '2.0.0';

    return mx;

}));

