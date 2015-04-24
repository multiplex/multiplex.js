/*--------------------------------------------------------------------------
* Multiplex.js - Comprehensive data-structure and LINQ library for JavaScript.
* Ver 0.9.1 (March 28, 2015)
*
* Created and maintained by Kamyar Nazeri <Kamyar.Nazeri@yahoo.com>
* Licensed under Apache License Version 2.0
* https://github.com/multiplex/multiplex.js
*
*
* Lexical Note:
*   - Built-in types and Global variables: start with "__"
*   - Runtime functions, Helper functions: start with "$"
*   - Classes: start with a capital letter
*   - Class Alias: start with "__" and a capital letter
*   - Local scope variables: start with "_"
*
*--------------------------------------------------------------------------*/

(function (global) {
    "use strict";




    /* standard types 
    ---------------------------------------------------------------------- */
    var __typeFunction = "function",
        __typeObject = "object",
        __typeNumber = "number",
        __typeString = "string",
        __typeBoolean = "boolean",
        __typeSymbol = "symbol";




    /* built-in types
    ---------------------------------------------------------------------- */
    var __function = global.Function,
        __object = global.Object,
        __number = global.Number,
        __string = global.String,
        __boolean = global.Boolean,
        __array = global.Array,
        __error = global.Error,
        __math = global.Math,
        __date = global.Date,
        __weakmap = global.WeakMap,
        __symbol = global.Symbol,
        __undefined;






    /* Runtime Functions
    ---------------------------------------------------------------------- */



    /**
    * Determines whether an object is instance of a given type.
    * @param {Object} obj An object.
    * @param {Function} type The type to check.
    * @returns {Boolean}
    */
    function $is(obj, type) {

        switch (typeof obj) {
            case __typeNumber:
                return type === __number;

            case __typeString:
                return type === __string;

            case __typeFunction:
                return type === __function;

            case __typeBoolean:
                return type === __boolean;

            case __typeSymbol:
                return type === __symbol;

            default:
                return obj instanceof type;
        }
    }


    /**
    * Determines whether the specified object is a Function type.
    * @param {Object} fn The object to check.
    * @returns {Boolean}
    */
    function $isFunc(fn) {
        return typeof fn === __typeFunction;
    }


    /**
    * Returns a boolean indicating whether the object has the specified property.
    * @param {Object} obj An object.
    * @param {String} prop A property name.
    * @returns {Boolean}
    */
    function $has(obj, prop) {
        return $isFunc(obj.hasOwnProperty) ? obj.hasOwnProperty(prop) : prop in obj;
    }


    /**
    * Overwrites function "toString" method.
    * @param {Function} fn A Function instance.
    * @param {Function} fn Function's name.
    */
    function $funcStr(fn, name) {
        var _toString = "toString";

        if ($isFunc(fn) && !$has(fn, _toString) && name !== _toString) {
            var _str = "function " + name.toString() + (fn.toString().match(/\(.*?\)/) || [""])[0] + " {...}";
            $defineProperty(fn, _toString, { value: function () { return _str; } });
        }
    }


    /**
    * Defines new or modifies existing properties directly on the specified object, returning the object.
    * @param {Object} obj The object on which to define or modify properties.
    * @param {String} prop The name of the property to be defined or modified.
    * @param {PropertyDescriptor} attributes The descriptor for the property being defined or modified.
    * @returns {Object}
    */
    function $define(obj, prop, attributes) {
        $defineProperty(obj, prop, attributes);
        $funcStr(obj[prop], prop);
        return obj;
    }


    /**
    * Extends the given object by implementing supplied members.
    * @param {Object} obj The object on which to define or modify properties.
    * @param {Object} properties Represetnts the mixin source object
    * @param {PropertyDescriptor=} attributes The descriptor for the property being defined or modified.
    * @returns {Object}
    */
    function $mixin(obj, properties, attributes) {

        attributes = attributes || {};

        for (var _prop in properties) {
            if (!$has(obj, _prop)) {
                $define(obj, _prop, {
                    value: properties[_prop],
                    writable: attributes.writable || false,
                    enumerable: attributes.enumerable || false,
                    configurable: attributes.configurable || false,
                });
            }
        }

        return obj;
    }


    /**
    * Creates a new module with supplied members.
    * @param {Object} source The module object or the mixin source object.
    * @param {Object=} props Represetnts the mixin source object.
    * @returns {Object}
    */
    function $module(source, props) {
        var _source = props ? source : {},
            _props = props || source;

        if ($isFunc(_source)) {
            _source = $extend(_source);
        }

        return $freeze($mixin(_source, _props, { enumerable: true }));
    }


    /**
    * Extends the given type by inheriting from a superType and/or extending its prototype.
    * @param {Function} type The type to extend.
    * @param {Function|Object} extender The super-type or the prototype mixin object.
    * @param {Object=} members The prototype mixin object or a mixin source object to extend the type.
    * @param {Object=} staticMembers A mixin source object to extend the type.
    * @returns {Function}
    */
    function $extend(type, extender) {

        var _args = arguments,
            _super = $isFunc(extender) ? extender : null,
            _proto = _args.length === 4 || _super ? _args[2] : extender,
            _static = _args.length === 4 || _super ? _args[3] : _args[2],
            _str = type.name || type.toString().match(/function (.+)\(.*?\)/)[1];

        $funcStr(type, _str);

        if (_super) {
            var Super = function () { $define(this, "constructor", { value: type }); };
            Super.prototype = _super.prototype;
            type.prototype = new Super();
        }

        if (_proto) {
            $mixin(type.prototype, _proto);
        }

        if (_static) {
            $mixin(type, _static);
        }

        return type;
    }


    /**
    * Checks for an object to be null; if true throws an Error.
    */
    function $nullCheck(obj, name) {
        if (obj == null) {
            throw new __error("Value cannot be null. Parameter name: " + name);
        }
    }


    /**
    * Checks for an object to be of the specified type; if not throws an Error.
    */
    function $ensureType(obj, name, type) {
        $nullCheck(type, "type");

        if (!$is(obj, type)) {
            throw new __error("Invalid parameter type. Expected type: " + type.toString().match(/^function (.+)\(/)[1] + ". Parameter name: " + name);
        }
    }


    /**
    * Creates A function expression from the specified string lambda expression
    * @param {String} exp String lambda expression.
    * @returns {Function}
    */
    function $lambda(exp) {
        switch (typeof exp) {

            case __typeFunction:
                return exp;

            case __typeString:
                var _pattern = /^\s*\(?\s*(([a-z_$]{1}[a-z0-9_$]*)+([, ]+[a-z_$]{1}[a-z0-9_$]*)*)*\s*\)?\s*=>\s*(.*)$/i;
                if (_pattern.test(exp)) {
                    var _match = exp.match(_pattern);
                    return new __function((_match[1] || "").replace(/ /g, ""), "return " + _match[4]);
                }

                throw new __error("Cannot parse supplied `. " + exp);

            default:
                return null;

        }
    }


    /**
    * Gets and combines hash code for the given parameters, calls the overridden "hash" method when available.
    * @param {...Object} objs Optional number of objects to combine their hash codes.
    * @returns {Number} A hash code identified by the given parameters.
    */
    function $hash(objs) {
        if (arguments.length === 1) {
            return $computeHash(objs, true);
        }
        else {
            var _args = arguments,
            _len = _args.length,
            _hash = $computeHash(_args[0], true),
            _i = 0;

            while (++_i < _len) {
                _hash = (17 * 31 + _hash) * 31 + $computeHash(_args[_i], true);
            }

            return _hash;
        }
    }


    /**
    * Determines whether the specified object instances are considered equal. calls the overridden "equals" method when available.
    * @param {Object} objA The first object to compare.
    * @param {Object} objB The second object to compare.
    * @param {EqualityComparer=} comparer An equality comparer to compare values.
    * @returns {Boolean} true if the objA parameter is the same instance as the objB parameter, or if both are null, or if objA.equals(objB) returns true; otherwise, false.
    */
    function $equals(objA, objB, comparer) {
        if ($is(comparer, __EqualityComparer)) {
            if (objA === objB) {
                return true;                                            // Objects are identical (including null)
            }

            else if (objA == null || objB == null) {
                return false;
            }

            else {
                return comparer.hash(objA) === comparer.hash(objB) && comparer.equals(objA, objB);
            }
        }
        else {
            return $computeEquals(objA, objB, true);
        }
    }


    /**
    * Defines a new property directly on an object, or modifies an existing property on an object, and returns the object
    */
    var $defineProperty = $isFunc(__object.defineProperty) ? __object.defineProperty : function (obj, prop, attr) {
        obj[prop] = attr.get ? attr.get.apply(obj) : attr.value;
    };


    /**
    * Freezes an object, makes the object effectively immutable.
    */
    var $freeze = $isFunc(__object.freeze) ? __object.freeze : function (o) {
        return o;
    };


    /**
    * Serves as a hash function for a particular type, suitable for use in hashing algorithms and data structures such as a hash table.
    */
    var $computeHash = (function (useWeakMap) {

        var _lower31BitMask = 0X7FFFFFFF,
            _hashSeed = __math.floor(__math.random() * 0X7FFF) + 0X7FFF,
            _hashIndex = _hashSeed,
            _hashSymbol = "__hash__";


        /**
        * Serves as a hash function for a particular type, suitable for use in hashing algorithms and data structures such as a hash table.
        * @param {Object} obj An object to retrieve the hash code for.
        * @param {Boolean} override When true, uses the overriden __hash__ function if it is defined.
        * @returns {Number}
        */
        function computeHash(obj, override) {
            if (obj == null) {                      // null/undefined hash is 0
                return 0;
            }

            switch (typeof obj) {
                case __typeNumber:
                    return compute31BitNumberHash(obj);                 // Compute "Number" primitive type hash (does not incluede "new Number(value)")

                case __typeString:
                    return compute31BitStringHash(obj);                 // Compute "String" primitive type hash (does not incluede "new String(value)")

                case __typeBoolean:
                    return obj ? 1 : 0;                                 // Compute "Boolean" primitive type hash (does not incluede "new Boolean(value)")

                default:

                    if (obj instanceof __date) {
                        return compute31BitDateHash(obj);               // Compute "Date" object type hash
                    }

                    else if (override && $isFunc(obj.__hash__)) {
                        return obj.__hash__(obj);                       // Compute overriden "Object" hash
                    }

                    else {
                        return compute31BitObjecHash(obj);             // Compute "Object" type hash for all other types
                    }
            }
        }


        /// Creates a new HashCode by combining the given hash codes.
        function combineHashCodes(h1, h2) {
            return (17 * 31 + h1) * 31 + h2;
        }


        /// Creates a HashCode for a String object.
        function compute31BitStringHash(obj) {
            var _hash = _hashSeed,
                _len = obj.length,
                _index = 0;

            for (; _index < _len; _index++) {
                _hash = ((((_hash << 5) - _hash) | 0) + obj.charCodeAt(_index)) | 0;
            }

            return _hash & _lower31BitMask;
        }


        /// Creates a HashCode for a Number.
        function compute31BitNumberHash(obj) {
            var _hash = 0;

            if (obj % 1 === 0) {            // integer number
                _hash = obj >> 32;
            }

            else {                          // decimal number
                switch (obj) {
                    case __number.POSITIVE_INFINITY: _hash = 0x7F800000; break;
                    case __number.NEGATIVE_INFINITY: _hash = 0xFF800000; break;
                    case +0.0: _hash = 0x40000000; break;
                    case -0.0: _hash = 0xC0000000; break;
                    default:

                        if (obj <= -0.0) {
                            _hash = 0x80000000;
                            obj = -obj;
                        }

                        var _exponent = __math.floor(__math.log(obj) / __math.log(2)),
                            _significand = ((obj / __math.pow(2, _exponent)) * 0x00800000) | 0;

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
            }
            return _hash & _lower31BitMask;
        }


        /// Creates a HashCode for a Date object.
        function compute31BitDateHash(obj) {
            var _time = obj.getTime();
            return _time ^ (_time >> 5);
        }


        /// Creates and stores a HashCode for an object.
        /// When "useWeakMap" is true uses WeakMap as an internal hash storage whenever possible.
        var compute31BitObjecHash = (function () {
            if (useWeakMap && $isFunc(__weakmap)) {
                var _map = new __weakmap();

                return function (obj) {
                    var _hash = _map.get(obj);

                    if (_hash == null) {

                        if (isObjectLiteral(obj)) {

                            _hash = _hashSeed;
                            _map.set(obj, 0);           // prevents recursion

                            // only object literals fall into following code, no need to check for hasOwnProperty

                            for (var _p in obj) {
                                _hash = combineHashCodes(_hash, combineHashCodes(compute31BitStringHash(_p), computeHash(obj[_p], true)));
                            }

                            _hash = _hash & _lower31BitMask;
                        }
                        else {
                            _hash = _hashIndex++ >> 32;
                        }

                        _map.set(obj, _hash);
                    }

                    return _hash;
                };
            }
            else {
                return function (obj) {

                    var _hash = 0;

                    if (typeof obj.__hash__ !== __typeFunction || typeof (_hash = obj.__hash__()) !== __typeNumber) {
                        obj.__hash__ = function () { return _hash; };      // prevents recursion;

                        if (isObjectLiteral(obj)) {

                            _hash = _hashSeed;

                            // only object literals fall into following code, no need to check for hasOwnProperty

                            for (var _p in obj) {
                                if (_p === _hashSymbol) {
                                    continue;
                                }
                                _hash = combineHashCodes(_hash, combineHashCodes(compute31BitStringHash(_p), computeHash(obj[_p], true)));
                            }

                            _hash = _hash & _lower31BitMask;
                        }
                        else {
                            _hash = _hashIndex++ >> 32;
                        }
                    }

                    return _hash;
                };
            }
        })();


        /// Detects if an object is direct child of Object class (ie. object literal)
        var isObjectLiteral = (function () {
            var _proto = __object.prototype,
                _prototype = __object.getPrototypeOf;

            if ($isFunc(_prototype)) {
                return function (obj) { return _prototype(obj) === _proto; };
            }

            return function (obj) { return obj.constructor.prototype === _proto; };
        })();


        /// Define "__hash__" function for built-in types
        $define(__date.prototype, _hashSymbol, { value: function () { return compute31BitDateHash(this); } });
        $define(__number.prototype, _hashSymbol, { value: function () { return compute31BitNumberHash(this.valueOf()); } });
        $define(__string.prototype, _hashSymbol, { value: function () { return compute31BitStringHash(this.valueOf()); } });
        $define(__boolean.prototype, _hashSymbol, { value: function () { return this.valueOf() === true ? 1 : 0; } });
        $define(__object.prototype, _hashSymbol, { value: function () { return compute31BitObjecHash(this); } });


        return computeHash;
    })(true);


    /**
    * Determines whether the specified object instances are considered equal.
    */
    var $computeEquals = (function () {

        var _equalsSymbol = "__equals__";


        /** 
        * Determines whether the specified object instances are considered equal.
        * @param {Object} objA The first object to compare.
        * @param {Object} objB The second object to compare.
        * @param {Boolean} override When true, uses the overriden __equals__ function if it is defined.
        * @returns {Boolean} 
        */
        function computeEquals(objA, objB, override) {
            if (objA === objB) {
                return true;                                            // Objects are identical (including null)
            }

            else if (objA == null || objB == null) {
                return false;                                           // null is not equal to any object
            }

            switch (typeof objA) {
                case __typeNumber:                                      // NaN is not equal to NaN
                case __typeString:
                case __typeBoolean:
                    return objA == objB;                                // Objects check for equality

                case __typeObject:

                    if (objA instanceof __date) {
                        return computeDateEquals(objA, objB);           // Objects are from "Date" type
                    }

                    else if (override && $isFunc(objA.__equals__)) {
                        return objA.__equals__(objB);                   // Overriden "equals" method for Object types
                    }


                    else {
                        return computeObjectEquals(objA, objB);        // Object types
                    }

                    break;

                default:
                    return false;                                       // Objects are already not equal
            }
        }


        /// Compares Date objects by their time
        function computeDateEquals(objA, objB) {
            return objB instanceof __date && objA.getTime() === objB.getTime();
        }


        /// Compares Primitive objects
        function computePrimitiveEquals(objA, objB) {
            return objA.valueOf() == objB;
        }


        /// Compares Object types by their Hash code and Properties 
        function computeObjectEquals(objA, objB) {

            if (typeof objB === __typeObject) {

                if ($computeHash(objA) !== $computeHash(objB)) {        // Objects having different hash code are not equal
                    return false;
                }


                /// Process equality for object literals:
                /// object literals may have equal hash code, we process equality by each property.
                /// regular "class" instances have different hash code, hence do not fall into following code.
                /// object objA is direct descendant of Object hence no need to check "hasOwnProperty"

                for (var _prop in objA) {
                    if (!$computeEquals(objA[_prop], objB[_prop])) {
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


        /// Define "__equals__" function for built-in types
        $define(__date.prototype, _equalsSymbol, { value: function (obj) { return computeDateEquals(this, obj); } });
        $define(__number.prototype, _equalsSymbol, { value: function (obj) { return computePrimitiveEquals(this, obj); } });
        $define(__string.prototype, _equalsSymbol, { value: function (obj) { return computePrimitiveEquals(this, obj); } });
        $define(__boolean.prototype, _equalsSymbol, { value: function (obj) { return computePrimitiveEquals(this, obj); } });
        $define(__object.prototype, _equalsSymbol, { value: function (obj) { return computeObjectEquals(this, obj); } });


        return computeEquals;
    })();


    /**
    * Performs a comparison of two objects of the same type and returns a value indicating whether one object is less than, equal to, or greater than the other.
    */
    var $computeCompare = (function () {

        /**
        * Performs a comparison of two objects of the same type and returns a value indicating whether one object is less than, equal to, or greater than the other.
        * @param {Object} objA The first object to compare.
        * @param {Object} objB The second object to compare.
        * @returns {Number} 
        */
        function computeCompare(objA, objB) {
            if (objA === objB) {                                // Identical objects
                return 0;
            }
            else if (objA == null) {                            // null or undefined is less than everything
                return -1;
            }
            else if (objB == null) {                            // Everything is greater than null or undefined
                return 1;
            }
            else if (typeof objA !== typeof objB) {             // Object is considered less than another from different type
                return -1;
            }

            switch (typeof objA) {
                case __typeString:
                    return objA.localeCompare(objB);            // Strings are compared using String.prototype.localeCompare method

                default:
                    var r = objA - objB;                        // Numbers, Booleans, Dates and Objects are compared using "-" operator
                    if (!isNaN(r)) {                            // only when "-" operator returns a number
                        return r > 0 ? 1 : (r < 0 ? -1 : 0);    // 1: objA > objB, -1: objA < objB, 0: objA = objB
                    }

                    else if ($isFunc(objA.localeCompare)) {
                        return objA.localeCompare(objB);        // Strings objects are compared using String.prototype.localeCompare method
                    }

                    else {
                        return 0;                              // Objects are considered equal after all
                    }
            }
        }

        return computeCompare;
    })();





    /* Classes
    ---------------------------------------------------------------------- */


    /**
    * Supports a simple iteration over a collection.
    */
    var __Enumerator = (function () {

        /**
        * Supports a simple iteration over a collection.
        * @param {Function} factory A function to yield the next item in the sequence.
        */
        function Enumerator(factory) {

            var _next = false,
                _current = __undefined,
                _yielder = function (val) {
                    _next = true;
                    return _current = val;
                };


            $ensureType(factory, "factory", __function);
            $define(this, "next", {

                /**
                * Advances the enumerator to the next element of the collection.
                * @returns {Boolean}
                */
                value: function () {
                    _current = __undefined;     // reset "current"
                    _next = false;              // reset "next"

                    factory(_yielder);
                    this.current = _current;

                    return _next;
                }
            });


            /** 
            * current Gets the element in the collection at the current position of the enumerator. 
            * @prop {Object}
            */
            this.current = _current;
        }

        return Enumerator;
    })();


    /**
    * Exposes the enumerator, which supports a simple iteration over a collection of a specified type.
    */
    var __Enumerable = (function () {

        var _iteratorSymbol = $isFunc(__symbol) && $is(__symbol.iterator, __symbol) ? __symbol.iterator : "@@iterator",
            _generatorFunction = (function () {
                try { return eval("(function*() {}).constructor"); }
                catch (e) { return function () { }; }
            })();


        /**
        * Exposes the enumerator, which supports a simple iteration over a collection of a specified type.
        * @param {Enumerable|Iterable|Function|Object} obj An Enumerable object.
        */
        function Enumerable(obj) {

            return $define(this, "__enumerator__", { value: EnumeratorFactory(obj) });
        }


        /**
        * Creates an Enumerator factory function which supports a simple iteration over a collection.
        */
        function EnumeratorFactory(obj) {
            obj = obj || [];


            /// Enumerable object
            if ($is(obj, __Enumerable)) {
                return function () {
                    return obj.getEnumerator();
                };
            }



            /// ES6/Legacy generator function
            if ($isFunc(obj)) {
                return obj instanceof _generatorFunction ? EnumeratorFactory(obj()) : obj;
            }



            /// Array-like: String, Array, arguments, jQuery
            if ($is(obj, __array) || $is(obj, __string) || $is(obj.length, __number)) {
                return function () {
                    var _index = -1,
                        _length = obj.length;

                    return new __Enumerator(function (yielder) {
                        if (++_index < _length) {
                            return yielder(obj[_index]);
                        }
                    });
                };
            }



            /// ES6 Iterable object: Map, Set and Iterable objects
            if ($isFunc(obj[_iteratorSymbol])) {
                return function () {
                    var _iterator = obj[_iteratorSymbol](),
                        _next;

                    return new __Enumerator(function (yielder) {
                        if (!(_next = _iterator.next()).done) {
                            return yielder(_next.value);
                        }
                    });
                };
            }



            /// Enumerator object
            if ($isFunc(obj.getEnumerator)) {
                return function () {
                    return obj.getEnumerator();
                };
            }



            /// Regular object
            return function () {

                if (typeof obj !== __typeObject) {
                    return EnumeratorFactory([obj]);
                }


                /// extra function, prevents "_keys" closure
                var _keys = [];
                for (var _key in obj) {
                    _keys.push(_key);
                }


                return function () {
                    var _index = -1,
                        _length = _keys.length;

                    return new __Enumerator(function (yielder) {

                        if (++_index < _length) {
                            return yielder(new __KeyValuePair(_keys[_index], obj[_keys[_index]]));
                        }
                    });
                };
            }();
        }


        /// define ES6 iterator symbol
        $define(Enumerable.prototype, _iteratorSymbol, {
            value: function () {
                var _e = this.getEnumerator();
                return {
                    next: function () {
                        return { done: !_e.next(), value: _e.current };
                    }
                };
            }
        });


        return $extend(Enumerable,
        {
            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                return this.__enumerator__();
            }
        },
        {
            /**
            * Returns an empty Enumerable.
            * @returns {Enumerable}
            */
            empty: function () {
                return new __Enumerable([]);
            },

            /**
            * Detects if an object is Enumerable.
            * @param {Object} obj An object to check its Enumerability.
            * @returns {Boolean}
            */
            is: function (obj) {
                if (obj == null) {
                    return false;
                }

                if ($is(obj, __Enumerable) ||                                   /// Enumerable
                    $is(obj, __array) ||                                        /// Array
                    $is(obj, __string) ||                                       /// String
                    $isFunc(obj.getEnumerator) ||                               /// Enumerable-like
                    $isFunc(obj[_iteratorSymbol]) ||                            /// Iterable
                    obj instanceof _generatorFunction ||                        /// ES6 Generator Function
                    ($is(obj.length, __number) && $isFunc(obj.splice))) {       /// Array-like
                    return true;
                }

                return false;
            },

            /**
            * Generates a sequence of integral numbers within a specified range.
            * @param {Number} start The value of the first integer in the sequence.
            * @param {Number} count The number of sequential integers to generate.
            * @returns {Enumerable}
            */
            range: function (start, count) {
                $ensureType(start, "start", __number);
                $ensureType(count, "count", __number);

                var _max = start + count - 1;

                if (count < 0 || _max > __number.MAX_VALUE) {
                    throw new __error("Argument 'count' was out of the range of valid values");
                }

                return new __Enumerable(function () {
                    var _index = -1;

                    return new __Enumerator(function (yielder) {
                        if (++_index < count) {
                            return yielder(start + _index);
                        }
                        else {
                            _index = -1;
                        }
                    });
                });
            },

            /**
            * Generates a sequence that contains one repeated value.
            * @param {Object} element The value to be repeated.
            * @param {Number} count The number of times to repeat the value in the generated sequence.
            * @returns {Enumerable}
            */
            repeat: function (element, count) {
                $ensureType(count, "count", __number);

                if (count < 0) {
                    throw new __error("Argument 'count' was out of the range of valid values");
                }

                return new __Enumerable(function () {
                    var _index = count;

                    return new __Enumerator(function (yielder) {
                        if (_index-- > 0) {
                            return yielder(element);
                        }
                        else {
                            _index = count;
                        }
                    });
                });
            }
        });

    })();


    /**
    * Provides a base class for implementations of Comparer.
    */
    var __Comparer = (function () {


        function Comparer(comparison) {
            $ensureType(comparison, "comparison", __function);
            $define(this, "_comparison", { value: comparison });
        }

        return $extend(Comparer,
        {
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
                return this._comparison(objA, objB);
            }
        },
        {

            /**
            * Gets a default sort order comparer for the type specified by the generic argument.
            */
            'default': new Comparer($computeCompare),


            /**
            * Creates a comparer by using the specified comparison.
            * @param {Function} comparison The comparison function.
            * @returns {Comparer}
            */
            create: function (comparison) {
                return new __Comparer(comparison);
            }
        });
    })();


    /**
    * Provides a base class for implementations of the EqualityComparer.
    */
    var __EqualityComparer = (function () {

        function EqualityComparer(hashCodeProvider, equality) {

            $ensureType(equality, "equality", __function);
            $ensureType(hashCodeProvider, "hashCodeProvider", __function);

            $define(this, "_equality", { value: equality });
            $define(this, "_hashCodeProvider", { value: hashCodeProvider });
        }


        return $extend(EqualityComparer,
        {
            /**
            * Determines whether the specified objects are equal.
            * @param {Object} x The first object of type Object to compare.
            * @param {Object} y The second object of type Object to compare.
            * @returns true if the specified objects are equal; otherwise, false.
            */
            equals: function (x, y) {
                return this._equality(x, y);
            },

            /**
            * Returns a hash code for the specified object.
            * @param {Object} obj The Object for which a hash code is to be returned.
            * @returns A hash code for the specified object.
            */
            hash: function (obj) {
                return this._hashCodeProvider(obj);
            }
        },
        {

            /**
            * Gets a default equality comparer for the type specified by the generic argument.
            */
            'default': new EqualityComparer($hash, $equals),

            /**
            * Creates an EqualityComparer by using the specified equality and hashCodeProvider.
            * @param {Function} hashCodeProvider The hashCodeProvider to use for a hash code is to be returned. eg. function(obj): Number
            * @param {Function} equality The equality function.
            * @returns {EqualityComparer}
            */
            create: function (hashCodeProvider, equality) {
                return new __EqualityComparer(hashCodeProvider, equality);
            }
        });

    })();


    /**
    * Provides an abstract base class for a strongly typed collection.
    */
    var __Collection = (function () {

        /**
        * Initializes a new instance of the abstract Collection class.
        */
        function Collection() {
        }


        return $extend(Collection, __Enumerable, {
            /**
            * Gets the number of elements contained in the Collection.
            * @returns {Number}
            */
            count: function () {
                /// implemented in sub-classes
                throw new __error("Not implemented");
            },

            /**
            * Copies the Collection to an existing one-dimensional Array, starting at the specified array index.
            * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Dictionary keys.
            * @param {Number} arrayIndex The zero-based index in array at which copying begins.
            */
            copyTo: function (array, arrayIndex) {
                $bufferTo(this, array, arrayIndex);
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                /// implemented in sub-classes
                throw new __error("Not implemented");
            },
        });
    })();


    /**
    * Provides the base class for a read-only collection.
    */
    var __ReadOnlyCollection = (function () {

        /**
        * Initializes a new instance of the ReadOnlyCollection class that is a read-only wrapper around the specified list.
        * @param {List} list The list to wrap.
        */
        function ReadOnlyCollection(list) {

            $ensureType(list, "list", __List);
            $define(this, "length", { get: function () { return list.length; } });
            $define(this, "items", { value: function () { return list; } });

            for (var i = 0, _len = list.count() ; i < _len; i++) {
                this[i] = list[i];
            }

            $freeze(this);
        }

        return $extend(ReadOnlyCollection, __Collection, {

            splice: function () { },

            /**
            * Gets the element at the specified index.
            * @param {Number} index The zero-based index of the element to get.
            * @returns {Object}
            */
            get: function (index) {
                return this.items().get(index);
            },

            /**
            * Gets the number of elements contained in the ReadOnlyCollection.
            * @returns {Number}
            */
            count: function () {
                return this.length;
            },

            /**
            * Determines whether the ReadOnlyCollection contains a specific value.
            * @param {Object} item The object to locate in the ReadOnlyCollection.
            * @returns {Boolean}
            */
            contains: function (item) {
                return this.indexOf(item) !== -1;
            },

            /**
            * Copies the elements of the ReadOnlyCollection to an Array, starting at a particular Array index.
            * @param {Array} array The one-dimensional Array that is the destination of the elements copied from ReadOnlyCollection.
            * @param {Number} arrayIndex The zero-based index in array at which copying begins.
            */
            copyTo: function (array, arrayIndex) {
                this.items().copyTo(array, arrayIndex);
            },

            /**
            * Searches for the specified object and returns the zero-based index of the first occurrence within the entire ReadOnlyCollection.
            * @param {Object} item The object to locate in the ReadOnlyCollection.
            * @returns {Number}
            */
            indexOf: function (item) {
                return this.items().indexOf(item);
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                return $enumerator(this.items());
            }
        });
    })();


    /**
    * Represents a strongly typed list of objects that can be accessed by index.
    */
    var __List = (function () {

        /**
        * Initializes a new instance of the List class.
        * @param {Number|Enumerable|...Object=} value  The number of elements, Arbitrary number of arguments or the collection whose elements are copied to the new list.
        */
        function List(value) {

            var _args = arguments,
                _capacity = 0;

            $define(this, "length", {
                get: function () {
                    return _capacity;
                },
                set: function (value) {
                    $ensureType(value, "length", __number);

                    var _len = _capacity;
                    _capacity = __math.max(value, 0);

                    if (_capacity < _len) {
                        do {
                            delete this[_len];
                        }
                        while (_len-- < _capacity);
                    }
                }
            });

            if (_args.length === 1 && value !== null) {

                /// capacity
                if ($is(value, __number)) {
                    _capacity = value;
                }

                else if (__Enumerable.is(value) && !$is(value, __string)) {
                    this.addRange(value);
                }

                else {
                    this.add(value);
                }
            }
            else {
                this.addRange(_args);
            }
        }

        return $extend(List, __Collection, {

            /**
            * Adds an object to the end of the List.
            * @param {Object} item The object to be added to the end of the List.
            */
            add: function (item) {
                this[this.length] = item;
                this.length++;
            },

            /**
            * Adds the elements of the specified collection to the end of the List.
            * @param {Enumerable} collection The collection whose elements should be added to the end of the List.
            */
            addRange: function (collection) {
                $nullCheck(collection, "collection");
                this.insertRange(this.length, collection);
            },

            /**
            * Returns a read-only wrapper for the current list.
            * @returns {ReadOnlyCollection}
            */
            asReadOnly: function () {
                return new __ReadOnlyCollection(this);
            },

            /**
            * Searches a range of elements in the sorted List for an element using the specified comparer and returns the zero-based index of the element.
            * @param {Object} item The object to locate. The value can be null for reference types.
            * @param {Number=} index The zero-based starting index of the range to search.
            * @param {Number=} count The length of the range to search.
            * @param {Comparer=} comparer The Comparer implementation to use when comparing elements.
            * @returns {Number}
            */
            binarySearch: function (item) {
                var _args = arguments,
                    _index = $is(_args[1], __number) ? _args[1] : 0,
                    _count = $is(_args[1], __number) ? _args[2] : this.length,
                    _comparer = $comparer(_args.length === 4 ? _args[3] : _args[2]),
                    _lo = _index,
                    _hi = _index + _count - 1;


                while (_lo <= _hi) {
                    var i = _lo + ((_hi - _lo) >> 1);
                    var _order = _comparer.compare(this[i], item);

                    if (_order === 0) {
                        return i;
                    }

                    if (_order < 0) {
                        _lo = i + 1;
                    }
                    else {
                        _hi = i - 1;
                    }
                }

                return ~_lo;
            },

            /**
            * Removes all items from the List.
            */
            clear: function () {
                this.length = 0;
            },

            /**
            * Gets the number of elements contained in the List.
            * @returns {Number}
            */
            count: function () {
                return this.length;
            },

            /**
            * Determines whether the List contains a specific value.
            * @param {Object} item The object to locate in the List.
            * @returns {Boolean}
            */
            contains: function (item) {
                return this.items().indexOf(item) !== -1;
            },

            /**
            * Copies the elements of the List to an Array, starting at a particular Array index.
            * @param {Array} array The one-dimensional Array that is the destination of the elements copied from List.
            * @param {Number} arrayIndex The zero-based index in array at which copying begins.
            */
            copyTo: function (array, arrayIndex) {
                $bufferTo(this.items(), array, arrayIndex);
            },

            /**
            * Determines whether the List contains elements that match the conditions defined by the specified predicate.
            * @param {Function} match The predicate function that defines the conditions of the elements to search for. eg. function(item)
            * @returns {Boolean}
            */
            exists: function (match) {
                match = $lambda(match);
                $ensureType(match, "match", __function);

                for (var i = 0, _len = this.length; i < _len; i++) {
                    if (match(this[i]) === true) {
                        return true;
                    }
                }

                return false;
            },

            /**
            * Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire List.
            * @param {Function} match The predicate function that defines the conditions of the elements to search for. eg. function(item)
            * @returns {Object}
            */
            find: function (match) {
                match = $lambda(match);
                $ensureType(match, "match", __function);

                for (var i = 0, _len = this.length; i < _len; i++) {
                    if (match(this[i]) === true) {
                        return this[i];
                    }
                }

                return null;
            },

            /**
            * Retrieves all the elements that match the conditions defined by the specified predicate.
            * @param {Function} match The predicate function that defines the conditions of the elements to search for. eg. function(item)
            * @returns {List}
            */
            findAll: function (match) {
                match = $lambda(match);
                $ensureType(match, "match", __function);

                var _arr = new __array(this.length),
                    _count = 0;

                for (var i = 0, _len = this.length; i < _len; i++) {
                    if (match(this[i]) === true) {
                        _arr[_count++] = this[i];
                    }
                }

                return new __List(_arr.slice(0, _count));
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
            findIndex: function () {
                var _args = arguments,
                    _len = this.length,
                    _startIndex = $is(_args[0], __number) ? _args[0] : 0,
                    _count = $is(_args[1], __number) ? _args[1] : _len - _startIndex,
                    _match = $lambda(_args[_args.length - 1]);

                $ensureType(_match, "match", __function);
                validateRange(this, _startIndex);

                while (_count-- > 0 && _startIndex < _len) {
                    if (_match(this[_startIndex]) === true) {
                        return _startIndex;
                    }

                    _startIndex++;
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
                match = $lambda(match);
                $ensureType(match, "match", __function);

                var _len = this.length;
                while (_len-- > 0) {
                    if (match(this[_len]) === true) {
                        return this[_len];
                    }
                }

                return null;
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
            findLastIndex: function () {
                var _args = arguments,
                    _startIndex = $is(_args[0], __number) ? _args[0] : this.length - 1,
                    _count = $is(_args[1], __number) ? _args[1] : _startIndex,
                    _match = $lambda(_args[_args.length - 1]);

                $ensureType(_match, "match", __function);
                validateRange(this, _startIndex);

                while (_count-- > 0 && _startIndex > 0) {
                    if (_match(this[_startIndex]) === true) {
                        return _startIndex;
                    }

                    _startIndex--;
                }

                return -1;
            },

            /**
            * Performs the specified action on each element of the List.
            * @param {Function} action The action function to perform on each element of the List. eg. function(item)
            */
            forEach: function (action) {
                action = $lambda(action);
                $ensureType(action, "action", __function);

                for (var i = 0, _len = this.length; i < _len; i++) {
                    action(this[i]);
                }
            },

            /**
            * Gets the element at the specified index.
            * @param {Number} index The zero-based index of the element to get.
            * @returns {Object}
            */
            get: function (index) {
                validateRange(this, index);
                return this[index];
            },

            /**
            * Creates a shallow copy of a range of elements in the source List.
            * @param {Number} index The zero-based List index at which the range starts.
            * @param {Number} count The number of elements in the range.
            * @returns {List}
            */
            getRange: function (index, count) {
                validateRange(this, index + count - 1);
                return new __List(this.slice(index, index + count));
            },

            /**
            *   Searches for the specified object and returns the zero-based index of the first occurrence within 
            *   the range of elements in the List that extends from the specified index to the last element.
            *   @param {Object} item The object to locate in the List.
            *   @param {Number=} index The zero-based starting index of the search. 0 (zero) is valid in an empty list.
            *   @returns {Number}
            */
            indexOf: [].indexOf,

            /**
            * Inserts an element into the List at the specified index.
            * @param {Number} index The zero-based index at which item should be inserted.
            * @param {Object} item The object to insert. The value can be null for reference types.
            */
            insert: function (index, item) {

                if (index !== this.length) {
                    validateRange(this, index);
                }

                var _len = ++this.length;

                while (_len-- > index) {
                    this[_len] = this[_len - 1];
                }

                this[index] = item;
            },

            /**
            * Inserts the elements of a collection into the List at the specified index.
            * @param {Number} index The zero-based index at which item should be inserted.
            * @param {Enumerable} collection The collection whose elements should be inserted into the List.
            */
            insertRange: function (index, collection) {
                $ensureType(index, "index", __number);
                $nullCheck(collection, "collection");

                if (index !== this.length) {
                    validateRange(this, index);
                }

                var _arr = $buffer(collection),
                    _count = _arr.length,
                    _len = this.length + _count;

                this.length = _len;

                while (_len-- > index) {
                    this[_len] = this[_len - _count];
                }

                while (_count-- > 0) {
                    this[index + _count] = _arr[_count];
                }
            },

            /**
            * Gets an Array wrapper around the List.
            * @returns {Array}
            */
            items: function () {
                return this.slice();
            },

            /**
            *   Searches for the specified object and returns the zero-based index of the last occurrence 
            *   within the range of elements in the List that extends from the specified index to the last element.
            *   @param {Object} item The object to locate in the List. 
            *   @param {Number=} index The zero-based starting index of the search. 0 (zero) is valid in an empty list.
            *   @returns {Number}
            */
            lastIndexOf: [].lastIndexOf,

            /**
            * Removes the first occurrence of a specific object from the List.
            * @param {Object} item The object to remove from the List.
            * @returns {Boolean}
            */
            remove: function (item) {
                var _index = this.indexOf(item);

                if (_index !== -1) {
                    this.removeAt(_index);
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
                match = $lambda(match);
                $ensureType(match, "match", __function);

                var _freeIndex = 0,
                    _len = this.length;

                while (_freeIndex < _len && !match(this[_freeIndex])) {
                    _freeIndex++;
                }

                if (_freeIndex >= _len) {
                    return 0;
                }

                var _current =
                    _freeIndex + 1;

                while (_current < _len) {
                    while (_current < _len && match(this[_current])) {
                        _current++;
                    }

                    if (_current < _len) {
                        this[_freeIndex++] = this[_current++];
                    }
                }

                this.length = _freeIndex;
                return _len - _freeIndex;
            },

            /**
            * Removes the element at the specified index of the List.
            * @param {Number} index The zero-based index of the element to remove.
            */
            removeAt: function (index) {
                validateRange(this, index);

                var _i = index,
                    _len = --this.length;

                for (; _i < _len; _i++) {
                    this[_i] = this[_i + 1];
                }

                delete this[_len];
            },

            /**
            * Removes a range of elements from the List.
            * @param {Number} index The zero-based index of the element to remove.
            * @param {Number} count The number of elements to remove.
            */
            removeRange: function (index, count) {

                validateRange(this, index + count - 1);

                var _len = this.length - count;

                for (; index < _len; index++) {
                    this[index] = this[index + count];
                }

                this.length = _len;
            },

            /**
            * Reverses the order of the elements in the specified range.
            * @param {Number=} index The zero-based starting index of the range to reverse.
            * @param {Number=} count The number of elements in the range to reverse.
            */
            reverse: function (index, count) {
                index = index || 0;
                count = count || this.length;
                validateRange(this, index + count - 1);

                var _arr = this.slice(index, index + count).reverse(),
                    _len = _arr.length;

                while (_len-- > 0) {
                    this[_len + index] = _arr[_len];
                }
            },

            /**
            * Returns a shallow copy of a portion of the list into a new array object.
            * @param {Number=} begin Zero-based index at which to begin extraction.
            * @param {Number=} end Zero-based index at which to end extraction
            * @returns {Array}
            */
            slice: [].slice,

            /**
            * Changes the content of the list by removing existing elements and/or adding new elements.
            * @param {Number} start Index at which to start changing the list.
            * @param {Number} deleteCount An integer indicating the number of old list elements to remove.
            * @param {Object...} items The elements to add to the list.
            * @returns {Array}
            */
            splice: [].splice,

            /**
            * Sets the element at the specified index.
            * @param {Number} index The zero-based index of the element to set.
            * @param {Object} item The object to be added at the specified index.
            */
            set: function (index, value) {
                validateRange(this, index);
                this[index] = value;
            },

            /**
            * Sorts the elements in a range of elements in List using the specified comparer.
            * @param {Number|Function|Comparer} val The starting index, the comparison function or the Comparer.
            * @param {Number} count The length of the range to sort.
            * @param {Comparer} comparer The Comparer implementation to use when comparing elements.
            */
            sort: function () {
                var _args = arguments,
                    _arg1 = _args[0],
                    _comparison = $lambda(_arg1),
                    _comparer = $comparer(_args.length === 3 ? _args[3] : _arg1),
                    _index = 0,
                    _arr,
                    _len;

                if (_args.length > 0) {
                    if ($isFunc(_comparison)) {
                        _arr = this.items().sort(_comparison);
                    }
                    else {
                        if ($is(_arg1, __number)) {
                            _index = _arg1;

                            $ensureType(_args[1], "count", __number);
                            validateRange(this, _index + _args[1] - 1);

                            _arr = this.slice(_index, _index + _args[1]);
                        }
                        else {
                            _arr = this.items();
                        }

                        _arr = _arr.sort(function (x, y) { return _comparer.compare(x, y); });
                    }
                }
                else {
                    _arr = this.items().sort();
                }

                _len = _arr.length;

                while (_len-- > 0) {
                    this[_len + _index] = _arr[_len];
                }
            },

            /**
            * Copies the elements of the List to a new array.
            * @returns {Array}
            */
            toArray: function () {
                return this.items();
            },

            /**
            * Determines whether every element in the List matches the conditions defined by the specified predicate.
            * @param {Function} match The Predicate function that defines the conditions to check against the elements, eg. function(item)
            * @returns {Boolean}
            */
            trueForAll: function (match) {

                match = $lambda(match);
                $ensureType(match, "match", __function);

                for (var i = 0, _len = this.length; i < _len; i++) {
                    if (match(this[i]) === false) {
                        return false;
                    }
                }

                return true;
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                var _index = -1,
                    _length = this.length,
                    _this = this;

                return new __Enumerator(function (yielder) {
                    if (++_index < _length) {
                        return yielder(_this[_index]);
                    }
                });
            }
        });



        /* List Helper Functions
        ---------------------------------------------------------------------- */

        function validateRange(list, index) {
            $ensureType(index, "index", __number);

            if (index < 0 || index >= list.length) {
                throw new __error("Index was out of range. Must be non-negative and less than the size of the List.");
            }
        }
    })();


    /**
    * Represents a collection of key/value pairs that are sorted by key based on the associated Comparer implementation.
    */
    var __SortedList = (function () {

        /**
        * Initializes a new instance of the List class.
        * @param {Dictionary|Comparer|Number=} value The Dictionary whose elements are copied to the new SortedList, he Comparer implementation to use when comparing keys or The initial number of elements that the SortedList can contain.
        * @param {Comparer=} comparer The Comparer implementation to use when comparing keys.
        */
        function SortedList(value, comparer) {
            comparer = $comparer(comparer);
            if (value != null) {
            }
        }

        return $extend(SortedList, __Collection, {

            /**
            * Adds an element with the specified key and value into the SortedList.
            * @param {Object} key The key of the element to add.
            * @param {Object} value The value of the element to add. The value can be null for reference types.
            */
            add: function (key, value) {
                $nullCheck(key, "key");
                $nullCheck(value, "value");
            },

            /**
            * Gets the value associated with the specified key.
            * @param {Object} key The key whose value to get.
            * @returns {Object}
            */
            get: function (key) {
                $nullCheck(key, "key");
            },

            /**
            * Gets or sets the number of elements that the SortedList can contain.
            * @param {Number} value The number of elements that the SortedList can contain.
            * @returns {Number}
            */
            capacity: function (value) {
                $ensureType(value, "value", __number);
            },

            /**
            * Removes all elements from the SortedList.
            */
            clear: function () {
            },

            /**
            * Gets the Comparer for the sorted list.
            * @returns {Comparer}
            */
            comparer: function () {
            },

            /**
            * Determines whether the SortedList contains a specific key.
            * @param {Object} key The key to locate in the SortedList.
            * @returns {Boolean}
            */
            containsKey: function (key) {
                $nullCheck(key, "key");
            },

            /**
            * Determines whether the SortedList contains a specific value.
            * @param {Object} value The value to locate in the SortedList.
            * @returns {Boolean}
            */
            containsValue: function () {
            },

            /**
            * Gets the number of key/value pairs contained in the SortedList.
            * @returns {Number}
            */
            count: function () {
            },

            /**
            * Gets a collection containing the keys in the SortedList, in sorted order.
            * @returns {List}
            */
            keys: function () {
            },

            /**
            * Gets a collection containing the values in the SortedLis.
            * @returns {List}
            */
            values: function () {
            },

            /**
            * Searches for the specified key and returns the zero-based index within the entire SortedList.
            * @param {Object} key The key to locate in the SortedList.
            * @returns {Number}
            */
            indexOfKey: function (key) {
                $nullCheck(key, "key");
            },

            /**
            * Searches for the specified value and returns the zero-based index of the first occurrence within the entire SortedList.
            * @param {Object} value The value to locate in the SortedList.
            * @returns {Number}
            */
            indexOfValue: function (value) {
                $nullCheck(value, "value");
            },

            /**
            * Removes the element with the specified key from the SortedList.
            * Returns true if the element is successfully removed; otherwise, false. This method also returns false if key was not found in the original SortedList.
            * @param {Object} key The key of the element to remove.
            * @returns {Boolean}
            */
            remove: function (key) {
                $nullCheck(key, "key");
            },

            /**
            * Removes the element at the specified index of the SortedList.
            * @param {Number} index The zero-based index of the element to remove.
            */
            removeAt: function (index) {
                $ensureType(index, "index", __number);
            },

            /**
            * Sets the value associated with the specified key.
            * @param {Object} key The key whose value to get or set.
            * @param {Object} value The value associated with the specified key.
            */
            set: function (key, value) {
                $nullCheck(key, "key");
                $nullCheck(value, "value");
            },

            /**
            * Sets the capacity to the actual number of elements in the SortedList, if that number is less than 90 percent of current capacity.
            */
            trimExcess: function () {
            },

            /**
            * Gets the value associated with the specified key.
            * @param {Object} key The key whose value to get.
            * @param {Function} callback When this method returns, callback method is called with the value
            * associated with the specified key, if the key is found; otherwise, null for the type of the value parameter.
            * @returns {Boolean}
            */
            tryGetValue: function (key, callback) {
                $nullCheck(key, "key");
                $ensureType(callback, "callback", __function);
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                return $enumerator(this.items());
            }
        });
    })();


    /**
    * Defines a key/value pair that can be set or retrieved.
    */
    var __KeyValuePair = (function () {

        /**
        * Initializes a new instance of the KeyValuePair with the specified key and value.
        * @param {Object} key The object defined in each key/value pair.
        * @param {Object} value The definition associated with key.
        */
        function KeyValuePair(key, value) {

            /** @property {object} key Gets the key in the key/value pair.*/
            this.key = key;

            /** @property {object} value Gets the value in the key/value pair.*/
            this.value = value;

            $freeze(this);
        }

        return KeyValuePair;
    })();


    /**
    * Represents a generic collection of key/value pairs.
    */
    var __Dictionary = (function () {

        /**
        * Initializes a new instance of the Dictionary.
        * @param {Dictionary|EqualityComparer|Number=} value The Dictionary whose elements are copied to the new Dictionary, the EqualityComparer or the Capacity
        * @param {EqualityComparer=} comparer The EqualityComparer implementation to use when comparing keys.
        */
        function Dictionary() {
            var _args = arguments,
                _dic = $is(_args, Dictionary) ? _args[0] : null,
                _comparer = _dic ? _args[1] : $equalityComparer(_args[0]),
                _table = _dic ? new __HashTable(_dic.count(), _comparer) : ($is(_args[0], __number) ? new __HashTable(_args[0], _comparer) : new __HashTable(_comparer));

            $define(this, "table", { value: function () { return _table; } });

            if (_dic) {
                var _e = $enumerator(_dic);
                while (_e.next()) {
                    _table.add(_e.current.key, _e.current.value);
                }
            }
        }

        return $extend(Dictionary, __Collection, {

            /**
            * Adds an element with the provided key and value to the Dictionary.
            * @param {Object} key The object to use as the key of the element to add.
            * @param {Object} value The object to use as the value of the element to add.
            */
            add: function (key, value) {
                $nullCheck(key, "key");
                if (!this.table().add(key, value)) {
                    throw new __error("An item with the same key has already been added.");
                }
            },

            /**
            * Removes all keys and values from the Dictionary.
            */
            clear: function () {
                this.table().clear();
            },

            /**
            * Gets the number of elements contained in the Dictionary.
            * @returns {Number}
            */
            count: function () {
                return this.table().count();
            },

            /**
            * Determines whether the Dictionary contains the specified key.
            * @param {Object} key The key to locate in the Dictionary.
            * @returns {Boolean}
            */
            containsKey: function (key) {
                $nullCheck(key, "key");
                return this.table().contains(key);
            },

            /**
            * Determines whether the Dictionary contains a specific value.
            * @param {Object} value The value to locate in the Dictionary.
            * @returns {Boolean}
            */
            containsValue: function (value) {
                var _e = $enumerator(this.table());

                while (_e.next()) {
                    if ($equals(_e.current.value, value)) {
                        return true;
                    }
                }

                return false;
            },

            /**
            * Copies the Dictionary keys to an existing one-dimensional Array, starting at the specified array index.
            * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Dictionary keys.
            * @param {Number} arrayIndex The zero-based index in array at which copying begins.
            */
            copyTo: function (array, arrayIndex) {
                $bufferTo(this.keys(), array, arrayIndex);
            },

            /**
            * Gets a Array containing the keys of the Dictionary.
            * @returns {Array}
            */
            keys: function () {
                return this.table().keys();
            },

            /**
            * Gets a Array containing the values in the Dictionary.
            * @returns {Array}
            */
            values: function () {
                return this.table().values();
            },

            /**
            * Gets element with the specified key.
            * @param {Object} key The key of the element to get.
            * @returns {Object}
            */
            get: function (key) {
                $nullCheck(key, "key");

                var _entry = this.table().get(key);

                if (_entry == null) {
                    throw new __error("The given key was not present in the collection.");
                }

                return _entry.value;
            },

            /**
            * Sets the element with the specified key.
            * @param {Object} key The key of the element to set.
            * @param {Object} value The object to use as the value of the element to set.
            */
            set: function (key, value) {
                $nullCheck(key, "key");
                this.table().set(key, value);
            },

            /**
            * Gets the value associated with the specified key.
            * @param {Object} key The key whose value to get.
            * @param {Function} callback When this method returns, callback method is called with the value
            * associated with the specified key, if the key is found; otherwise, null for the type of the value parameter.
            * @returns {Boolean}
            */
            tryGetValue: function (key, callback) {
                $nullCheck(key, "key");
                $ensureType(callback, "callback", __function);

                var _entry = this.table().get(key);

                if (_entry != null) {
                    callback(_entry.value);
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
                $nullCheck(key, "key");
                return this.table().remove(key);
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                var _e = $enumerator(this.table());

                return new __Enumerator(function (yielder) {
                    while (_e.next()) {
                        return yielder(new __KeyValuePair(_e.current.key, _e.current.value));
                    }
                });
            }
        });
    })();


    /**
    *   Represents a collection of key/value pairs that are organized based on the hash code of the key.
    */
    var __HashTable = (function () {

        /// Array of primes larger than: 2 ^ (4 x n)
        var _primes = [17, 67, 257, 1031, 4099, 16411, 65537, 262147, 1048583, 4194319, 16777259],
            _fillFactor = 0.72;


        /**
        * Initializes a new instance of the Hashtable.
        * @param {Number|EqualityComparer=} value Capacity or an EqualityComparer object.
        * @param {EqualityComparer=} comparer The EqualityComparer object that defines the hash code provider and the comparer to use with the Hashtable.
        */
        function HashTable() {

            var _args = arguments,
                _size = $is(_args[0], __number) ? getPrime(_args[0] / _fillFactor) : 0,
                _comparer = $equalityComparer(_args.length === 2 ? _args[1] : _args[0]);

            initializeHashTable(this, _size, _comparer);
        }

        /**
        * Initializes a new instance of the Bucket.
        * @param {Object} key The key defined in each key/value bucket.
        * @param {Object} value The value defined in each key/value bucket.
        * @param {Number} hash The hash code of the key defined in each key/value bucket.
        * @param {Bucket} next The next bucket in the chained bucket sequence when collision occures.
        */
        function Bucket(key, value, hash, next) {
            this.key = key;
            this.value = value;
            this.hash = hash;
            this.next = next;
        }


        return $extend(HashTable, __Collection, {

            /**
            * Gets the value associated with the specified key.
            * @param {Object} key The key whose value to get.
            * @returns {Bucket}
            */
            get: function (key) {
                var _buckets = this._buckets,
                    _comparer = this._comparer,
                    _hashCode = _comparer.hash(key),
                    _bucket = _buckets[_hashCode % _buckets.length];

                while (_bucket != null) {
                    if (_bucket.hash === _hashCode && _comparer.equals(_bucket.key, key)) {
                        return _bucket;
                    }

                    _bucket = _bucket.next;
                }

                return null;
            },

            /**
            * Sets the value associated with the specified key.
            * @param {Object} key The key whose value to get.
            *  @param {Object} value The object to use as the value of the element to set.
            */
            set: function (key, value) {
                this.add(key, value, true);
            },

            /**
            * Adds an element with the specified key and value into the HashTable.
            * @param {Object} key The key of the element to add. 
            * @param {Object} value The value of the element to add. The value can be null.
            * @param {Boolean} overwrite When true, overwrites the value of an item if found.
            * @returns {Boolean}
            */
            add: function (key, value, overwrite) {

                if (this._count > this._loadSize) {
                    rehash(this, getPrime(this._buckets.length));
                }

                var _buckets = this._buckets,
                    _comparer = this._comparer,
                    _hashCode = _comparer.hash(key),
                    _hash = _hashCode % _buckets.length,
                    _bucket = _buckets[_hash];


                if (_bucket != null) {
                    var _b = _bucket;
                    do {
                        if (_b.hash === _hashCode && _comparer.equals(_b.key, key)) {
                            if (overwrite) {
                                _b.value = value;
                            }
                            return false;
                        }

                        _b = _b.next;
                    }
                    while (_b != null);
                }


                _buckets[_hash] = new Bucket(key, value, _hashCode, _bucket);

                this._count++;
                return true;
            },

            /**
            * Removes the element with the specified key from the HashTable.
            * @param {Object} key The key of the element to remove.
            * @returns {Boolean}
            */
            remove: function (key) {
                var _buckets = this._buckets,
                    _comparer = this._comparer,
                    _size = _buckets.length,
                    _hashCode = _comparer.hash(key),
                    _hash = _hashCode % _size,
                    _bucket = _buckets[_hash],
                    _prevBucket = _bucket;

                while (_bucket != null) {

                    if (_bucket.hash === _hashCode && _comparer.equals(_bucket.key, key)) {

                        /// first in the bucket list
                        if (_prevBucket === _bucket) {
                            _buckets[_hash] = _bucket.next;
                        }
                        else {
                            _prevBucket.next = _bucket.next;
                        }

                        this._count--;
                        return true;
                    }

                    _prevBucket = _bucket;
                    _bucket = _bucket.next;
                }
                return false;
            },

            /**
            * Removes all elements from the HashTable.
            */
            clear: function () {
                initializeHashTable(this);
            },

            /**
            * Gets the number of elements contained in the HashTable.
            * @returns {Number}
            */
            count: function () {
                return this._count;
            },

            /**
            * Determines whether a specified key exists in the HashTable.
            * @param {Object} key The key of the element to check.
            * @returns {Boolean}
            */
            contains: function (key) {
                return this.get(key) != null;
            },

            /**
            * Gets the EqualityComparer to use for the Hashtable.
            * @returns {EqualityComparer}
            */
            comparer: function () {
                return this._comparer;
            },

            /**
            * Gets a Array containing the keys of the HashTable.
            * @returns {Array}
            */
            keys: function () {
                var _arr = new __array(this._count),
                    _e = $enumerator(this),
                    _index = 0;

                while (_e.next()) {
                    _arr[_index++] = _e.current.key;
                }

                return _arr;
            },

            /**
            * Gets a Array containing the values in the HashTable.
            * @returns {Array}
            */
            values: function () {
                var _arr = new __array(this._count),
                    _e = $enumerator(this),
                    _index = 0;

                while (_e.next()) {
                    _arr[_index++] = _e.current.value;
                }

                return _arr;
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {

                var _buckets = this._buckets,
                    _count = this._count,
                    _size = _buckets.length,
                    _index = 0,
                    _bucket;

                return new __Enumerator(function (yielder) {

                    while (_index <= _size && _count > 0) {
                        if (_bucket != null) {
                            yielder(_bucket);
                            _bucket = _bucket.next;
                            _count--;
                            return;
                        }
                        else {
                            _bucket = _buckets[_index];
                            _index++;
                        }
                    }
                });
            }
        });



        /* HashTable Helper Functions
        ---------------------------------------------------------------------- */

        function getPrime(min) {
            for (var i = 0; i < _primes.length; i++) {
                var prime = _primes[i];
                if (prime > min) {
                    return prime;
                }
            }

            return _primes[_primes.length - 1];
        }

        function initializeHashTable(table, size, comparer) {
            size = size || _primes[0];
            comparer = comparer || table._comparer || __EqualityComparer['default'];

            table._count = 0;
            table._loadSize = size * _fillFactor;
            table._buckets = new __array(size);
            table._comparer = comparer;
            table._keys = null;
            table._values = null;
        }

        function rehash(table, newSize) {
            var _buckets = table._buckets,
                _newBuckets = new __array(newSize),
                _size = _buckets.length,
                _bucket,
                _newBucket,
                _hash;

            for (var i = 0; i < _size; i++) {
                _bucket = _buckets[i];

                while (_bucket != null) {

                    _newBucket = _bucket;
                    _bucket = _bucket.next;

                    _hash = _newBucket.hash % newSize;
                    _newBucket.next = _newBuckets[_hash];
                    _newBuckets[_hash] = _newBucket;
                }
            }

            table._loadSize = _fillFactor * newSize;
            table._buckets = _newBuckets;
        }
    })();


    /**
    * Represents a set of values.
    */
    var __HashSet = (function () {

        /**
        * Initializes a new instance of the HashSet class.
        * @param {Enumerable|EqualityComparer=} collectionOrComparer or the EqualityComparer implementation to use when comparing values in the set.
        * @param {EqualityComparer=} comparer The collection whose elements are copied to the new set. or the EqualityComparer implementation to use when comparing values in the set.
        */
        function HashSet() {
            var _args = arguments,
                _enumerable = __Enumerable.is(_args[0]) ? $enumerable(_args[0]) : null,
                _collection = $collection(_args[0]),
                _comparer = $equalityComparer(_args.length === 1 && _enumerable == null ? _args[0] : _args[1]),
                _table = new __HashTable(_collection ? _collection.count() : 0, _comparer);

            $define(this, "table", { value: function () { return _table; } });

            if (_enumerable) {
                var _buffer = $buffer(_args[0]);
                for (var i = 0, len = _buffer.length; i < len; i++) {
                    _table.add(_buffer[i], null);
                }
            }
        }

        function ElementCount(uniqueCount, unfoundCount) {
            this.uniqueCount = uniqueCount;
            this.unfoundCount = unfoundCount;
        }

        return $extend(HashSet, __Collection, {

            /**
            * Adds an element to the current set.
            * @param {Object} item The element to add to the set.
            * @returns {Boolean}
            */
            add: function (item) {
                return this.table().add(item, null);
            },

            /**
            * Removes all elements from a HashSet object.
            */
            clear: function () {
                this.table().clear();
            },

            /**
            * Gets the number of elements contained in the HashSet.
            * @returns {Number}
            */
            count: function () {
                return this.table().count();
            },

            /**
            * Determines whether a HashSet object contains the specified element.
            * @param {Object} item The element to locate in the HashSet object.
            * @returns {Boolean}
            */
            contains: function (item) {
                return this.table().contains(item);
            },

            /**
            * Copies the elements of a HashSet object to an array.
            * @param {Array} array The one-dimensional array that is the destination of the elements copied from the HashSet object.
            * @param {Number=} arrayIndex The zero-based index in array at which copying begins.
            * @param {Number=} count The number of elements to copy to array.
            */
            copyTo: function (array, arrayIndex, count) {
                $bufferTo(this.table().keys(), array, arrayIndex, count);
            },

            /**
            * Gets the EqualityComparer object that is used to determine equality for the values in the set.
            * @returns {EqualityComparer}
            */
            comparer: function () {
                return this.table().comparer();
            },

            /**
            * Removes the specified element from a HashSet object.
            * @param {Object} item The element to remove.
            * @returns {Boolean}
            */
            remove: function (item) {
                return this.table().remove(item);
            },

            /**
            * Removes all elements that match the conditions defined by the specified predicate from a HashSet collection.
            * @param {Function} match The predicate function that defines the conditions of the elements to remove. eg. function(item)
            * @returns {Number}
            */
            removeWhere: function (match) {
                match = $lambda(match);
                $ensureType(match, "match", __function);

                var _count = this.count(),
                    _table = this.table(),
                    _buffer = $buffer(this),
                    _removed = 0,
                    _item;


                while (_count-- > 0) {
                    _item = _buffer[_count];

                    if (match(_item) && _table.remove(_item)) {
                        _removed++;
                    }
                }

                return _removed;
            },

            /**
            * Removes all elements in the specified collection from the current set.
            * @param {Enumerable} other The collection of items to remove from the set.
            */
            exceptWith: function (other) {
                $nullCheck(other, "other");

                if (this.count() === 0) {
                    return;
                }

                else if (other === this) {
                    this.clear();
                    return;
                }

                else {
                    var _eOther = $enumerator(other),
                        _table = this.table();

                    while (_eOther.next()) {
                        _table.remove(_eOther.current);
                    }
                }
            },

            /**
            * Modifies the current set so that it contains only elements that are also in a specified collection.
            * @param {Enumerable} other The collection to compare to the current set.
            */
            intersectWith: function (other) {
                $nullCheck(other, "other");

                // intersection of anything with empty set is empty set, so return if count is 0
                if (this.count() === 0) {
                    return;
                }

                var _collection = $collection(other);

                if (_collection != null) {
                    if (_collection.count() === 0) {
                        this.clear();
                        return;
                    }

                    // If other is a HashSet, it has unique elements according to its equality comparer,
                    // but if they're using different equality comparers, then assumption of uniqueness
                    // will fail. So first check if other is a hashset using the same equality comparer;
                    // intersect is a lot faster if we can assume uniqueness.

                    if (areEqualityComparersEqual(this, _collection)) {
                        var _count = this.count(),
                            _table = this.table(),
                            _otable = _collection.table(),
                            _buffer = $buffer(this),
                            _item;

                        while (_count-- > 0) {
                            if (!_otable.contains(_item = _buffer[_count])) {
                                _table.remove(_item);
                            }
                        }

                        return;
                    }
                }

                this.intersectWith(new __HashSet(other, this.comparer()));
            },

            /**
            * Determines whether the current set is a proper (strict) subset of a specified collection.
            * @param {Enumerable} other The collection to compare to the current set.
            * @returns {Boolean}
            */
            isProperSubsetOf: function (other) {
                $nullCheck(other, "other");

                var _collection = $collection(other);

                if (_collection != null) {

                    if (this.count() === 0) {
                        return _collection.count() > 0;
                    }

                        // faster if other is a hashset (and we're using same equality comparer)
                    else if (areEqualityComparersEqual(this, _collection)) {
                        if (this.count() >= _collection.count()) {
                            return false;
                        }

                            // this has strictly less than number of items in other, so the following
                            // check suffices for proper subset.
                        else {
                            return isSubsetOfHashSetWithSameEC(this, _collection);
                        }
                    }
                }
                else {
                    var result = checkUniqueAndUnfoundElements(this, other, false);
                    return (result.uniqueCount === this.count() && result.unfoundCount > 0);
                }
            },

            /**
            * Determines whether the current set is a proper (strict) superset of a specified collection.
            * @param {Enumerable} other The collection to compare to the current set.
            * @returns {Boolean}
            */
            isProperSupersetOf: function (other) {
                $nullCheck(other, "other");

                // the empty set isn't a proper superset of any set.
                if (this.count() === 0) {
                    return false;
                }

                var _collection = $collection(other);

                if (_collection != null) {

                    // if other is the empty set then this is a superset
                    if (_collection.count() === 0) {
                        return true;
                    }

                        // faster if other is a hashset with the same equality comparer
                    else if (areEqualityComparersEqual(this, _collection)) {
                        if (_collection.count() >= this.count()) {
                            return false;
                        }

                        else {
                            return containsAllElements(this, _collection);
                        }
                    }
                }
                else {
                    var result = checkUniqueAndUnfoundElements(this, other, true);
                    return (result.uniqueCount < this.count() && result.unfoundCount === 0);
                }
            },

            /**
            * Determines whether a set is a subset of a specified collection.
            * @param {Enumerable} other The collection to compare to the current set.
            * @returns {Boolean}
            */
            isSubsetOf: function (other) {
                $nullCheck(other, "other");

                // The empty set is a subset of any set
                if (this.count() === 0) {
                    return true;
                }

                else if (areEqualityComparersEqual(this, other)) {
                    if (this.count() > other.count()) {
                        return false;
                    }

                    else {
                        return isSubsetOfHashSetWithSameEC(this, other);
                    }
                }
                else {
                    var result = checkUniqueAndUnfoundElements(this, other, false);
                    return (result.uniqueCount === this.count() && result.unfoundCount >= 0);
                }
            },

            /**
            * Determines whether the current set is a superset of a specified collection.
            * @param {Enumerable} other The collection to compare to the current set.
            * @returns {Boolean}
            */
            isSupersetOf: function (other) {
                $nullCheck(other, "other");

                var _collection = $collection(other);

                if (_collection != null) {

                    // if other is the empty set then this is a superset
                    if (_collection.count() === 0) {
                        return true;
                    }

                    else if (areEqualityComparersEqual(this, _collection)) {
                        if (_collection.count() > this.count()) {
                            return false;
                        }
                    }
                }

                return containsAllElements(this, other);
            },

            /**
            * Determines whether the current set overlaps with the specified collection.
            * @param {Enumerable} other The collection to compare to the current set.
            * @returns {Boolean}
            */
            overlaps: function (other) {
                $nullCheck(other, "other");

                if (this.count() === 0) {
                    return false;
                }

                var _eOther = $enumerator(other),
                    _table = this.table();

                while (_eOther.next()) {
                    if (_table.contains(_eOther.current)) {
                        return true;
                    }
                }
                return false;
            },

            /**
            * Determines whether the current set and the specified collection contain the same elements.
            * @param {Enumerable} other The collection to compare to the current set.
            * @returns {Boolean}
            */
            setEquals: function (other) {
                $nullCheck(other, "other");

                if (areEqualityComparersEqual(this, other)) {
                    if (this.count() !== other.count()) {
                        return false;
                    }

                    /// already confirmed that the sets have the same number of distinct elements, 
                    /// so if one is a superset of the other then they must be equal

                    return containsAllElements(this, other);
                }

                var _collection = $collection(other);

                if (_collection != null) {

                    // if this count is 0 but other contains at least one element, they can't be equal
                    if (this.count() === 0 && _collection.count() > 0) {
                        return false;
                    }
                }

                var result = checkUniqueAndUnfoundElements(this, other, true);
                return (result.uniqueCount === this.count() && result.unfoundCount === 0);
            },

            /**
            * Modifies the current set so that it contains only elements that are present
            * either in the current set or in the specified collection, but not both.
            * @param {Enumerable} other The collection to compare to the current set.
            */
            symmetricExceptWith: function (other) {
                $nullCheck(other, "other");

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
                    var _eOther = $enumerator(other),
                        _table = this.table();

                    while (_eOther.next()) {
                        if (!_table.remove(_eOther.current)) {
                            _table.add(_eOther.current, null);
                        }
                    }
                }
                else {
                    this.symmetricExceptWith(new __HashSet(other, this.comparer()));
                }
            },

            /**
            * Modifies the current set so that it contains all elements that are present
            * in either the current set or the specified collection.
            * @param {Enumerable} other The collection to compare to the current set.
            */
            unionWith: function (other) {
                $nullCheck(other, "other");

                var _eOther = $enumerator(other),
                    _table = this.table();

                while (_eOther.next()) {
                    _table.add(_eOther.current, null);
                }
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                var _e = $enumerator(this.table());
                return new __Enumerator(function (yielder) {
                    while (_e.next()) {
                        return yielder(_e.current.key);
                    }
                });
            }
        });



        /* HashSet Helper Functions
        ---------------------------------------------------------------------- */

        function areEqualityComparersEqual(set1, set2) {
            return $is(set1, __HashSet) && $is(set2, __HashSet) && set1.comparer() === set2.comparer();
        }

        function containsAllElements(set, other) {
            var _eOther = $enumerator(other),
                _table = set.table();

            while (_eOther.next()) {
                if (!_table.contains(_eOther.current)) {
                    return false;
                }
            }

            return true;
        }

        function isSubsetOfHashSetWithSameEC(set, other) {
            var _e = $enumerator(set),
                _table = other.table();

            while (_e.next()) {
                if (!_table.contains(_e.current)) {
                    return false;
                }
            }

            return true;
        }

        function checkUniqueAndUnfoundElements(set, other, returnIfUnfound) {

            var _eOther = $enumerator(other);

            if (set.count() === 0) {                     // need special case in case this has no elements. 
                if (_eOther.next()) {                    // all we want to know is whether other has 0 or 1 elements
                    return new ElementCount(0, 1);
                }
            }

            var _unfoundCount = 0,                      // count of items in other not found in this
                _uniqueFoundCount = 0,                  // count of unique items in other found in this
                _table = set.table(),
                _otable = new __HashTable(set.comparer());

            while (_eOther.next()) {

                if (_table.contains(_eOther.current)) {
                    if (_otable.add(_eOther.current, null)) {
                        _uniqueFoundCount++;
                    }
                }
                else {
                    _unfoundCount++;
                    if (returnIfUnfound) {
                        break;
                    }
                }
            }

            return new ElementCount(_uniqueFoundCount, _unfoundCount);
        }
    })();


    /**
    * Represents a node in a LinkedList.
    */
    var __LinkedListNode = (function () {

        /**
        * Initializes a new instance of the LinkedListNode class, containing the specified value.
        * @param {Object} value The value to contain in the LinkedListNode
        */
        function LinkedListNode(value) {
            /** @property {object} value Gets the value contained in the node. */
            this._value = value;

            /** @property {LinkedList} list Gets the value contained in the node. */
            this._list = null;

            /** @property {LinkedListNode} next Gets the value contained in the node. */
            this._next = null;

            /** @property {LinkedListNode} previous Gets the value contained in the node. */
            this._prev = null;
        }

        return $extend(LinkedListNode, {

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
                return this._next == null || this._next === this._list.head() ? null : this._next;
            },

            /**
            * Gets the previous node in the LinkedList.
            * @returns {LinkedListNode}
            */
            previous: function () {
                return this._prev == null || this === this._list.head() ? null : this._prev;
            }
        });
    })();


    /**
    * Represents a doubly linked list.
    */
    var __LinkedList = (function () {

        /**
        * Initializes a new instance of the LinkedList class that that is empty or contains elements copied from the specified collection.
        * @param {Enumerable=} collection The collection to copy elements from.
        */
        function LinkedList(collection) {
            var _count = 0,
                _head;

            $define(this, "head", {
                value: function () {
                    var val = arguments[0];
                    if ($is(val, __LinkedListNode) || val === null) {
                        _head = val;
                    }

                    return _head;
                }
            });

            $define(this, "count", {
                value: function () {
                    var val = arguments[0];
                    if ($is(val, __number)) {
                        _count = __math.max(val, 0);
                    }

                    return _count;
                }
            });

            if (collection) {
                var _buffer = $buffer(collection);
                for (var i = 0, len = _buffer.length; i < len; i++) {
                    this.addLast(_buffer[i]);
                }
            }
        }


        return $extend(LinkedList, __Collection, {

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
                var current = this.head();

                while (current != null) {
                    var temp = current;
                    current = current.next();   // use next() the instead of "_next", otherwise it will loop forever
                    resetNode(temp);
                }

                this.head(null);
                this.count(0);
            },

            /**
            * Gets the number of elements contained in the LinkedList.
            * @returns {Number}
            */
            count: function () {
                return this.count();
            },

            /**
            * Determines whether a value is in the LinkedList.
            * @param {Object} value The value to locate in the LinkedList. The value can be null for reference types.
            * @returns {Boolean}
            */
            contains: function (item) {
                return this.find(item) != null;
            },

            /**
            * Copies the entire LinkedList to a compatible one-dimensional Array, starting at the specified index of the target array.
            * @param {Array} array The one-dimensional Array that is the destination of the elements copied from LinkedList.
            * @param {Number} arrayIndex The zero-based index in array at which copying begins.
            */
            copyTo: function (array, arrayIndex) {
                $bufferTo(this, array, arrayIndex);
            },

            /**
            * Gets the first node of the LinkedList.
            * @returns {LinkedListNode}
            */
            getFirst: function () {
                return this.head();
            },

            /**
            * Gets the last node of the LinkedList.
            * @returns {LinkedListNode}
            */
            getLast: function () {
                return this.head() == null ? null : this.head()._prev;
            },

            /**
            * Adds the specified new node after the specified existing node in the LinkedList.
            * @param {LinkedListNode} node The LinkedListNode after which to insert newNode.
            * @param {LinkedListNode|Object} value The value or the LinkedListNode to add to the LinkedList.
            * @returns {LinkedListNode}
            */
            addAfter: function (node, value) {

                $ensureType(node, "node", __LinkedListNode);

                var _newNode;

                if ($is(value, __LinkedListNode)) {
                    _newNode = value;
                    insertNodeBefore(this, node._next, _newNode);
                }
                else {
                    _newNode = new __LinkedListNode(value);
                    this.addAfter(node, _newNode);
                }

                return _newNode;
            },

            /**
            * Adds the specified new node before the specified existing node in the LinkedList.
            * @param {LinkedListNode} node The LinkedListNode before which to insert newNode.
            * @param {LinkedListNode|Object} value The value or the LinkedListNode to add to the LinkedList.
            * @returns {LinkedListNode}
            */
            addBefore: function (node, value) {

                $ensureType(node, "node", __LinkedListNode);

                var _newNode;

                if ($is(value, __LinkedListNode)) {
                    _newNode = value;
                    insertNodeBefore(this, node, _newNode);
                    if (node === this.head()) {
                        this.head(_newNode);
                    }
                }
                else {
                    _newNode = new __LinkedListNode(value);
                    this.addBefore(node, _newNode);
                }

                return _newNode;
            },

            /**
            * Adds the specified new node at the start of the LinkedList.
            * @param {LinkedListNode|Object} value The value or the LinkedListNode to add at the start of the LinkedList.
            * @returns {LinkedListNode}
            */
            addFirst: function (value) {

                var _node;

                if ($is(value, __LinkedListNode)) {
                    _node = value;
                    if (this.head() == null) {
                        insertNodeToEmptyList(this, _node);
                    }
                    else {
                        insertNodeBefore(this, this.head(), _node);
                        this.head(_node);
                    }
                }
                else {
                    _node = new __LinkedListNode(value);
                    this.addFirst(_node);
                }

                return _node;
            },

            /**
            * Adds the specified new node at the end of the LinkedList.
            * @param {LinkedListNode|Object} value The value or the LinkedListNode to add at the end of the LinkedList.
            * @returns {LinkedListNode}
            */
            addLast: function (value) {
                var _node;

                if ($is(value, __LinkedListNode)) {
                    _node = value;
                    if (this.head() == null) {
                        insertNodeToEmptyList(this, _node);
                    }
                    else {
                        insertNodeBefore(this, this.head(), _node);
                    }
                }
                else {
                    _node = new __LinkedListNode(value);
                    this.addLast(_node);
                }

                return _node;
            },

            /**
            * Finds the first node that contains the specified value.
            * @param {Object} value The value to locate in the LinkedList.
            * @returns {LinkedListNode}
            */
            find: function (value) {
                var _node = this.head();

                if (_node != null) {
                    if (value != null) {
                        do {
                            if ($equals(_node._value, value)) {
                                return _node;
                            }
                            _node = _node._next;
                        } while (_node !== this.head());
                    }
                    else {
                        do {
                            if (_node._value == null) {
                                return _node;
                            }

                            _node = _node._next;
                        } while (_node !== this.head());
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
                if (this.head() == null) {
                    return null;
                }

                var _last = this.head()._prev,
                    _node = _last;

                if (_node != null) {
                    if (value != null) {
                        do {
                            if ($equals(_node._value, value)) {
                                return _node;
                            }

                            _node = _node._prev;
                        } while (_node !== _last);
                    }
                    else {
                        do {
                            if (_node._value == null) {
                                return _node;
                            }

                            _node = _node._prev;
                        } while (_node !== _last);
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

                var _node;

                if ($is(value, __LinkedListNode)) {
                    _node = value;

                    if (_node._next === _node) {
                        this.head(null);
                    }
                    else {
                        _node._next._prev = _node._prev;
                        _node._prev._next = _node._next;

                        if (this.head() === _node) {
                            this.head(_node._next);
                        }
                    }
                    resetNode(_node);
                    this.count(this.count() - 1);
                }
                else {
                    if ((_node = this.find(value)) != null) {
                        this.remove(_node);
                        return true;
                    }
                    return false;
                }
            },

            /**
            * Removes the node at the start of the LinkedList.
            */
            removeFirst: function () {
                if (this.head() == null) {
                    throw new __error("Linked list is empty.");
                }

                this.remove(this.head());
            },

            /**
            * Removes the node at the end of the LinkedList.
            */
            removeLast: function () {
                if (this.head() == null) {
                    throw new __error("Linked list is empty.");
                }

                this.remove(this.head()._prev);
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                var _head = this.head(),
                    _node = _head;

                return new __Enumerator(function (yielder) {
                    if (_node != null) {
                        var _current = _node._value;

                        _node = _node._next;
                        if (_node === _head) {
                            _node = null;
                        }

                        return yielder(_current);
                    }
                });
            }
        });



        /* LinkedList Helper Functions
        ---------------------------------------------------------------------- */

        function resetNode(node) {
            node._list = null;
            node._next = null;
            node._prev = null;
        }

        function insertNodeBefore(list, node, newNode) {
            $ensureType(node, "node", __LinkedListNode);
            $ensureType(newNode, "newNode", __LinkedListNode);

            if (node._list !== list || newNode._list != null) {
                throw new __error("Invalid node list.");
            }

            newNode._list = list;
            newNode._next = node;
            newNode._prev = node._prev;

            node._prev._next = newNode;
            node._prev = newNode;
            list.count(list.count() + 1);
        }

        function insertNodeToEmptyList(list, newNode) {
            $ensureType(newNode, "newNode", __LinkedListNode);

            if (newNode._list != null) {
                throw new __error("Invalid node list.");
            }

            newNode._list = list;
            newNode._next = newNode;
            newNode._prev = newNode;
            list.head(newNode);
            list.count(list.count() + 1);
        }
    })();


    /**
    * Represents a first-in, first-out collection of objects.
    */
    var __Queue = (function () {

        /**
        * Initializes a new instance of the Queue class that that is empty or contains elements copied from the specified collection.
        * @param {Enumerable=} collection The collection to copy elements from.
        */
        function Queue(collection) {
            var _items = [];

            $define(this, "items", { value: function () { return _items; } });

            if (collection != null) {
                _items = $buffer(collection);
            }
        }

        return $extend(Queue, __Collection, {

            /**
            * Removes all objects from the Queue.
            */
            clear: function () {
                this.items().length = 0;
            },

            /**
            * Gets the number of elements contained in the Queue.
            * @returns {Number}
            */
            count: function () {
                return this.items().length;
            },

            /**
            * Determines whether an element is in the Queue.
            * @param {Object} item The object to locate in the Queue.
            * @returns {Boolean}
            */
            contains: function (item) {
                return this.items().indexOf(item) !== -1;
            },

            /**
            * Copies the Queue to an existing one-dimensional Array, starting at the specified array index.
            * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Queue.
            * @param {Number} arrayIndex The zero-based index in array at which copying begins.
            */
            copyTo: function (array, arrayIndex) {
                $bufferTo(this.items(), array, arrayIndex);
            },

            /**
            * Removes and returns the object at the beginning of the Queue.
            * @returns {Object}
            */
            dequeue: function () {
                return this.items().shift();
            },

            /**
            * Adds an object to the end of the Queue.
            * @param {Object} item The object to add to the Queue.
            */
            enqueue: function (item) {
                this.items().push(item);
            },

            /**
            * Returns the object at the beginning of the Queue without removing it.
            * @returns {Object}
            */
            peek: function () {
                return this.items()[0];
            },

            /**
            * Copies the Queue to a new array.
            * @returns {Array}
            */
            toArray: function () {
                return this.items().slice();
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                return $enumerator(this.items());
            }
        });
    })();


    /**
    * Represents a variable size last-in-first-out (LIFO) collection of instances of the same arbitrary type.
    */
    var __Stack = (function () {

        /**
        * Initializes a new instance of the Stack class that that is empty or contains elements copied from the specified collection.
        * @param {Enumerable=} collection The collection to copy elements from.
        */
        function Stack(collection) {
            var _items = [];

            $define(this, "items", { value: function () { return _items; } });

            if (collection != null) {
                _items = $buffer(collection);
            }
        }

        return $extend(Stack, __Collection, {

            /**
            * Removes all objects from the Stack.
            */
            clear: function () {
                this.items().length = 0;
            },

            /**
            * Gets the number of elements contained in the Stack.
            * @returns {Number}
            */
            count: function () {
                return this.items().length;
            },

            /**
            * Determines whether an element is in the Stack.
            * @param {Object} item The object to locate in the Stack.
            * @returns {Boolean}
            */
            contains: function (item) {
                return this.items().indexOf(item) !== -1;
            },

            /**
            * Copies the Stack to an existing one-dimensional Array, starting at the specified array index.
            * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Stack.
            * @param {Number} arrayIndex The zero-based index in array at which copying begins.
            */
            copyTo: function (array, arrayIndex) {
                $bufferTo(this.items(), array, arrayIndex);
            },

            /**
            * Returns the object at the top of the Stack without removing it.
            * @returns {Object}
            */
            peek: function () {
                return this.items()[this.count() - 1];
            },

            /**
            *   Removes and returns the object at the top of the Stack.
            *   @returns {Object}
            */
            pop: function () {
                return this.items().pop();
            },

            /**
            * Inserts an object at the top of the Stack.
            * @param {Object} item The object to push onto the Stack. 
            */
            push: function (item) {
                this.items().push(item);
            },

            /**
            *   Copies the Stack to a new array.
            *   @returns {Array}
            */
            toArray: function () {
                return this.items().slice();
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                return $enumerator(this.items());
            }
        });
    })();


    /**
    * Defines a data structures that map keys to Enumerable sequences of values.
    */
    var __Lookup = (function () {

        function Lookup(table) {
            $ensureType(table, "table", __HashTable);
            $define(this, "table", { value: function () { return table; } });
        }

        return $extend(Lookup, __Collection,
        {
            /**
            * Determines whether a specified key exists in the Lookup.
            * @param {Object} key The key to search for in the Lookup.
            * @returns {Boolean}
            */
            contains: function (key) {
                return this.table().contains(key);
            },

            /**
            * Gets the number of key/value collection pairs in the Lookup.
            * @returns {Number}
            */
            count: function () {
                return this.table().count();
            },

            /**
            * Gets the value associated with the specified key.
            * @param {Object} key The key of the element to add.
            * @returns {Grouping}
            */
            get: function (key) {
                var _entry = this.table().get(key);
                return new __Grouping(_entry == null ? [] : _entry.value, key);
            },

            /**
            * Returns an enumerator that iterates through a Grouping object.
            * @returns {Enumerable}
            */
            getEnumerator: function () {
                var _e = $enumerator(this.table());
                return new __Enumerator(function (yielder) {
                    while (_e.next()) {
                        return yielder(new __Grouping(_e.current.value, _e.current.key));
                    }
                });
            }
        },
        {
            create: function (source, keySelector, elementSelector, comparer) {
                keySelector = $lambda(keySelector);
                $ensureType(keySelector, "keySelector", __function);

                var _e = $enumerator(source),
                    _collection = $collection(source),
                    _table = new __HashTable(_collection ? _collection.count() : 0, comparer),
                    _lookup = new Lookup(_table);


                if (elementSelector) {
                    elementSelector = $lambda(elementSelector);
                    $ensureType(elementSelector, "elementSelector", __function);
                }

                while (_e.next()) {
                    var _current = _e.current,
                        _key = keySelector(_current),
                        _entry = _table.get(_key),
                        _val = elementSelector ? elementSelector(_current) : _current;

                    if (_entry == null) {
                        _table.add(_key, [_val]);
                    }
                    else {
                        _entry.value.push(_val);
                    }
                }

                return _lookup;
            }
        });
    })();


    /**
    * Represents a collection of objects that have a common key.
    */
    var __Grouping = (function () {

        function Grouping(buffer, key) {

            /**
            * Gets the key of the Grouping.
            */
            this.key = key;
            this.elements = buffer;

            $freeze(this);
        }

        return $extend(Grouping, __Collection, {
            /**
            * Gets the number of elements contained in the Grouping.
            * @returns {Number}
            */
            count: function () {
                return this.elements.length;
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                return $enumerator(this.elements);
            }
        });

    })();


    /**
    * Exposes the enumerator, which supports a simple iteration over a collection of a specified type.
    */
    var __OrderedEnumerable = (function () {

        function OrderedEnumerable(source, keySelector, comparer, descending, parent) {
            var _comparer = $comparer(comparer);

            keySelector = $lambda(keySelector);
            $ensureType(keySelector, "keySelector", __function);

            $mixin(this, {
                source: function () {
                    return source;
                },

                sorter: function (next) {
                    var _sorter = new EnumerableSorter(keySelector, _comparer, descending, next);

                    if (parent != null) {
                        _sorter = parent.sorter(_sorter);
                    }

                    return _sorter;
                }
            });
        }

        function EnumerableSorter(keySelector, comparer, descending, next) {
            this.keySelector = keySelector;
            this.comparer = comparer;
            this.descending = descending;
            this.next = next;
        }

        $extend(EnumerableSorter, {
            computeKeys: function (elements, count) {
                var _keys = new __array(count),
                    _selector = this.keySelector;

                for (var i = 0; i < count; i++) {
                    _keys[i] = _selector(elements[i]);
                }

                if (this.next != null) {
                    this.next.computeKeys(elements, count);
                }

                this.keys = _keys;
            },

            compareKeys: function (index1, index2) {
                var _c = this.comparer.compare(this.keys[index1], this.keys[index2]);

                if (_c === 0) {
                    if (this.next == null) {
                        return index1 - index2;
                    }
                    return this.next.compareKeys(index1, index2);
                }

                return this.descending ? -_c : _c;
            },

            sort: function (elements, count) {
                this.computeKeys(elements, count);
                var _map = new __array(count);

                for (var i = 0; i < count; i++) {
                    _map[i] = i;
                }

                this.quickSort(_map, 0, count - 1);

                return _map;
            },

            quickSort: function (map, left, right) {
                do {
                    var _i = left,
                        _j = right,
                        _x = map[_i + ((_j - _i) >> 1)];

                    do {
                        while (_i < map.length && this.compareKeys(_x, map[_i]) > 0) {
                            _i++;
                        }

                        while (_j >= 0 && this.compareKeys(_x, map[_j]) < 0) {
                            _j--;
                        }

                        if (_i > _j) {
                            break;
                        }

                        if (_i < _j) {
                            var temp = map[_i];
                            map[_i] = map[_j];
                            map[_j] = temp;
                        }
                        _i++;
                        _j--;

                    } while (_i <= _j);

                    if (_j - left <= right - _i) {
                        if (left < _j) {
                            this.quickSort(map, left, _j);
                        }

                        left = _i;
                    }
                    else {
                        if (_i < right) {
                            this.quickSort(map, _i, right);
                        }

                        right = _j;
                    }
                } while (left < right);
            }
        });

        return $extend(OrderedEnumerable, __Enumerable, {

            /**
            * Performs a subsequent ordering on the elements of an IOrderedEnumerable<TElement> according to a key.
            * @param {Function} keySelector The selector used to extract the key for each element.
            * @param {Comparer} comparer The Comparer used to compare keys for placement in the returned sequence.
            * @param {Boolean} descending true to sort the elements in descending order; false to sort the elements in ascending order.
            */
            createOrderedEnumerable: function (keySelector, comparer, descending) {
                return new OrderedEnumerable(this.source(), keySelector, comparer, descending, this);
            },

            /**
            * Performs a subsequent ordering of the elements in a sequence in ascending order by using a comparer.
            * @param {Function} keySelector A function to extract a key from each element. eg. function(item)
            * @param {Comparer=} comparer A Comparer to compare keys.
            * @returns {OrderedEnumerable}
            */
            thenBy: function (keySelector, comparer) {
                return this.createOrderedEnumerable(keySelector, comparer, false);
            },

            /**
            * Performs a subsequent ordering of the elements in a sequence in descending order by using a comparer.
            * @param {Function} keySelector A function to extract a key from each element. eg. function(item)
            * @param {Comparer=} comparer A Comparer to compare keys.
            * @returns {OrderedEnumerable}
            */
            thenByDescending: function (keySelector, comparer) {
                return this.createOrderedEnumerable(keySelector, comparer, true);
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                var _source = this.source(),
                    _this = this,
                    _buffer,
                    _map,
                    _index = 0;

                return new __Enumerator(function (yielder) {
                    if (_buffer == null) {
                        _buffer = $buffer(_source);
                        _map = _this.sorter(null).sort(_buffer, _buffer.length);
                    }

                    if (_index < _buffer.length) {
                        return yielder(_buffer[_map[_index++]]);
                    }
                });
            }
        });

    })();


    /**
    * Defines Enumerable extention methods, applies on String, Array and Enumerable
    */
    var __EnumerableExtensions = (function () {

        var extensions = {

            /**
            * Applies an accumulator function over a sequence.
            * @param {Object|Function} funcOrSeed An accumulator function to be invoked on each element or the initial accumulator value.
            * @param {Function} func An accumulator function to be invoked on each element. eg. function(accumulate, item)
            * @param {Function} resultSelector A function to transform the final accumulator value into the result value. eg. function(accumulate)
            * @returns {Object}
            */
            aggregate: function (funcOrSeed, func, resultSelector) {

                var _args = arguments,
                    _result,
                    _e = $enumerator(this),
                    _func = _args.length === 1 ? $lambda(funcOrSeed) : $lambda(func),
                    _seed = _args.length === 1 ? __undefined : funcOrSeed;

                $ensureType(_func, "func", __function);

                if (resultSelector) {
                    resultSelector = $lambda(resultSelector);
                    $ensureType(resultSelector, "resultSelector", __function);
                }

                if (_seed === __undefined) {
                    if (!_e.next()) {
                        throw noMatchError();
                    }
                    _result = _e.current;
                }
                else {
                    _result = _seed;
                }

                while (_e.next()) {
                    _result = _func(_result, _e.current);
                }

                return resultSelector ? resultSelector(_result) : _result;
            },

            /**
            * Determines whether all elements of a sequence satisfy a condition.
            * Returns true if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
            * @param {Function} predicate A function to test each element for a condition. eg. function(item).
            * @returns {Boolean}
            */
            all: function (predicate) {
                predicate = $lambda(predicate);
                $ensureType(predicate, "predicate", __function);

                var _e = $enumerator(this);

                while (_e.next()) {
                    if (predicate(_e.current) === false) {
                        return false;
                    }
                }

                return true;
            },

            /**
            * Determines whether a sequence contains any elements.
            * Returns true if any elements in the source sequence contains any elements or pass the test in the specified predicate; otherwise, false.
            * @param {Function=} predicate A function to test each element for a condition. eg. function(item).
            * @returns {Boolean}
            */
            any: function (predicate) {

                var _e = $enumerator(this);

                if (predicate) {
                    predicate = $lambda(predicate);
                    $ensureType(predicate, "predicate", __function);

                    while (_e.next()) {
                        if (predicate(_e.current) === true) {
                            return true;
                        }
                    }

                }
                else if (_e.next()) {
                    return true;
                }

                return false;
            },

            /**
            * Returns the input typed as Enumerable.
            * @returns {Enumerable}
            */
            asEnumerable: function () {
                return $enumerable(this);
            },

            /**
            * Computes the average of a sequence of numeric values.
            * @param {Function=} selector A transform function to apply to each element. eg.function(item).
            * @returns {Number}
            */
            average: function (selector) {

                if (selector) {
                    selector = $lambda(selector);
                    $ensureType(selector, "selector", __function);
                    return $enumerable(this).select(selector).average();
                }

                if ($is(this, __array) && $isFunc(this.reduce)) {

                    if (this.length == 0) throw new noElementsError();
                    return this.sum() / this.length;
                }

                var _e = $enumerator(this),
                    _sum = 0,
                    _count = 0;

                while (_e.next()) {

                    if (isNaN(_e.current)) {
                        throw numericTypeError();
                    }

                    _sum += _e.current;
                    _count++;
                }

                if (_count === 0) {
                    throw noElementsError();
                }

                return _sum / _count;
            },

            /**
            * Concatenates two sequences.
            * @param {Enumerable} second The sequence to concatenate to the first sequence.
            * @returns {Enumerable}
            */
            concat: function (second) {
                $nullCheck(second, "second");

                var _source = this;

                return new __Enumerable(function () {
                    var _eFirst = $enumerator(_source),
                        _eSecond = $enumerator(second);

                    return new __Enumerator(function (yielder) {

                        while (_eFirst.next()) {
                            return yielder(_eFirst.current);
                        }

                        while (_eSecond.next()) {
                            return yielder(_eSecond.current);
                        }

                        _eSecond = _eFirst = null;
                    });
                });
            },

            /**
            * Determines whether a sequence contains a specified element by using an equality comparer.
            * @param {Object} value The value to locate in the sequence.
            * @param {EqualityComparer=} comparer An equality comparer to compare values.
            * @returns {Boolean}
            */
            contains: function (value, comparer) {

                var _comparer = $equalityComparer(comparer),
                    _e = $enumerator(this);

                while (_e.next()) {
                    if ($equals(_e.current, value, _comparer)) {
                        return true;
                    }
                }

                return false;
            },

            /**
            * Returns the number of elements in a sequence.
            * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
            * @returns {Number}
            */
            count: function (predicate) {

                if (predicate) {
                    predicate = $lambda(predicate);
                    $ensureType(predicate, "predicate", __function);
                    return $enumerable(this).where(predicate).count();
                }

                if (isArrayLike(this)) {
                    return this.length;
                }
                else {
                    var _e = $enumerator(this),
                        _index = 0;

                    while (_e.next()) {
                        _index++;
                    }

                    return _index;
                }
            },

            /**
            * Returns the elements of the specified sequence or the specified value in  a singleton collection if the sequence is empty.
            * @param {Object=} defaultValue The value to return if the sequence is empty.
            * @returns {Enumerable}
            */
            defaultIfEmpty: function (defaultValue) {
                var _source = this;

                return new __Enumerable(function () {
                    var _e = $enumerator(_source);

                    return new __Enumerator(function (yielder) {
                        if (_e.next()) {
                            do {
                                return yielder(_e.current);
                            } while (_e.next());
                        }
                        else {
                            _e = null;
                            return yielder(defaultValue == null ? null : defaultValue);
                        }
                    });
                });
            },

            /**
            * Produces the set difference of two sequences by using the EqualityComparer to compare values.
            * @param {EqualityComparer=} comparer An EqualityComparer to compare values.
            * @returns {Enumerable}
            */
            distinct: function (comparer) {

                var _source = this;

                return new __Enumerable(function () {

                    var _e = $enumerator(_source),
                        _collection = $collection(_source),
                        _table = new __HashTable(_collection ? _collection.count() : 0, comparer);

                    return new __Enumerator(function (yielder) {
                        while (_e.next()) {
                            if (_table.add(_e.current)) {
                                return yielder(_e.current);
                            }
                        }
                    });
                });
            },

            /**
            * Produces the set difference of two sequences by using the specified EqualityComparer to compare values.
            * @param {Enumerable} second An Enumerable whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
            * @param {EqualityComparer=} comparer An EqualityComparer to compare values.
            * @returns {Enumerable}
            */
            except: function (second, comparer) {

                var _source = this;

                return new __Enumerable(function () {
                    var _eFirst = $enumerator(_source),
                        _hashset = new __HashSet(second, comparer);

                    return new __Enumerator(function (yielder) {

                        while (_eFirst.next()) {
                            if (!_hashset.contains(_eFirst.current)) {
                                return yielder(_eFirst.current);
                            }
                        }
                    });
                });
            },

            /**
            * Returns the element at a specified index in a sequence. Throws an error if the index is less than 0 or greater than or equal to the number of elements in source.
            * @param {Number} index The zero-based index of the element to retrieve.
            * @returns {Object}
            */
            elementAt: function (index) {
                $ensureType(index, "index", __number);

                if (index < 0) {
                    throw argumentOutOfRangeError("index");
                }

                if (isArrayLike(this)) {
                    if (index < this.length) {
                        return this[index];
                    }
                }
                else {
                    var _e = $enumerator(this),
                        _index = 0;

                    while (_e.next()) {
                        if (index === _index++) {
                            return _e.current;
                        }
                    }
                }

                throw argumentOutOfRangeError("index");
            },

            /**
            * Returns the first element in a sequence that satisfies a specified condition. this method throws an exception if there is no element in the sequence.
            * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
            * @returns {Object}
            */
            first: function (predicate) {

                var _e = $enumerator(this);

                if (predicate) {

                    predicate = $lambda(predicate);
                    $ensureType(predicate, "predicate", __function);

                    while (_e.next()) {
                        if (predicate(_e.current)) {
                            return _e.current;
                        }
                    }

                    throw noMatchError();
                }
                else {
                    if (isArrayLike(this)) {
                        if (this.length > 0) {
                            return this[0];
                        }
                    }

                    else if (_e.next()) {
                        return _e.current;
                    }
                }

                throw noMatchError();
            },

            /**
            * Returns the first element of the sequence that satisfies a condition or a default value if no such element is found.
            * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
            * @param {Object=} defaultValue The value to return if no element exists with specified condition.
            * @returns {Object}
            */
            firstOrDefault: function (predicate, defaultValue) {

                var _e = $enumerator(this);

                if (predicate) {
                    predicate = $lambda(predicate);
                    $ensureType(predicate, "predicate", __function);

                    while (_e.next()) {
                        if (predicate(_e.current)) {
                            return _e.current;
                        }
                    }
                }
                else {
                    if (isArrayLike(this)) {
                        if (this.length > 0) {
                            return this[0];
                        }
                    }

                    else if (_e.next()) {
                        return _e.current;
                    }
                }

                return defaultValue || null;
            },

            /**
            * Performs the specified action on each element of an Enumerable.
            * @param {Function} action The action function to perform on each element of an Enumerable. eg. function(item, index)
            */
            forEach: function (action) {
                action = $lambda(action);
                $ensureType(action, "action", __function);

                var _e = $enumerator(this),
                    _index = 0;

                while (_e.next()) {
                    action(_e.current, _index++);
                }
            },

            /**
            * Groups the elements of a sequence according to a key selector function. 
            * @param {Function} keySelector A function to extract the key for each element. eg. function(item)
            * @param {Function=} elementSelector A function to map each source element to an element in the Grouping. eg. function(item)
            * @param {Function=} resultSelector A function to extract the key for each element. eg. function(item)
            * @param {EqualityComparer=} comparer An equality comparer to compare values.
            * @returns {Enumerable}
            */
            groupBy: function (keySelector) {

                keySelector = $lambda(keySelector);
                $ensureType(keySelector, "keySelector", __function);

                var _args = arguments,
                    _elementSelector = $lambda(_args[2]),
                    _resultSelector = $lambda(_args[3]),
                    _comparer = _args.length === 2 && !_elementSelector ? _args[1] : (_args.length === 3 && !_resultSelector ? _args[2] : _args[3]),
                    _source = this;

                return new __Enumerable(function () {

                    var _e = $enumerator(__Lookup.create(_source, keySelector, _elementSelector, _comparer));

                    return new __Enumerator(function (yielder) {

                        if (_resultSelector) {
                            while (_e.next()) {
                                return yielder(_resultSelector(_e.current.key, _e.current.value));
                            }
                        }
                        else {
                            while (_e.next()) {
                                return yielder(_e.current);
                            }
                        }
                    });
                });
            },

            /**
            * Correlates the elements of two sequences based on key equality and groups the results. A specified EqualityComparer is used to compare keys.
            * @param {Enumerable} inner The sequence to join to the current sequence.
            * @param {Function} outerKeySelector A function to extract the join key from each element of the first sequence. eg. function(outer)
            * @param {Function} innerKeySelector A function to extract the join key from each element of the second sequence. function(inner)
            * @param {Function} resultSelector A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence. eg. function(outer, inner)
            * @param {EqualityComparer=} comparer An equality comparer to compare values.
            * @returns {Enumerable}
            */
            groupJoin: function (inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
                outerKeySelector = $lambda(outerKeySelector);
                innerKeySelector = $lambda(innerKeySelector);
                resultSelector = $lambda(resultSelector);

                $nullCheck(inner, "inner");
                $ensureType(outerKeySelector, "outerKeySelector", __function);
                $ensureType(innerKeySelector, "innerKeySelector", __function);
                $ensureType(resultSelector, "resultSelector", __function);

                var _source = this;

                return new __Enumerable(function () {
                    var _e = $enumerator(_source),
                        _lookup = __Lookup.create(inner, innerKeySelector, null, comparer);

                    return new __Enumerator(function (yielder) {
                        while (_e.next()) {
                            return yielder(resultSelector(_e.current, _lookup.get(outerKeySelector(_e.current))));
                        }
                    });
                });
            },

            /**
            * Produces the set intersection of two sequences by using the default equality comparer to compare values.
            * @param {Enumerable} second An Enumerable whose distinct elements that also appear in the first sequence will be returned.
            * @param {EqualityComparer=} comparer An EqualityComparer to compare values.
            * @returns {Enumerable}
            */
            intersect: function (second, comparer) {

                var _source = this;

                return new __Enumerable(function () {
                    var _e = $enumerator(_source),
                        _hashset = new __HashSet(second, comparer);

                    return new __Enumerator(function (yielder) {

                        while (_e.next()) {
                            if (_hashset.contains(_e.current)) {
                                return yielder(_e.current);
                            }
                        }
                    });
                });
            },

            /**
            * Correlates the elements of two sequences based on matching keys. A specified EqualityComparer is used to compare keys.
            * @param {Enumerable} inner The sequence to join to the current sequence.
            * @param {Function} outerKeySelector A function to extract the join key from each element of the first sequence. eg. function(outer)
            * @param {Function} innerKeySelector A function to extract the join key from each element of the second sequence. function(inner)
            * @param {Function} resultSelector A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence. eg. function(outer, inner)
            * @param {EqualityComparer=} comparer An equality comparer to compare values.
            * @returns {Enumerable}
            */
            join: function (inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
                outerKeySelector = $lambda(outerKeySelector);
                innerKeySelector = $lambda(innerKeySelector);
                resultSelector = $lambda(resultSelector);

                $nullCheck(inner, "inner");
                $ensureType(outerKeySelector, "outerKeySelector", __function);
                $ensureType(innerKeySelector, "innerKeySelector", __function);
                $ensureType(resultSelector, "resultSelector", __function);

                var _source = this;

                return new __Enumerable(function () {
                    var _eOuter = $enumerator(_source),
                        _lookup,
                        _entry,
                        _index = 0;

                    return new __Enumerator(function (yielder) {

                        if (_lookup == null) {
                            _lookup = __Lookup.create(inner, innerKeySelector, null, comparer);
                            if (!_eOuter.next()) {
                                return;
                            }
                        }

                        do {
                            _entry = _entry || _lookup.get(outerKeySelector(_eOuter.current));

                            if (_index < _entry.count()) {
                                return yielder(resultSelector(_eOuter.current, _entry.elements[_index++]));
                            }
                            else {
                                _index = 0;
                                _entry = null;
                            }
                        }
                        while (_eOuter.next());
                    });
                });
            },

            /**
            * Returns the last element of a sequence that satisfies a specified condition.
            * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
            * @returns {Object}
            */
            last: function (predicate) {

                var _e = $enumerator(this),
                    _result;

                if (predicate) {
                    predicate = $lambda(predicate);
                    $ensureType(predicate, "predicate", __function);

                    var _found = false;

                    while (_e.next()) {
                        if (predicate(_e.current)) {
                            _result = _e.current;
                            _found = true;
                        }
                    }

                    if (_found) {
                        return _result;
                    }

                    throw noMatchError();
                }
                else {
                    if (isArrayLike(this)) {
                        if (this.length > 0) {
                            return this[this.length - 1];
                        }
                    }

                    else if (_e.next()) {
                        do {
                            _result = _e.current;
                        } while (_e.next());

                        return _result;
                    }
                }

                throw noMatchError();
            },

            /**
            * Returns the last element of a sequence that satisfies a condition or a default value if no such element is found.
            * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
            * @param {Object=} defaultValue The value to return if no element exists with specified condition.
            * @returns {Object}
            */
            lastOrDefault: function (predicate, defaultValue) {

                var _e = $enumerator(this),
                    _result = defaultValue || null;

                if (predicate) {
                    predicate = $lambda(predicate);
                    $ensureType(predicate, "predicate", __function);

                    while (_e.next()) {
                        if (predicate(_e.current)) {
                            _result = _e.current;
                        }
                    }
                }
                else {
                    if (isArrayLike(this)) {
                        if (this.length > 0) {
                            return this[this.length - 1];
                        }
                    }

                    else if (_e.next()) {
                        do {
                            _result = _e.current;
                        } while (_e.next());
                    }
                }

                return _result;
            },

            /**
            * Invokes a transform function on each element of a sequence and returns the maximum value.
            * @param {Function=} selector A transform function to apply to each element. eg. function(item)
            * @returns {Object}
            */
            max: function (selector) {

                if (selector) {
                    selector = $lambda(selector);
                    $ensureType(selector, "selector", __function);
                    return $enumerable(this).select(selector).max();
                }

                if ($is(this, __array) && $isFunc(this.reduce)) {

                    if (this.length == 0) throw new noElementsError();

                    return this.reduce(function (a, b) {
                        return $computeCompare(a, b) > 0 ? a : b;
                    }, this[0]);
                }

                var _e = $enumerator(this),
                    _value = null;

                if (_e.next()) {
                    do {
                        if (_e.current != null && (_value == null || $computeCompare(_e.current, _value) > 0)) {
                            _value = _e.current;
                        }
                    }
                    while (_e.next());
                }
                else {
                    throw new noElementsError();
                }

                return _value;
            },

            /**
            * Invokes a transform function on each element of a sequence and returns the minimum value.
            * @param {Function=} selector A transform function to apply to each element. eg. function(item)
            * @returns {Object}
            */
            min: function (selector) {

                if (selector) {
                    selector = $lambda(selector);
                    $ensureType(selector, "selector", __function);
                    return $enumerable(this).select(selector).min();
                }

                if ($is(this, __array) && $isFunc(this.reduce)) {

                    if (this.length == 0) throw new noElementsError();

                    return this.reduce(function (a, b) {
                        return $computeCompare(a, b) < 0 ? a : b;
                    }, this[0]);
                }

                var _e = $enumerator(this),
                    _value = null;

                if (_e.next()) {
                    do {

                        if (_e.current != null && (_value == null || $computeCompare(_e.current, _value) < 0)) {
                            _value = _e.current;
                        }
                    }
                    while (_e.next());
                }
                else {
                    throw new noElementsError();
                }

                return _value;
            },

            /**
            * Filters the elements of an Enumerable based on a specified type.
            * @param {Function} type The type to filter the elements of the sequence on.
            * @returns {Enumerable}
            */
            ofType: function (type) {
                $ensureType(type, "type", __function);

                var _source = this;

                return new __Enumerable(function () {
                    var _e = $enumerator(_source);

                    return new __Enumerator(function (yielder) {
                        while (_e.next()) {
                            if ($is(_e.current, type)) {
                                return yielder(_e.current);
                            }
                        }
                    });
                });
            },

            /**
            * Sorts the elements of a sequence in ascending order by using a specified comparer.
            * @param {Function} keySelector A function to extract a key from each element. eg. function(item)
            * @param {Comparer=} comparer A Comparer to compare keys.
            * @returns {OrderedEnumerable}
            */
            orderBy: function (keySelector, comparer) {
                return new __OrderedEnumerable(this, keySelector, comparer, false);
            },

            /**
            * Sorts the elements of a sequence in descending order by using a specified comparer.
            * @param {Function} keySelector A function to extract a key from each element. eg. function(item)
            * @param {Comparer=} comparer A Comparer to compare keys.
            * @returns {OrderedEnumerable}
            */
            orderByDescending: function (keySelector, comparer) {
                return new __OrderedEnumerable(this, keySelector, comparer, true);
            },

            /**
            * Inverts the order of the elements in a sequence.
            * @returns {Enumerable}
            */
            reverse: function () {
                var _buffer = $buffer(this);
                return new __Enumerable(_buffer.reverse());
            },

            /**
            * Determines whether two sequences are equal by comparing their elements by using an EqualityComparer.
            * @param {Enumerable} second An Enumerable to compare to the first sequence.
            * @param {EqualityComparer=} comparer The EqualityComparer to compare values.
            * @returns {Boolean}
            */
            sequenceEqual: function (second, comparer) {

                var _arr1 = $buffer(this),
                    _arr2 = $buffer(second),
                    _comparer = $equalityComparer(comparer),
                    _len = _arr1.length;

                if (_len === _arr2.length) {
                    for (; _len--;) {
                        var _item1 = _arr1[_len],
                            _item2 = _arr2[_len];

                        if ($equals(_item1, _item2, _comparer)) {
                            return false;
                        }
                    }

                    return true;
                }

                return false;
            },

            /**
            * Projects each element of a sequence into a new form.
            * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element. eg. function(item, index)
            * @returns {Enumerable}
            */
            select: function (selector) {
                selector = $lambda(selector);
                $ensureType(selector, "selector", __function);

                var _source = this;

                return new __Enumerable(function () {
                    var _e = $enumerator(_source),
                        _index = 0;

                    return new __Enumerator(function (yielder) {
                        while (_e.next()) {
                            return yielder(selector(_e.current, _index++));
                        }
                    });
                });
            },

            /**
            * Projects each element of a sequence to an Enumerable and flattens the resulting sequences into one sequence.
            * @param {Function} collectionSelector A transform function to apply to each source element; the second parameter of the function represents the index of the source element. eg. function(item, index)
            * @param {Function=} resultSelector A transform function to apply to each element of the intermediate sequence. eg. function(item, collection)
            * @returns {Enumerable}
            */
            selectMany: function (collectionSelector, resultSelector) {
                collectionSelector = $lambda(collectionSelector);
                $ensureType(collectionSelector, "collectionSelector", __function);

                if (resultSelector) {
                    resultSelector = $lambda(resultSelector);
                    $ensureType(resultSelector, "resultSelector", __function);
                }

                var _source = this;

                return new __Enumerable(function () {
                    var _eSource = $enumerator(_source),
                        _eCollection,
                        _index = 0;

                    return new __Enumerator(function (yielder) {
                        while (_eCollection != null || _eSource.next()) {
                            _eCollection = _eCollection || $enumerator(collectionSelector(_eSource.current, _index++));

                            while (_eCollection.next()) {
                                return yielder(resultSelector ? resultSelector(_eSource.current, _eCollection.current) : _eCollection.current);
                            }

                            _eCollection = null;
                        }
                    });
                });
            },

            /**
            * Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.
            * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
            * @returns {Object}
            */
            single: function (predicate) {

                var _e = $enumerator(this),
                    _count = -1,
                    _result;

                if (predicate) {
                    predicate = $lambda(predicate);
                    $ensureType(predicate, "predicate", __function);

                    _count = 0;

                    while (_e.next()) {
                        if (_count > 1) {
                            break;
                        }

                        if (predicate(_e.current)) {
                            _result = _e.current;
                            _count++;
                        }
                    }

                    switch (_count) {
                        case 0: throw noMatchError();
                        case 1: return _result;
                    }

                    throw moreThanOneMatchError();
                }
                else {
                    if (isArrayLike(this)) {
                        switch (this.length) {
                            case 0: throw noMatchError();
                            case 1: return this[0];
                        }
                    }

                    if (!_e.next()) {
                        throw noMatchError();
                    }

                    _result = _e.current;

                    if (!_e.next()) {
                        return _result;
                    }

                    throw new moreThanOneElementError();
                }
            },

            /**
            * Returns the only element of a sequence that satisfies a specified condition or a default value if no such element exists; this method throws an exception if more than one element satisfies the condition.
            * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
            * @param {Object=} defaultValue The value to return if no element exists with specified condition.
            * @returns {Object}
            */
            singleOrDefault: function (predicate, defaultValue) {

                var _e = $enumerator(this),
                    _result = defaultValue || null;

                if (predicate) {
                    predicate = $lambda(predicate);
                    $ensureType(predicate, "predicate", __function);

                    var _count = 0;

                    while (_e.next()) {
                        if (predicate(_e.current)) {
                            if (_count > 1) {
                                break;
                            }

                            _result = _e.current;
                            _count++;
                        }
                    }

                    if (_count < 2) {
                        return _result;
                    }

                    throw moreThanOneMatchError();
                }
                else {
                    if (isArrayLike(this)) {
                        switch (this.length) {
                            case 0: return _result;
                            case 1: return this[0];
                        }
                    }

                    if (!_e.next()) {
                        return _result;
                    }

                    _result = _e.current;

                    if (!_e.next()) {
                        return _result;
                    }

                    throw new moreThanOneElementError();
                }
            },

            /**
            * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
            * @param {Number} count The number of elements to skip before returning the remaining elements.
            * @returns {Enumerable}
            */
            skip: function (count) {
                $ensureType(count, "count", __number);

                var _source = this;

                return new __Enumerable(function () {
                    var _e = $enumerator(_source),
                        _index = 0;

                    return new __Enumerator(function (yielder) {
                        while (_e.next()) {
                            if (_index++ >= count) {
                                return yielder(_e.current);
                            }
                        }
                    });
                });
            },

            /**
            * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements. The element's index is used in the logic of the predicate function.
            * @param {Function=} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element. eg. function(item, index)
            * @returns {Enumerable}
            */
            skipWhile: function (predicate) {

                predicate = $lambda(predicate);
                $ensureType(predicate, "predicate", __function);

                var _source = this;

                return new __Enumerable(function () {
                    var _e = $enumerator(_source),
                        _yielding = false,
                        _index = -1;

                    return new __Enumerator(function (yielder) {
                        while (_e.next()) {
                            _index++;

                            if (!_yielding && !predicate(_e.current, _index)) {
                                _yielding = true;
                            }

                            if (_yielding) {
                                return yielder(_e.current);
                            }
                        }
                    });
                });
            },

            /**
            * Computes the sum of the sequence of values that are obtained by invoking a transform function on each element of the input sequence.
            * @param {Function=} selector A transform function to apply to each element. eg. function(item)
            * @returns {Number}
            */
            sum: function (selector) {

                if (selector) {
                    selector = $lambda(selector);
                    $ensureType(selector, "selector", __function);
                    return $enumerable(this).select(selector).sum();
                }

                if ($is(this, __array) && $isFunc(this.reduce)) {
                    return this.reduce(function (a, b) {
                        return a + b;
                    }, 0);
                }

                var _e = $enumerator(this),
                    _sum = 0;

                while (_e.next()) {

                    if (isNaN(_e.current)) {
                        throw numericTypeError();
                    }

                    _sum += _e.current;
                }

                return _sum;
            },

            /**
            * Returns a specified number of contiguous elements from the start of a sequence.
            * @param {Number} count The number of elements to return.
            * @returns {Enumerable}
            */
            take: function (count) {
                $ensureType(count, "count", __number);

                var _source = this;

                return new __Enumerable(function () {
                    var _e = $enumerator(_source),
                        _index = 0;

                    return new __Enumerator(function (yielder) {
                        while (_index++ < count && _e.next()) {
                            return yielder(_e.current);
                        }
                    });
                });
            },

            /**
            * Returns elements from a sequence as long as a specified condition is true. The element's index is used in the logic of the predicate function.
            * @param {Function=} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element. eg. Function(item, index)
            * @returns {Enumerable}
            */
            takeWhile: function (predicate) {

                predicate = $lambda(predicate);
                $ensureType(predicate, "predicate", __function);

                var _source = this;

                return new __Enumerable(function () {
                    var _e = $enumerator(_source),
                        _index = -1;

                    return new __Enumerator(function (yielder) {
                        while (_e.next()) {
                            _index++;

                            if (!predicate(_e.current, _index)) {
                                break;
                            }

                            return yielder(_e.current);
                        }
                    });
                });
            },

            /**
            * Creates an array from an Enumerable.
            * @returns {Array}
            */
            toArray: function () {
                return $buffer(this);
            },

            /**
            * Creates a Dictionary from an Enumerable according to a specified key selector function, a comparer, and an element selector function.
            * @param {Function} keySelector A function to extract a key from each element. eg. function(item)
            * @param {Function=} valueSelector A transform function to produce a result element value from each element. eg. function(item)
            * @param {EqualityComparer=} comparer An equality comparer to compare values.
            * @returns {Dictionary}
            */
            toDictionary: function (keySelector) {

                keySelector = $lambda(keySelector);
                $ensureType(keySelector, "keySelector", __function);

                var _args = arguments,
                    _elementSelector = $lambda(_args[1]),
                    _comparer = _args.length === 2 && !_elementSelector ? _args[1] : _args[2],
                    _dic = new __Dictionary(_comparer),
                    _e = $enumerator(this);

                if (_elementSelector) {
                    while (_e.next()) {
                        _dic.add(keySelector(_e.current), _elementSelector(_e.current));
                    }
                }
                else {
                    while (_e.next()) {
                        _dic.add(keySelector(_e.current), _e.current);
                    }
                }

                return _dic;
            },

            /**
            * Creates a List from an Enumerable.
            * @returns {List}
            */
            toList: function () {
                return new __List(this);
            },

            /**
            * Creates a Lookup from an Enumerable according to a specified key selector function, a comparer and an element selector function.
            * @param {Function} keySelector A function to extract a key from each element. eg. function(item)
            * @param {Function=} valueSelector A transform function to produce a result element value from each element. eg. function(item)
            * @param {EqualityComparer=} comparer An equality comparer to compare values.
            * @returns {Lookup}
            */
            toLookup: function (keySelector) {
                keySelector = $lambda(keySelector);
                $ensureType(keySelector, "keySelector", __function);

                var _args = arguments,
                    _elementSelector = $lambda(_args[1]),
                    _comparer = _args.length === 2 && !_elementSelector ? _args[1] : _args[2];

                return __Lookup.create(this, keySelector, _elementSelector, _comparer);
            },

            /**
            * Produces the set union of two sequences by using a specified EqualityComparer.
            * @param {Enumerable} second An Enumerable whose distinct elements form the second set for the union.
            * @param {EqualityComparer=} comparer The EqualityComparer to compare values.
            * @returns {Enumerable}
            */
            union: function (second, comparer) {

                var _source = this;

                return new __Enumerable(function () {
                    var _eFirst = $enumerator(_source),
                        _eSecond = $enumerator(second),
                        _set = new __HashSet(comparer);

                    return new __Enumerator(function (yielder) {

                        while (_eFirst.next()) {
                            if (_set.add(_eFirst.current)) {
                                return yielder(_eFirst.current);
                            }
                        }

                        while (_eSecond.next()) {
                            if (_set.add(_eSecond.current)) {
                                return yielder(_eSecond.current);
                            }
                        }
                    });
                });
            },

            /**
            * Filters a sequence of values based on a predicate. Each element's index is used in the logic of the predicate function.
            * @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element. eg. function(item, index)
            * @returns {Enumerable}
            */
            where: function (predicate) {
                predicate = $lambda(predicate);
                $ensureType(predicate, "predicate", __function);

                var _source = this;

                return new __Enumerable(function () {
                    var _e = $enumerator(_source),
                        _index = 0;

                    return new __Enumerator(function (yielder) {

                        while (_e.next()) {
                            if (predicate(_e.current, _index++)) {
                                return yielder(_e.current);
                            }
                        }
                    });
                });
            },

            /**
            * Merges two sequences by using the specified predicate function.
            * @param {Enumerable} second The second sequence to merge.
            * @param {Function} resultSelector A function that specifies how to merge the elements from the two sequences. eg. function(first, second)
            * @returns {Enumerable}
            */
            zip: function (second, resultSelector) {

                resultSelector = $lambda(resultSelector);
                $ensureType(resultSelector, "resultSelector", __function);

                var _source = this;

                return new __Enumerable(function () {
                    var _eFirst = $enumerator(_source),
                        _eSecond = $enumerator(second);

                    return new __Enumerator(function (yielder) {
                        while (_eFirst.next() && _eSecond.next()) {
                            return yielder(resultSelector(_eFirst.current, _eSecond.current));
                        }

                        _eSecond = null;
                    });
                });
            },
        };

        /**
        * Returns true if the value is Array, String, List or Array-like, otherwise false
        * @param {Enumerable} value An Enumerable object.
        * @returns {Boolean}
        */
        function isArrayLike(value) {
            if ($is(value, __array) || $is(value, __string) || $is(value, __List)) {
                return true;
            }

            return value && value.length != null && $isFunc(value.splice);
        }

        /**
        * Creates a new MoreThanOneElementError.
        * @returns {Error}
        */
        function moreThanOneElementError() {
            return new __error("Sequence contains more than one element.");
        }

        /**
        * Creates a new MoreThanOneMatchError.
        * @returns {Error}
        */
        function moreThanOneMatchError() {
            return new __error("Sequence contains more than one match.");
        }

        /**
        * Creates a new NoMatchError.
        * @returns {Error}
        */
        function noMatchError() {
            return new __error("Sequence contains no matching element.");
        }

        /**
        * Creates a new NoElementsError.
        * @returns {Error}
        */
        function noElementsError() {
            return new __error("Sequence contains no elements.");
        }

        /**
        * Creates a new ArgumentOutOfRangeError.
        * @param {String} name Name of the parameter.
        * @returns {Error}
        */
        function argumentOutOfRangeError(name) {
            return new __error("Specified argument was out of the range of valid values. Parameter name: " + name);
        }

        /**
        * Creates a new NumericTypeError.
        * @returns {Error}
        */
        function numericTypeError() {
            return new __error("Value is not a number.");
        }


        return extensions;
    })();








    /* Helper/Factory Functions
    ---------------------------------------------------------------------- */

    /**
    * Gets or creates a new Enumerable instance.
    * @param {Enumerable|Iterable|Array|String|Function|Function*|Object} value An Enumerable object.
    * @returns {Enumerable}
    */
    function $enumerable(value) {
        return $is(value, __Enumerable) ? value : new __Enumerable(value);
    }


    /**
    * Gets or creates a new Enumerator instance.
    * @param {Object|Function} value An Enumerable object or Enumerator factory method.
    * @returns {Enumerator}
    */
    function $enumerator(value) {
        return $enumerable(value).getEnumerator();
    }


    /**
    * Gets or creates a new Collection instance if the value is Collection, otherwise returns null.
    * @param {Enumerable} value An Enumerable object.
    * @returns {Collection}
    */
    function $collection(value) {

        if ($is(value, __Collection)) {
            return value;
        }

        else if ($is(value, __array) || $is(value, __string)) {
            return new __Stack(value);
        }

        else {
            return null;
        }
    }


    /**
    * Buffers an Enumerable object into an array.
    * @param {Enumerable} value An Enumerable object.
    * @returns {Array}
    */
    function $buffer(value) {

        if ($is(value, __array)) {              // fast buffering arrays
            return value.slice(0);
        }

        else if ($is(value, __string)) {        // fast buffering strings
            return value.split("");
        }

        else {
            var _arr = new __array(4),
                _e = $enumerator(value),
                _count = 0;

            // collections have fixed element count
            if ($is(value, __Collection)) {
                _arr.length = value.count();
                while (_e.next()) {
                    _arr[_count++] = _e.current;
                }

                return _arr;
            }
            else {
                while (_e.next()) {
                    if (_count >= _arr.length) {
                        _arr.length *= 4;
                    }

                    _arr[_count++] = _e.current;
                }

                return _arr.slice(0, _count);
            }
        }
    }


    /**
    * Buffers an Enumerable instance into a given array.
    * @param {Enumerable} value An Enumerable object.
    * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Dictionary keys.
    * @param {Number} arrayIndex The zero-based index in array at which copying begins.
    * @param {Number=} count The number of elements to copy.
    */
    function $bufferTo(value, array, arrayIndex, count) {

        count = count || value.count();

        $nullCheck(array, "array");
        $ensureType(arrayIndex, "arrayIndex", __number);
        $ensureType(count, "count", __number);

        if (arrayIndex > array.length || count > array.length - arrayIndex) {
            throw new __error("The number of elements in the source is greater than the number of elements that the destination array can contain.");
        }

        var _index = -1;

        // fast copy of array/string/list objects
        if ($is(value, __array) || $is(value, __string) || $is(value, __List)) {
            while (_index++ < count) {
                array[arrayIndex + _index] = value[_index];
            }
        }

            // do it the hard way
        else {
            var _e = $enumerator(value);
            while (_e.next() && _index++ < count) {
                array[arrayIndex + _index] = _e.current;
            }
        }
    }


    /**
    * Gets or creates a new Comparer object.
    * @param {Comparer|Object} value A Comparer object.
    * @returns {Comparer}
    */
    function $comparer(value) {
        if ($is(value, __Comparer)) {
            return value;
        }

        else if (value && $isFunc(value.compare)) {
            return __Comparer.create(value.compare);
        }

        else {
            return __Comparer['default'];
        }
    }


    /**
    * Gets or creates a new EqualityComparer object.
    * @param {EqualityComparer|Object} value An EqualityComparer object.
    * @returns {EqualityComparer}
    */
    function $equalityComparer(value) {
        if ($is(value, __EqualityComparer)) {
            return value;
        }

        else if (value && $isFunc(value.hash) && $isFunc(value.equals)) {
            return __EqualityComparer.create(value.hash, value.equals);
        }

        else {
            return __EqualityComparer['default'];
        }
    }


    /**
    * Extends Enumerable extension methods to the given type
    * @param {Function} type The type to extend.
    */
    function $enumerableExtend(type) {
        $ensureType(type, "type", __function);
        $mixin(type.prototype, __EnumerableExtensions);
    }







    /* Modules
    ---------------------------------------------------------------------- */

    $enumerableExtend(__array);
    $enumerableExtend(__string);
    $enumerableExtend(__Enumerable);


    /**
    * Creates a new Enumerable instance.
    * @param {Enumerable|Iterable|Array|String|Function|Function*|Object} value An Enumerable object.
    * @returns {Enumerable}
    */
    function multiplex(value) {
        return $enumerable(value);
    }


    var mx = $module(multiplex, {
        runtime: $module({
            hash: $computeHash,
            equals: $computeEquals,
            compare: $computeCompare,
            lambda: $lambda,
            define: $define,
            mixin: $mixin
        }),
        extensions: $module(__EnumerableExtensions),

        hash: $hash,
        equals: $equals,
        extend: $enumerableExtend,

        Enumerator: __Enumerator,
        Enumerable: __Enumerable,
        Collection: __Collection,
        ReadOnlyCollection: __ReadOnlyCollection,
        List: __List,
        SortedList: __SortedList,
        Dictionary: __Dictionary,
        KeyValuePair: __KeyValuePair,
        HashSet: __HashSet,
        LinkedList: __LinkedList,
        LinkedListNode: __LinkedListNode,
        Queue: __Queue,
        Stack: __Stack,

        Lookup: __Lookup,
        Grouping: __Grouping,
        OrderedEnumerable: __OrderedEnumerable,

        Comparer: __Comparer,
        EqualityComparer: __EqualityComparer
    });


    $mixin(global, {
        mx: mx,
        multiplex: mx,
        Enumerable: __Enumerable,
        Enumerator: __Enumerator,
        ReadOnlyCollection: __ReadOnlyCollection,
        List: __List,
        SortedList: __SortedList,
        Dictionary: __Dictionary,
        KeyValuePair: __KeyValuePair,
        HashSet: __HashSet,
        LinkedList: __LinkedList,
        LinkedListNode: __LinkedListNode,
        Queue: __Queue,
        Stack: __Stack,

        Comparer: __Comparer,
        EqualityComparer: __EqualityComparer,
    });


})(window || this);
