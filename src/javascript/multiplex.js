/*--------------------------------------------------------------------------
* Multiplex.js - Comprehensive data-structure and LINQ library for JavaScript.
* Ver 1.1.0 (Nov 15, 2015)
*
* Created and maintained by Kamyar Nazeri <Kamyar.Nazeri@yahoo.com>
* Licensed under Apache License Version 2.0
* https://github.com/multiplex/multiplex.js
*
*
* Lexical Note:
*   - Built-in types and Global variables: capital letters
*   - Runtime & Helper functions: start with "$"
*   - Classes: start with a capital letter
*   - Class Alias: start with "__" and a capital letter
*   - Local scope variables: start with "_"
*
*--------------------------------------------------------------------------*/

(function (global) {
    "use strict";




    /* built-in types
    ---------------------------------------------------------------------- */
    var FUNCTION = global.Function,
        OBJECT = global.Object,
        NUMBER = global.Number,
        STRING = global.String,
        BOOLEAN = global.Boolean,
        ARRAY = global.Array,
        ERROR = global.Error,
        MATH = global.Math,
        DATE = global.Date,
        WEAKMAP = global.WeakMap,
        SYMBOL = global.Symbol,
        NODELIST = global.NodeList,
        UNDEFINED;






    /* errors
    ---------------------------------------------------------------------- */
    var ERROR_ARGUMENT_OUT_OF_RANGE = "Argument was out of the range of valid values.",
        ERROR_METHOD_NOT_IMPLEMENTED = "Method not implemented.",
        ERROR_ARRAY_SIZE = "The number of elements in the source is greater than the number of elements that the destination array can contain.",
        ERROR_KEY_NOT_FOUND = "The given key was not present in the collection.",
        ERROR_DUPLICATE_KEY = "An item with the same key has already been added.",
        ERROR_EMPTY_COLLECTION = "Collection is empty.",
        ERROR_MORE_THAN_ONE_ELEMENT = "Sequence contains more than one element.",
        ERROR_MORE_THAN_ONE_MATCH = "Sequence contains more than one match.",
        ERROR_NO_MATCH = "Sequence contains no matching element.",
        ERROR_NO_ELEMENTS = "Sequence contains no elements.",
        ERROR_NON_NUMERIC_TYPE = "Value is not a number.";





    /* Runtime Functions
    ---------------------------------------------------------------------- */


    /**
    * Determines whether an object is instance of a given type.
    * @param {Object} obj An object.
    * @param {Function} type The type to check.
    * @returns {Boolean}
    */
    function $is(obj, type) {

        // use 'typeof' operator in an if clause yields in better performance than switch-case

        if (typeof obj === "number") {
            return type === NUMBER;
        }
        else if (typeof obj === "string") {
            return type === STRING;
        }
        else if (typeof obj === "function") {
            return type === FUNCTION;
        }
        else if (typeof obj === "boolean") {
            return type === BOOLEAN;
        }
        else {
            return obj instanceof type;
        }
    }


    /**
    * Determines whether the specified object is a Function type.
    * @param {Object} fn The object to check.
    * @returns {Boolean}
    */
    function $isFunc(fn) {
        return typeof fn === "function";
    }


    /**
    * Determines whether the specified object is array-like.
    * @param {Object} obj The object to check.
    * @returns {Boolean}
    */
    function $isArrayLike(obj) {

        if (obj instanceof ARRAY || typeof obj === "string") {                      // Arrays/String
            return true;
        }
        else if (typeof obj === "object" && typeof obj.length === "number") {       // Array-likes have 'length' property (excelude 'function' type)

            if (typeof obj.splice === "function" ||                                 // third party libraries. eg. jQuery
                obj.toString() === "[object Arguments]" ||                          // arguments
                obj.buffer ||                                                       // typed-array
                obj instanceof NODELIST) {                                          // NodeList: document.querySelectorAll
                return true;
            }
        }

        return false;
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
    * Throws a user-defined exception with the specified message.
    * @param {String} msg Human-readable description of the error.
    */
    function $error(msg) {
        throw new ERROR(msg);
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

        if ($is(prop, STRING) && $isFunc(attributes.value)) {
            var _str = "function " + prop + "() {...}";

            $defineProperty(attributes.value, "toString", {
                value: function () { return _str; },
                writable: true
            });
        }

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

        if (obj) {
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
        }
        return obj;
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
            _static = _args.length === 4 || _super ? _args[3] : _args[2];

        if (_super) {
            var _ = function () { $define(this, "constructor", { value: type }); };
            _.prototype = _super.prototype;
            type.prototype = new _();
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
    function $nullCheck(obj) {
        if (obj == null) {
            $error("Value cannot be null.");
        }
    }


    /**
    * Checks for an object to be of the specified type; if not throws an Error.
    */
    function $ensureType(obj, type) {

        if (!$is(obj, type)) {
            $error("Invalid parameter type. Expected type: " + type.toString().match(/^function (.+)\(/)[1]);
        }
    }


    /**
    * Creates A function expression from the specified string lambda expression
    * @param {String} exp String lambda expression.
    * @returns {Function}
    */
    function $lambda(exp) {

        if (typeof exp === "function") {
            return exp;
        }

        else if (typeof exp === "string") {
            var _pattern = /^\s*\(?\s*(([a-z_$]{1}[a-z0-9_$]*)+([, ]+[a-z_$]{1}[a-z0-9_$]*)*)*\s*\)?\s*=>\s*(.*)$/i;
            if (_pattern.test(exp)) {
                var _match = exp.match(_pattern);
                return new FUNCTION((_match[1] || "").replace(/ /g, ""), "return " + _match[4]);
            }

            $error("Cannot parse supplied expression: " + exp);
        }

        return null;
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
                // Josh Bloch hash method
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
        if (comparer) {
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
    var $defineProperty = $isFunc(OBJECT.defineProperty) ? OBJECT.defineProperty : function (obj, prop, attr) {
        obj[prop] = attr.get ? attr.get.apply(obj) : attr.value;
    };


    /**
    * Freezes an object, makes the object effectively immutable.
    */
    var $freeze = $isFunc(OBJECT.freeze) ? OBJECT.freeze : function (o) {
        return o;
    };


    /**
    * Gets or sets object private property.
    */
    var $prop = (function () {
        if ($isFunc(WEAKMAP)) {
            var _map = new WEAKMAP();

            return function (obj, value) {
                if (value) {
                    _map.set(obj, value);
                    return value;
                }

                return _map.get(obj);
            };
        }
        else {
            return function (obj, value) {
                if (value) {
                    obj.__props__ = value;
                    return value;
                }

                return obj.__props__;
            };
        }
    })();


    /**
    * Serves as a hash function for a particular type, suitable for use in hashing algorithms and data structures such as a hash table.
    */
    var $computeHash = (function () {

        var _lower31BitMask = 0X7FFFFFFF,
            _hashSeed = MATH.floor(MATH.random() * 0X7FFF) + 0X7FFF,
            _hashIndex = _hashSeed,
            _hashSymbol = "__hash__";


        /**
        * Serves as a hash function for a particular type, suitable for use in hashing algorithms and data structures such as a hash table.
        * @param {Object} obj An object to retrieve the hash code for.
        * @param {Boolean} override When true, uses the overriden __hash__ function if it is defined.
        * @returns {Number}
        */
        function computeHash(obj, override) {

            /// use 'instanceof' and 'typeof' operators to maximize performance

            if (typeof obj === "number") {                          // Compute "Number" primitive type hash (does not incluede "new Number(value)")
                if (obj % 1 === 0) {                                // integer number
                    return obj >> 32;
                }
                return compute31BitNumberHash(obj);
            }

            else if (typeof obj === "string") {                     // Compute "String" primitive type hash (does not incluede "new String(value)")
                return compute31BitStringHash(obj);
            }

            else if (typeof obj === "boolean") {                    // Compute "Boolean" primitive type hash (does not incluede "new Boolean(value)")
                return obj ? 1 : 0;
            }

            else {
                if (obj == null) {                                  // null/undefined hash is 0
                    return 0;
                }

                else if (obj instanceof DATE) {
                    return compute31BitDateHash(obj);               // Compute "Date" object type hash
                }

                else if (override && typeof obj.__hash__ === "function") {
                    return obj.__hash__(obj);                       // Compute overriden "Object" hash
                }

                else {
                    return compute31BitObjecHash(obj);             // Compute "Object" type hash for all other types
                }
            }
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

            if (obj % 1 === 0) {            // integer number
                return obj >> 32;
            }

            else {                          // decimal number
                var _hash = 0;
                switch (obj) {
                    case NUMBER.POSITIVE_INFINITY: _hash = 0x7F800000; break;
                    case NUMBER.NEGATIVE_INFINITY: _hash = 0xFF800000; break;
                    case +0.0: _hash = 0x40000000; break;
                    case -0.0: _hash = 0xC0000000; break;
                    default:

                        if (obj <= -0.0) {
                            _hash = 0x80000000;
                            obj = -obj;
                        }

                        var _exponent = MATH.floor(MATH.log(obj) / MATH.log(2)),
                            _significand = ((obj / MATH.pow(2, _exponent)) * 0x00800000) | 0;

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

                return _hash & _lower31BitMask;
            }
        }


        /// Creates a HashCode for a Date object.
        function compute31BitDateHash(obj) {
            var _time = obj.getTime();
            return _time ^ (_time >> 5);
        }


        /// Creates and stores a HashCode for an object.
        var compute31BitObjecHash = (function () {
            if ($isFunc(WEAKMAP)) {
                var _map = new WEAKMAP();

                return function (obj) {
                    var _hash = _map.get(obj);

                    if (_hash == null) {

                        if (isObjectLiteral(obj)) {

                            _hash = _hashSeed;
                            _map.set(obj, 0);           // prevents recursion

                            // only object literals fall into following code, no need to check for hasOwnProperty

                            for (var _p in obj) {

                                // Josh Bloch hash method
                                _hash = (17 * 31 + _hash) * 31 + compute31BitStringHash(_p) + computeHash(obj[_p], true);
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

                    if (typeof obj.__hash__ !== "function" || typeof (_hash = obj.__hash__()) !== "number") {
                        obj.__hash__ = function () { return _hash; };      // prevents recursion;

                        if (isObjectLiteral(obj)) {

                            _hash = _hashSeed;

                            // only object literals fall into following code, no need to check for hasOwnProperty

                            for (var _p in obj) {
                                if (_p === _hashSymbol) {
                                    continue;
                                }

                                // Josh Bloch hash method
                                _hash = (17 * 31 + _hash) * 31 + compute31BitStringHash(_p) + computeHash(obj[_p], true);
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
            var _proto = OBJECT.prototype,
                _prototype = OBJECT.getPrototypeOf;

            if ($isFunc(_prototype)) {
                return function (obj) { return _prototype(obj) === _proto; };
            }

            return function (obj) { return obj.constructor.prototype === _proto; };
        })();


        /// Define "__hash__" function for built-in types
        $define(DATE.prototype, _hashSymbol, { value: function () { return compute31BitDateHash(this); } });
        $define(NUMBER.prototype, _hashSymbol, { value: function () { return compute31BitNumberHash(this.valueOf()); } });
        $define(STRING.prototype, _hashSymbol, { value: function () { return compute31BitStringHash(this.valueOf()); } });
        $define(BOOLEAN.prototype, _hashSymbol, { value: function () { return this.valueOf() === true ? 1 : 0; } });


        return computeHash;
    })();


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

            // Objects are identical (including null)
            if (objA === objB) {
                return true;
            }

                // null is not equal to any object
            else if (objA == null || objB == null) {
                return false;
            }


            // Objects check for equality for primitive types
            if (typeof objA === "number" ||
                typeof objA === "string" ||
                typeof objA === "boolean") {
                return objA == objB;
            }

            else if (typeof objA === "object") {

                // Objects are from "Date" type
                if (objA instanceof DATE) {
                    return computeDateEquals(objA, objB);
                }

                    // Overriden "equals" method for Object types
                else if (override && typeof objA.__equals__ === "function") {
                    return objA.__equals__(objB);
                }

                    // Object types
                else {
                    return computeObjectEquals(objA, objB);
                }
            }


            // Objects are already not equal
            return false;
        }


        /// Compares Date objects by their time
        function computeDateEquals(objA, objB) {
            return objB instanceof DATE && objA.getTime() === objB.getTime();
        }


        /// Compares Primitive objects
        function computePrimitiveEquals(objA, objB) {
            return objA.valueOf() == objB;
        }


        /// Compares Object types by their Hash code and Properties 
        function computeObjectEquals(objA, objB) {

            if (typeof objB === "object") {

                if ($computeHash(objA, true) !== $computeHash(objB, true)) {        // Objects having different hash code are not equal
                    return false;
                }


                /// Process equality for object literals:
                /// object literals may have equal hash code, we process equality by each property.
                /// regular "class" instances have different hash code, hence do not fall into following code.
                /// object objA is direct descendant of Object hence no need to check "hasOwnProperty"

                var _val;

                for (var _prop in objA) {

                    _val = objA[_prop];

                    /// Object methods are not considered for equality
                    if (typeof _val === "function") {
                        continue;
                    }

                    if (!computeEquals(_val, objB[_prop], true)) {
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
        $define(DATE.prototype, _equalsSymbol, { value: function (obj) { return computeDateEquals(this, obj); } });
        $define(NUMBER.prototype, _equalsSymbol, { value: function (obj) { return computePrimitiveEquals(this, obj); } });
        $define(STRING.prototype, _equalsSymbol, { value: function (obj) { return computePrimitiveEquals(this, obj); } });
        $define(BOOLEAN.prototype, _equalsSymbol, { value: function (obj) { return computePrimitiveEquals(this, obj); } });


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
            else {

                if (typeof objA === "number" ||                 // numbers compare using "gt" operator
                    typeof objA === "boolean") {                // booleans compare using "gt" operator
                    return objA > objB ? 1 : -1;                // values are already checked to equality
                }

                else if (typeof objA === "string") {
                    return objA.localeCompare(objB);            // Strings are compared using String.prototype.localeCompare method
                }

                else {
                    if (objA instanceof DATE &&                 // Dates are compared using 'getTime' method
                        objB instanceof DATE) {
                        var _t1 = objA.getTime(),
                            _t2 = objB.getTime();

                        return _t1 > _t2 ? 1 : (_t2 > _t1 ? -1 : 0);
                    }
                    else {                                      // Objects are compared using 'valudOf' method
                        var _v1 = objA.valueOf(),
                            _v2 = objB.valueOf();

                        return _v1 > _v2 ? 1 : (_v2 > _v1 ? -1 : 0);
                    }
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
                _current = UNDEFINED,
                _yielder = function (val) {
                    _next = true;
                    return _current = val;
                };


            $ensureType(factory, FUNCTION);


            /**
            * Advances the enumerator to the next element of the collection.
            * @returns {Boolean}
            */

            this.next = function () {
                _current = undefined;       // reset "current"
                _next = false;              // reset "next"

                factory(_yielder);
                this.current = _current;

                return _next;
            };


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

        var _iteratorSymbol = $isFunc(SYMBOL) && typeof SYMBOL.iterator === "symbol" ? SYMBOL.iterator : "@@iterator",
            _generatorFunction = (function () {
                try { return eval("(function*() {}).constructor"); }
                catch (e) { return function () { }; }
            })(),
            _empty = $freeze(new Enumerable([]));


        /**
        * Exposes the enumerator, which supports a simple iteration over a collection of a specified type.
        * @param {Enumerable|Iterable|Function|Object} obj An Enumerable object.
        */
        function Enumerable(obj) {
            $prop(this, obj);
        }


        /**
        * Creates an Enumerator which supports a simple iteration over a collection.
        */
        function EnumeratorFactory(obj) {
            obj = obj || [];



            /// ES6/Legacy generator function
            if (typeof obj === "function") {
                return obj instanceof _generatorFunction ? EnumeratorFactory(obj()) : obj();
            }



            /// Array-like: String, Array, arguments, jQuery
            if ($isArrayLike(obj)) {
                var _index = -1,
                    _length = obj.length;

                return new __Enumerator(function (yielder) {
                    if (++_index < _length) {
                        return yielder(obj[_index]);
                    }
                });
            }



            /// Enumerator object
            if (typeof obj.getEnumerator === "function") {
                return obj.getEnumerator();
            }



            /// ES6 Iterable object: Map, Set and Iterable objects
            if (typeof obj[_iteratorSymbol] === "function") {
                var _iterator = obj[_iteratorSymbol](),
                    _next;

                return new __Enumerator(function (yielder) {
                    if (!(_next = _iterator.next()).done) {
                        return yielder(_next.value);
                    }
                });
            }



            /// Regular object
            return function () {

                if (typeof obj !== "object") {
                    return EnumeratorFactory([obj]);
                }


                /// extra function, prevents "_keys" closure
                var _keys = [];
                for (var _key in obj) {
                    _keys.push(_key);
                }


                var _index = -1,
                    _length = _keys.length;

                return new __Enumerator(function (yielder) {

                    if (++_index < _length) {
                        return yielder(new __KeyValuePair(_keys[_index], obj[_keys[_index]]));
                    }
                });
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
                return EnumeratorFactory($prop(this));
            }
        },
        {
            /**
            * Returns an empty Enumerable.
            * @returns {Enumerable}
            */
            empty: function () {
                return _empty;
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

                if ($isArrayLike(obj) ||                                    /// Array-like
                    obj instanceof __Enumerable ||                          /// Enumerable
                    obj instanceof _generatorFunction ||                    /// ES6 Generator Function
                    typeof obj.getEnumerator === "function" ||              /// Enumerable
                    typeof obj[_iteratorSymbol] === "function") {           /// Iterable
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
                $ensureType(start, NUMBER);
                $ensureType(count, NUMBER);

                var _max = start + count - 1;

                if (count < 0 || _max > NUMBER.MAX_VALUE) {
                    $error(ERROR_ARGUMENT_OUT_OF_RANGE);
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
                $ensureType(count, NUMBER);

                if (count < 0) {
                    $error(ERROR_ARGUMENT_OUT_OF_RANGE);
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
            if ($isFunc(comparison)) {
                $define(this, "compare", { value: comparison });
            }
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
                return $computeCompare(objA, objB);
            }
        },
        {

            /**
            * Gets a default sort order comparer for the type specified by the generic argument.
            */
            defaultComparer: new Comparer(),


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

            if ($isFunc(equality)) {
                $define(this, "equals", { value: equality });
            }

            if ($isFunc(hashCodeProvider)) {
                $define(this, "hash", { value: hashCodeProvider });
            }
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
                return $computeEquals(x, y, true);
            },

            /**
            * Returns a hash code for the specified object.
            * @param {Object} obj The Object for which a hash code is to be returned.
            * @returns A hash code for the specified object.
            */
            hash: function (obj) {
                return $computeHash(obj, true);
            }
        },
        {

            /**
            * Gets a default equality comparer for the type specified by the generic argument.
            */
            defaultComparer: new EqualityComparer(),

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
        * @param {Enumerable=} value Enumerable whose elements are copied to the new collection.
        */
        function Collection(value) {
            if (value) {
                $prop(this, $buffer(value));
            }
        }


        return $extend(Collection, __Enumerable, {
            /**
            * Gets the number of elements contained in the Collection.
            * @returns {Number}
            */
            count: function () {

                var _source = $prop(this);

                if (_source) {
                    return $count(_source);
                }

                /// implemented in sub-classes
                $error(ERROR_METHOD_NOT_IMPLEMENTED);
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

                var _source = $prop(this);

                if (_source) {
                    return $enumerator(_source);
                }

                /// implemented in sub-classes
                $error(ERROR_METHOD_NOT_IMPLEMENTED);
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

            $ensureType(list, __List);
            $prop(this, list);
            $define(this, "length", { get: function () { return list.length; } });

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
                return $prop(this).get(index);
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
                $prop(this).copyTo(array, arrayIndex);
            },

            /**
            * Searches for the specified object and returns the zero-based index of the first occurrence within the entire ReadOnlyCollection.
            * @param {Object} item The object to locate in the ReadOnlyCollection.
            * @returns {Number}
            */
            indexOf: function (item) {
                return $prop(this).indexOf(item);
            },

            /**
            * Buffers collection into an array.
            * @returns {Array}
            */
            items: function () {
                return $prop(this).items();
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                return $enumerator($prop(this));
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

            $prop(this, this);
            $define(this, "length", {
                get: function () {
                    return _capacity;
                },
                set: function (value) {
                    $ensureType(value, NUMBER);

                    var _len = _capacity;
                    _capacity = MATH.max(value, 0);

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
                if ($is(value, NUMBER)) {
                    _capacity = value;
                }

                else if (__Enumerable.is(value)) {
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
                $nullCheck(collection);
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
            * @param {Object} item The object to locate.
            * @param {Number=} index The zero-based starting index of the range to search.
            * @param {Number=} count The length of the range to search.
            * @param {Comparer=} comparer The Comparer implementation to use when comparing elements.
            * @returns {Number}
            */
            binarySearch: function (item) {
                var _args = arguments,
                    _index = $is(_args[1], NUMBER) ? _args[1] : 0,
                    _count = $is(_args[1], NUMBER) ? _args[2] : this.length,
                    _comparer = $comparer(_args.length === 4 ? _args[3] : _args[1]);

                return $binarySearch(this, _index, _count, item, _comparer);
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
                return this.indexOf(item) !== -1;
            },

            /**
            * Copies the elements of the List to an Array, starting at a particular Array index.
            * @param {Array} array The one-dimensional Array that is the destination of the elements copied from List.
            * @param {Number} arrayIndex The zero-based index in array at which copying begins.
            */
            copyTo: function (array, arrayIndex) {
                $bufferTo(this, array, arrayIndex);
            },

            /**
            * Determines whether the List contains elements that match the conditions defined by the specified predicate.
            * @param {Function} match The predicate function that defines the conditions of the elements to search for. eg. function(item)
            * @returns {Boolean}
            */
            exists: function (match) {
                match = $lambda(match);
                $ensureType(match, FUNCTION);

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
                $ensureType(match, FUNCTION);

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
                $ensureType(match, FUNCTION);

                var _arr = new ARRAY(this.length),
                    _count = 0;

                for (var i = 0, _len = this.length; i < _len; i++) {
                    if (match(this[i]) === true) {
                        _arr[_count++] = this[i];
                    }
                }

                _arr.length = _count;
                return new __List(_arr);
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
                    _startIndex = $is(_args[0], NUMBER) ? _args[0] : 0,
                    _count = $is(_args[1], NUMBER) ? _args[1] : _len - _startIndex,
                    _match = $lambda(_args[_args.length - 1]);

                $ensureType(_match, FUNCTION);
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
                $ensureType(match, FUNCTION);

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
                    _startIndex = $is(_args[0], NUMBER) ? _args[0] : this.length - 1,
                    _count = $is(_args[1], NUMBER) ? _args[1] : _startIndex,
                    _match = $lambda(_args[_args.length - 1]);

                $ensureType(_match, FUNCTION);
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
                $ensureType(action, FUNCTION);

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
            * @param {Object} item The object to insert.
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
                $ensureType(index, NUMBER);
                $nullCheck(collection);

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
            * Buffers collection into an array.
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
                $ensureType(match, FUNCTION);

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
                        if ($is(_arg1, NUMBER)) {
                            _index = _arg1;

                            $ensureType(_args[1], NUMBER);
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
                $ensureType(match, FUNCTION);

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
            $ensureType(index, NUMBER);

            if (index < 0 || index >= list.length) {
                $error(ERROR_ARGUMENT_OUT_OF_RANGE);
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
            var _dic = $is(value, __Dictionary) ? value : null,
                _capacity = $is(value, NUMBER) ? value : (_dic ? _dic.count() : 0),
                _comparer = $comparer(comparer ? comparer : (_dic ? null : value)),
                _keys = new ARRAY(_capacity),
                _values = new ARRAY(_capacity),
                _size = _dic ? _dic.count() : 0;

            if (_dic) {
                var _arr = $buffer(_dic).sort(function (x, y) { return _comparer.compare(x.key, y.key); }),
                    _len = _capacity;

                while (_len-- > 0) {
                    _keys[_len] = _arr[_len].key;
                    _values[_len] = _arr[_len].value;
                }
            }

            $prop(this, {
                size: _size,
                comparer: _comparer,
                keys: _keys,
                values: _values
            });
        }

        return $extend(SortedList, __Collection, {

            /**
            * Adds an element with the specified key and value into the SortedList.
            * @param {Object} key The key of the element to add.
            * @param {Object} value The value of the element to add.
            */
            add: function (key, value) {
                $nullCheck(key);

                var _source = $prop(this),
                    _index = $binarySearch(_source.keys, 0, _source.size, key, _source.comparer);

                if (_index >= 0) {
                    $error(ERROR_DUPLICATE_KEY);
                }

                Insert(this, ~_index, key, value);
            },

            /**
            * Gets the value associated with the specified key.
            * @param {Object} key The key whose value to get.
            * @returns {Object}
            */
            get: function (key) {
                var _index = this.indexOfKey(key);

                if (_index >= 0) {
                    return $prop(this).values[_index];
                }

                $error(ERROR_KEY_NOT_FOUND);
            },

            /**
            * Gets or sets the number of elements that the SortedList can contain.
            * @param {Number} value The number of elements that the SortedList can contain.
            * @returns {Number}
            */
            capacity: function (value) {

                var _source = $prop(this),
                    _keys = _source.keys,
                    _size = _source.size;

                if (value == null) {
                    return _keys.length;
                }
                else {
                    $ensureType(value, NUMBER);

                    if (value !== _keys.length) {

                        if (value < _size) {
                            $error(ERROR_ARGUMENT_OUT_OF_RANGE);
                        }

                        _source.keys.length = value;
                        _source.values.length = value;
                    }
                }
            },

            /**
            * Removes all elements from the SortedList.
            */
            clear: function () {
                var _source = $prop(this);
                _source.size = 0;
                _source.keys.length = 0;
                _source.values.length = 0;
            },

            /**
            * Gets the Comparer for the sorted list.
            * @returns {Comparer}
            */
            comparer: function () {
                return $prop(this).comparer;
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
            * @returns {Number}
            */
            count: function () {
                return $prop(this).size;
            },

            /**
            * Gets a collection containing the keys in the SortedList, in sorted order.
            * @returns {Collection}
            */
            keys: function () {
                var _source = $prop(this);
                return new __Collection(_source.keys.slice(0, _source.size));
            },

            /**
            * Gets a collection containing the values in the SortedLis.
            * @returns {Collection}
            */
            values: function () {
                var _source = $prop(this);
                return new __Collection(_source.values.slice(0, _source.size));
            },

            /**
            * Searches for the specified key and returns the zero-based index within the entire SortedList.
            * @param {Object} key The key to locate in the SortedList.
            * @returns {Number}
            */
            indexOfKey: function (key) {
                $nullCheck(key);

                var _source = $prop(this);

                return $binarySearch(_source.keys, 0, _source.size, key, _source.comparer);
            },

            /**
            * Searches for the specified value and returns the zero-based index of the first occurrence within the entire SortedList.
            * @param {Object} value The value to locate in the SortedList.
            * @returns {Number}
            */
            indexOfValue: function (value) {
                return $prop(this).values.indexOf(value);
            },

            /**
            * Removes the element with the specified key from the SortedList.
            * Returns true if the element is successfully removed; otherwise, false. This method also returns false if key was not found in the original SortedList.
            * @param {Object} key The key of the element to remove.
            * @returns {Boolean}
            */
            remove: function (key) {
                var _index = this.indexOfKey(key);

                if (_index >= 0) {
                    this.removeAt(_index);
                    return true;
                }

                return false;
            },

            /**
            * Removes the element at the specified index of the SortedList.
            * @param {Number} index The zero-based index of the element to remove.
            */
            removeAt: function (index) {
                $ensureType(index, NUMBER);

                var _source = $prop(this),
                    _keys = _source.keys,
                    _values = _source.values,
                    _len = _keys.length;

                if (index < 0 || index >= _source.size) {
                    $error(ERROR_ARGUMENT_OUT_OF_RANGE);
                }

                _source.size--;
                _keys.splice(index, 1);
                _values.splice(index, 1);
                _keys.length = _len;
                _values.length = _len;
            },

            /**
            * Sets the value associated with the specified key.
            * @param {Object} key The key whose value to get or set.
            * @param {Object} value The value associated with the specified key.
            */
            set: function (key, value) {
                var _index = this.indexOfKey(key);

                if (_index >= 0) {
                    $prop(this).values[_index] = value;
                    return;
                }

                Insert(this, ~_index, key, value);
            },

            /**
            * Sets the capacity to the actual number of elements in the SortedList, if that number is less than 90 percent of current capacity.
            */
            trimExcess: function () {
                var _source = $prop(this),
                    _size = _source._size,
                    _threshold = _source.keys.length * 0.9;

                if (_size < _threshold) {
                    this.capacity(_size);
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
                $ensureType(callback, FUNCTION);

                var _index = this.indexOfKey(key);

                if (_index >= 0) {
                    callback($prop(this).values[_index]);
                    return true;
                }

                return false;
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                var _source = $prop(this),
                    _keys = _source.keys,
                    _values = _source.values,
                    _size = _source.size,
                    _index = -1;

                return new __Enumerator(function (yielder) {
                    if (++_index < _size) {
                        return yielder(new __KeyValuePair(_keys[_index], _values[_index]));
                    }
                });
            }
        });



        /* SortedList Helper Functions
        ---------------------------------------------------------------------- */

        function Insert(list, index, key, value) {
            var _source = $prop(list),
                _size = _source.size,
                _keys = _source.keys,
                _values = _source.values;

            if (_size == _keys.length) {
                var _newCapacity = _keys.length === 0 ? 4 : _keys.length * 2,
                    _max = NUMBER.MAX_VALUE,
                    _min = _size + 1;

                if (_newCapacity > _max) {
                    _newCapacity = _max;
                }

                if (_newCapacity < _min) {
                    _newCapacity = _min;
                }

                list.capacity(_newCapacity);
            }

            if (index < _size) {
                _keys.splice(index, 0, key);
                _values.splice(index, 0, value);
            }

            _source.size++;
            _keys[index] = key;
            _values[index] = value;
        }
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

        return $extend(KeyValuePair, {
            __hash__: function () { return $hash(this.key, this.value); },
            __equals__: function (obj) { return $is(obj, __KeyValuePair) && $computeEquals(this.key, obj.key) && $computeEquals(this.value, obj.value); },
        });
    })();


    /**
    * Represents a collection of keys and values.
    */
    var __Dictionary = (function () {

        /**
        * Initializes a new instance of the Dictionary.
        * @param {Dictionary|EqualityComparer|Number=} value The Dictionary whose elements are copied to the new Dictionary, the EqualityComparer or the Capacity
        * @param {EqualityComparer=} comparer The EqualityComparer implementation to use when comparing keys.
        */
        function Dictionary() {
            var _args = arguments,
                _dic = $is(_args[0], __Dictionary) ? _args[0] : null,
                _comparer = _dic ? _args[1] : $equalityComparer(_args[0]),
                _table = _dic ? new __HashTable(_dic.count(), _comparer) : ($is(_args[0], NUMBER) ? new __HashTable(_args[0], _comparer) : new __HashTable(_comparer));

            $prop(this, _table);

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
                $nullCheck(key);
                if (!$prop(this).add(key, value)) {
                    $error(ERROR_DUPLICATE_KEY);
                }
            },

            /**
            * Removes all keys and values from the Dictionary.
            */
            clear: function () {
                $prop(this).clear();
            },

            /**
            * Gets the number of elements contained in the Dictionary.
            * @returns {Number}
            */
            count: function () {
                return $prop(this).count();
            },

            /**
            * Determines whether the Dictionary contains the specified key.
            * @param {Object} key The key to locate in the Dictionary.
            * @returns {Boolean}
            */
            containsKey: function (key) {
                $nullCheck(key);
                return $prop(this).contains(key);
            },

            /**
            * Determines whether the Dictionary contains a specific value.
            * @param {Object} value The value to locate in the Dictionary.
            * @returns {Boolean}
            */
            containsValue: function (value) {
                var _e = $enumerator($prop(this));

                while (_e.next()) {
                    if ($computeEquals(_e.current.value, value)) {
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
            * Gets a Collection containing the keys of the Dictionary.
            * @returns {Collection}
            */
            keys: function () {
                return $prop(this).keys();
            },

            /**
            * Gets a Collection containing the values in the Dictionary.
            * @returns {Collection}
            */
            values: function () {
                return $prop(this).values();
            },

            /**
            * Gets element with the specified key.
            * @param {Object} key The key of the element to get.
            * @returns {Object}
            */
            get: function (key) {
                $nullCheck(key);
                return $prop(this).get(key);
            },

            /**
            * Sets the element with the specified key.
            * @param {Object} key The key of the element to set.
            * @param {Object} value The object to use as the value of the element to set.
            */
            set: function (key, value) {
                $nullCheck(key);
                $prop(this).set(key, value);
            },

            /**
            * Gets the value associated with the specified key.
            * @param {Object} key The key whose value to get.
            * @param {Function} callback When this method returns, callback method is called with the value
            * associated with the specified key, if the key is found; otherwise, null for the type of the value parameter.
            * @returns {Boolean}
            */
            tryGetValue: function (key, callback) {
                $nullCheck(key);
                $ensureType(callback, FUNCTION);

                var _entry = $prop(this).entry(key);

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
                $nullCheck(key);
                return $prop(this).remove(key);
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                var _e = $enumerator($prop(this));

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
        var _primes = [17, 67, 257, 1031, 4099, 16411, 65537, 262147, 1048583, 4194319, 16777259];


        /**
        * Initializes a new instance of the Hashtable.
        * @param {Number|EqualityComparer=} value Capacity or an EqualityComparer object.
        * @param {EqualityComparer=} comparer The EqualityComparer object that defines the hash code provider and the comparer to use with the Hashtable.
        */
        function HashTable() {

            var _args = arguments,
                _size = $is(_args[0], NUMBER) && _args[0] > _primes[0] ? getPrime(_args[0]) : _primes[0],
                _comparer = $equalityComparer(_args.length === 2 ? _args[1] : _args[0]);

            initializeHashTable(this, _size, _comparer);
        }

        /**
        * Initializes a new instance of the HashTable Entry.
        * @param {Number} hash The hash code of the key defined in each key/value entry.
        * @param {Number} next The next entry index in the chained bucket sequence when collision occures.
        * @param {Object} key The key defined in each key/value entry.
        * @param {Object} value The value defined in each key/value entry.
        */
        function Entry(hash, next, key, value) {
            this.hash = hash;       // item's key hash-code
            this.next = next;       // index of the next bucket in the chained bucket list
            this.key = key;         // item's key
            this.value = value;     // item's value
        }


        return $extend(HashTable, __Collection, {

            /**
            * Gets the value associated with the specified key.
            * @param {Object} key The key whose value to get.
            * @returns {Object}
            */
            get: function (key) {
                var _index = findEntry(this, key);
                if (_index === -1) {
                    $error(ERROR_KEY_NOT_FOUND);
                }

                return this._entries[_index].value;
            },

            /**
            * Gets the entry associated with the specified key.
            * @param {Object} key The key whose value to get.
            * @returns {Entry}
            */
            entry: function (key) {
                var _index = findEntry(this, key);
                return _index >= 0 ? this._entries[_index] : null;
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

                var _entries = this._entries,
                    _buckets = this._buckets,
                    _comparer = this._comparer,
                    _hash = _comparer.hash(key),            // hash code of the key
                    _bucket = _hash % _buckets.length,      // bucket index
                    _entry = null;


                // check for item existance, freed entries have -1 hash-code value and do not need enumeration
                for (var _index = _buckets[_bucket]; _index >= 0;) {
                    _entry = _entries[_index];

                    if (_entry.hash === _hash && _comparer.equals(_entry.key, key)) {
                        if (overwrite) {
                            _entry.value = value;
                            return true;
                        }

                        return false;
                    }

                    _index = _entry.next;
                }



                // item with the same key does not exists, add item

                var _count = this._count,
                    _freeCount = this._freeCount,
                    _freeIndex = this._freeIndex,
                    _index = 0;

                // there's already a free index
                if (_freeCount > 0) {
                    _index = _freeIndex;                        // consume free index
                    this._freeIndex = _entries[_index].next;    // save new free index
                    this._freeCount--;                          // update number of free entries
                }
                else {
                    if (_count === _entries.length) {
                        _bucket = _hash % resize(this);         // resize HashTable
                    }

                    // find a new free index
                    _index = _count;
                    this._count++;
                }

                _entries[_index] = new Entry(_hash, _buckets[_bucket], key, value);
                _buckets[_bucket] = _index;

                return true;
            },

            /**
            * Removes the element with the specified key from the HashTable.
            * @param {Object} key The key of the element to remove.
            * @returns {Boolean}
            */
            remove: function (key) {
                var _comparer = this._comparer,
                    _buckets = this._buckets,
                    _entries = this._entries,
                    _hash = _comparer.hash(key),            // hash-code of the key
                    _bucket = _hash % _buckets.length,      // bucket index
                    _last = -1,
                    _entry;

                // freed entries have -1 hash-code value and do not need enumeration
                for (var _index = _buckets[_bucket]; _index >= 0;) {
                    _entry = _entries[_index];

                    if (_entry.hash == _hash && _comparer.equals(_entry.key, key)) {

                        // last item in the chained bucket list
                        if (_last < 0) {
                            _buckets[_bucket] = _entry.next;
                        }
                        else {
                            _entries[_last].next = _entry.next;
                        }

                        _entry.hash = -1;                   // release the entry
                        _entry.next = this._freeIndex;      // save previous free index
                        _entry.key = null;
                        _entry.value = null;

                        this._freeIndex = _index;           // save new free index
                        this._freeCount++;                  // update number of free entries
                        return true;
                    }

                    _last = _index;
                    _index = _entry.next;
                }

                // item does not exist
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
                return this._count - this._freeCount;
            },

            /**
            * Determines whether a specified key exists in the HashTable.
            * @param {Object} key The key of the element to check.
            * @returns {Boolean}
            */
            contains: function (key) {
                return findEntry(this, key) != -1;
            },

            /**
            * Gets the EqualityComparer to use for the Hashtable.
            * @returns {EqualityComparer}
            */
            comparer: function () {
                return this._comparer;
            },

            /**
            * Gets a Collection containing the keys of the HashTable.
            * @returns {Collection}
            */
            keys: function () {
                var _count = this._count,
                    _arr = new ARRAY(this.count()),
                    _entries = this._entries,
                    _entry = null,
                    _index = 0;

                for (var i = 0; i < _count; i++) {
                    _entry = _entries[i];

                    if (_entry.hash >= 0) {
                        _arr[_index++] = _entry.key;
                    }
                }

                return new __Collection(_arr);
            },

            /**
            * Gets a Collection containing the values in the HashTable.
            * @returns {Collection}
            */
            values: function () {
                var _count = this._count,
                    _arr = new ARRAY(this.count()),
                    _entries = this._entries,
                    _entry = null,
                    _index = 0;

                for (var i = 0; i < _count; i++) {
                    _entry = _entries[i];

                    if (_entry.hash >= 0) {
                        _arr[_index++] = _entry.value;
                    }
                }

                return new __Collection(_arr);
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {

                var _index = 0,
                    _entry = null,
                    _count = this._count,
                    _entries = this._entries;

                return new __Enumerator(function (yielder) {
                    while (_index < _count) {

                        _entry = _entries[_index];

                        // freed entries have -1 as hashCode value and do not enumerate
                        if (_entry.hash >= 0) {
                            _index++;
                            return yielder(new __KeyValuePair(_entry.key, _entry.value));
                        }

                        _index++;
                    }
                });
            }
        });



        /* HashTable Helper Functions
        ---------------------------------------------------------------------- */

        function getPrime(min) {
            for (var i = 0, _len = _primes.length; i < _len; i++) {
                if (_primes[i] > min) {
                    return _primes[i];
                }
            }

            return _primes[_primes.length - 1];
        }

        function initializeHashTable(table, size, comparer) {
            size = size || _primes[0];
            comparer = comparer || table._comparer || __EqualityComparer.defaultComparer;

            var _buckets = new ARRAY(size),     // bucket list. index: hash, value: entry index
                _entries = new ARRAY(size);     // entry list. next: index of the next bucket

            table._count = 0;                   // total number of entries, including release entries (freeCount)
            table._freeIndex = -1;              // next free index in the bucket list
            table._freeCount = 0;               // total number of release entries
            table._buckets = _buckets;
            table._entries = _entries;
            table._comparer = comparer;


            // reset bucket list
            for (var i = 0; i < size; i++) {
                _buckets[i] = -1;
            }
        }

        function findEntry(table, key) {
            var _comparer = table._comparer,
                _buckets = table._buckets,
                _entries = table._entries,
                _hash = _comparer.hash(key),        // hash code of the key
                _length = _buckets.length,          // total buckets
                _entry = null;

            // freed entries have -1 hashCode and do not need enumeration
            for (var _index = _buckets[_hash % _length]; _index >= 0;) {
                _entry = _entries[_index];

                if (_entry.hash === _hash && _comparer.equals(_entry.key, key)) {
                    return _index;
                }

                _index = _entry.next;
            }

            // key not found
            return -1;
        }

        function resize(table) {
            var _count = table._count,
                _newSize = getPrime(_count),
                _buckets = table._buckets,
                _entries = table._entries,
                _entry = null,
                _bucket = 0,
                _hash = 0,
                _index = 0;

            _buckets.length = _newSize;         // expand buckets
            _entries.length = _newSize;         // expand entries


            // reset bucket list
            for (_index = 0; _index < _newSize; _index++) {
                _buckets[_index] = -1;
            }


            // rehash values & update buckets and entries
            for (_index = 0; _index < _count; _index++) {

                _entry = _entries[_index];

                // freed entries have -1 hashCode value and do not need rehash
                if ((_hash = _entry.hash) >= 0) {
                    _bucket = _hash % _newSize;             // rehash
                    _entry.next = _buckets[_bucket];        // update entry's next index in the bucket chain
                    _buckets[_bucket] = _index;             // update bucket index
                }
            }

            return _newSize;
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
                _comparer = $equalityComparer(_args.length === 1 && _enumerable == null ? _args[0] : _args[1]),
                _table = new __HashTable($count(_args[0]), _comparer);

            $prop(this, _table);

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
                return $prop(this).add(item, null);
            },

            /**
            * Removes all elements from a HashSet object.
            */
            clear: function () {
                $prop(this).clear();
            },

            /**
            * Gets the number of elements contained in the HashSet.
            * @returns {Number}
            */
            count: function () {
                return $prop(this).count();
            },

            /**
            * Determines whether a HashSet object contains the specified element.
            * @param {Object} item The element to locate in the HashSet object.
            * @returns {Boolean}
            */
            contains: function (item) {
                return $prop(this).contains(item);
            },

            /**
            * Copies the elements of a HashSet object to an array.
            * @param {Array} array The one-dimensional array that is the destination of the elements copied from the HashSet object.
            * @param {Number=} arrayIndex The zero-based index in array at which copying begins.
            */
            copyTo: function (array, arrayIndex) {
                $bufferTo($prop(this).keys(), array, arrayIndex);
            },

            /**
            * Gets the EqualityComparer object that is used to determine equality for the values in the set.
            * @returns {EqualityComparer}
            */
            comparer: function () {
                return $prop(this).comparer();
            },

            /**
            * Removes the specified element from a HashSet object.
            * @param {Object} item The element to remove.
            * @returns {Boolean}
            */
            remove: function (item) {
                return $prop(this).remove(item);
            },

            /**
            * Removes all elements that match the conditions defined by the specified predicate from a HashSet collection.
            * @param {Function} match The predicate function that defines the conditions of the elements to remove. eg. function(item)
            * @returns {Number}
            */
            removeWhere: function (match) {
                match = $lambda(match);
                $ensureType(match, FUNCTION);

                var _count = this.count(),
                    _table = $prop(this),
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
                $nullCheck(other);

                if (this.count() === 0) {
                    return;
                }

                else if (other === this) {
                    this.clear();
                    return;
                }

                else {
                    var _eOther = $enumerator(other),
                        _table = $prop(this);

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
                $nullCheck(other);

                // intersection of anything with empty set is empty set, so return if count is 0
                if (this.count() === 0) {
                    return;
                }

                var _count = $count(other);

                if (_count !== -1) {
                    if (_count === 0) {
                        this.clear();
                        return;
                    }

                    // If other is a HashSet, it has unique elements according to its equality comparer,
                    // but if they're using different equality comparers, then assumption of uniqueness
                    // will fail. So first check if other is a hashset using the same equality comparer;
                    // intersect is a lot faster if we can assume uniqueness.

                    if (areEqualityComparersEqual(this, other)) {
                        var _table = $prop(this),
                            _otable = $prop(other),
                            _buffer = $buffer(this),
                            _len = _buffer.length,
                            _item;

                        while (_len-- > 0) {
                            if (!_otable.contains(_item = _buffer[_len])) {
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
                $nullCheck(other);

                var _count = $count(other);

                if (_count !== -1) {

                    if (this.count() === 0) {
                        return _count > 0;
                    }

                        // faster if other is a hashset (and we're using same equality comparer)
                    else if (areEqualityComparersEqual(this, other)) {
                        if (this.count() >= _count) {
                            return false;
                        }

                            // this has strictly less than number of items in other, so the following
                            // check suffices for proper subset.
                        else {
                            return isSubsetOfHashSetWithSameEC(this, other);
                        }
                    }
                }

                var result = checkUniqueAndUnfoundElements(this, other, false);
                return (result.uniqueCount === this.count() && result.unfoundCount > 0);
            },

            /**
            * Determines whether the current set is a proper (strict) superset of a specified collection.
            * @param {Enumerable} other The collection to compare to the current set.
            * @returns {Boolean}
            */
            isProperSupersetOf: function (other) {
                $nullCheck(other);

                // the empty set isn't a proper superset of any set.
                if (this.count() === 0) {
                    return false;
                }

                var _count = $count(other);

                if (_count !== -1) {

                    // if other is the empty set then this is a superset
                    if (_count === 0) {
                        return true;
                    }

                        // faster if other is a hashset with the same equality comparer
                    else if (areEqualityComparersEqual(this, other)) {
                        if (_count >= this.count()) {
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
            * @param {Enumerable} other The collection to compare to the current set.
            * @returns {Boolean}
            */
            isSubsetOf: function (other) {
                $nullCheck(other);

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

                var result = checkUniqueAndUnfoundElements(this, other, false);
                return (result.uniqueCount === this.count() && result.unfoundCount >= 0);
            },

            /**
            * Determines whether the current set is a superset of a specified collection.
            * @param {Enumerable} other The collection to compare to the current set.
            * @returns {Boolean}
            */
            isSupersetOf: function (other) {
                $nullCheck(other);

                var _count = $count(other);

                if (_count !== -1) {

                    // if other is the empty set then this is a superset
                    if (_count === 0) {
                        return true;
                    }

                    else if (areEqualityComparersEqual(this, other)) {
                        if (_count > this.count()) {
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
                $nullCheck(other);

                if (this.count() === 0) {
                    return false;
                }

                var _eOther = $enumerator(other),
                    _table = $prop(this);

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
                $nullCheck(other);

                if (areEqualityComparersEqual(this, other)) {
                    if (this.count() !== other.count()) {
                        return false;
                    }

                    /// already confirmed that the sets have the same number of distinct elements, 
                    /// so if one is a superset of the other then they must be equal

                    return containsAllElements(this, other);
                }

                var _count = $count(other);

                if (_count !== -1) {

                    // if this count is 0 but other contains at least one element, they can't be equal
                    if (this.count() === 0 && _count > 0) {
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
                $nullCheck(other);

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
                        _table = $prop(this);

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
                $nullCheck(other);

                var _eOther = $enumerator(other),
                    _table = $prop(this);

                while (_eOther.next()) {
                    _table.add(_eOther.current, null);
                }
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                var _e = $enumerator($prop(this));
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
                _table = $prop(set);

            while (_eOther.next()) {
                if (!_table.contains(_eOther.current)) {
                    return false;
                }
            }

            return true;
        }

        function isSubsetOfHashSetWithSameEC(set, other) {
            var _e = $enumerator(set),
                _table = $prop(other);

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
                _table = $prop(set),
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
                return this._next == null || this._next === $prop(this._list).head ? null : this._next;
            },

            /**
            * Gets the previous node in the LinkedList.
            * @returns {LinkedListNode}
            */
            previous: function () {
                return this._prev == null || this === $prop(this._list).head ? null : this._prev;
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

            $prop(this, {
                count: 0,
                head: null
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
                var _source = $prop(this),
                    _current = _source.head;

                while (_current != null) {
                    var temp = _current;
                    _current = _current.next();   // use next() the instead of "_next", otherwise it will loop forever
                    resetNode(temp);
                }

                _source.head = null;
                _source.count = 0;
            },

            /**
            * Gets the number of elements contained in the LinkedList.
            * @returns {Number}
            */
            count: function () {
                return $prop(this).count;
            },

            /**
            * Determines whether a value is in the LinkedList.
            * @param {Object} value The value to locate in the LinkedList.
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
                return $prop(this).head;
            },

            /**
            * Gets the last node of the LinkedList.
            * @returns {LinkedListNode}
            */
            getLast: function () {
                var _head = $prop(this).head;
                return _head == null ? null : _head._prev;
            },

            /**
            * Adds the specified new node after the specified existing node in the LinkedList.
            * @param {LinkedListNode} node The LinkedListNode after which to insert newNode.
            * @param {LinkedListNode|Object} value The value or the LinkedListNode to add to the LinkedList.
            * @returns {LinkedListNode}
            */
            addAfter: function (node, value) {

                $ensureType(node, __LinkedListNode);

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

                $ensureType(node, __LinkedListNode);

                var _source = $prop(this),
                    _newNode;

                if ($is(value, __LinkedListNode)) {
                    _newNode = value;
                    insertNodeBefore(this, node, _newNode);
                    if (node === _source.head) {
                        _source.head = _newNode;
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

                var _node,
                    _source;

                if ($is(value, __LinkedListNode)) {
                    _node = value;
                    _source = $prop(this);

                    validateNode(_node);

                    if (_source.head == null) {
                        insertNodeToEmptyList(this, _node);
                    }
                    else {
                        insertNodeBefore(this, _source.head, _node);
                        _source.head = _node;
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
                var _node,
                    _source;

                if ($is(value, __LinkedListNode)) {
                    _node = value;
                    _source = $prop(this);

                    validateNode(_node);

                    if (_source.head == null) {
                        insertNodeToEmptyList(this, _node);
                    }
                    else {
                        insertNodeBefore(this, _source.head, _node);
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
                var _source = $prop(this),
                    _node = _source.head;

                if (_node != null) {
                    if (value != null) {
                        do {
                            if ($computeEquals(_node._value, value)) {
                                return _node;
                            }
                            _node = _node._next;
                        } while (_node !== _source.head);
                    }
                    else {
                        do {
                            if (_node._value == null) {
                                return _node;
                            }

                            _node = _node._next;
                        } while (_node !== _source.head);
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
                var _source = $prop(this);

                if (_source.head == null) {
                    return null;
                }

                var _last = _source.head._prev,
                    _node = _last;

                if (_node != null) {
                    if (value != null) {
                        do {
                            if ($computeEquals(_node._value, value)) {
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

                var _node,
                    _source;

                if ($is(value, __LinkedListNode)) {
                    _node = value;
                    _source = $prop(this);

                    validateNode(_node, this);

                    if (_node._next === _node) {
                        _source.head = null;
                    }
                    else {
                        _node._next._prev = _node._prev;
                        _node._prev._next = _node._next;

                        if (_source.head === _node) {
                            _source.head = _node._next;
                        }
                    }
                    resetNode(_node);
                    _source.count--;

                    return true;
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
                var _source = $prop(this);

                if (_source.head == null) {
                    $error(ERROR_EMPTY_COLLECTION);
                }

                this.remove(_source.head);
            },

            /**
            * Removes the node at the end of the LinkedList.
            */
            removeLast: function () {
                var _source = $prop(this);

                if (_source.head == null) {
                    $error(ERROR_EMPTY_COLLECTION);
                }

                this.remove(_source.head._prev);
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                var _head = $prop(this).head,
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
            $ensureType(node, __LinkedListNode);
            $ensureType(newNode, __LinkedListNode);

            validateNode(newNode);
            validateNode(node, list);

            newNode._list = list;
            newNode._next = node;
            newNode._prev = node._prev;

            node._prev._next = newNode;
            node._prev = newNode;
            $prop(list).count++;
        }

        function insertNodeToEmptyList(list, newNode) {
            $ensureType(newNode, __LinkedListNode);
            validateNode(newNode);

            var _source = $prop(list);

            newNode._list = list;
            newNode._next = newNode;
            newNode._prev = newNode;

            _source.head = newNode;
            _source.count++;
        }

        function validateNode(node, list) {
            if ((list === null && node._list != null) || node._list != list) {
                $error("Invalid node list.");
            }
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

            if (collection != null) {
                _items = $buffer(collection).concat();
            }

            $prop(this, _items);
        }

        return $extend(Queue, __Collection, {

            /**
            * Removes all objects from the Queue.
            */
            clear: function () {
                $prop(this).length = 0;
            },

            /**
            * Gets the number of elements contained in the Queue.
            * @returns {Number}
            */
            count: function () {
                return $prop(this).length;
            },

            /**
            * Determines whether an element is in the Queue.
            * @param {Object} item The object to locate in the Queue.
            * @returns {Boolean}
            */
            contains: function (item) {
                return $prop(this).indexOf(item) !== -1;
            },

            /**
            * Copies the Queue to an existing one-dimensional Array, starting at the specified array index.
            * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Queue.
            * @param {Number} arrayIndex The zero-based index in array at which copying begins.
            */
            copyTo: function (array, arrayIndex) {
                $bufferTo(this, array, arrayIndex);
            },

            /**
            * Removes and returns the object at the beginning of the Queue.
            * @returns {Object}
            */
            dequeue: function () {
                var _source = $prop(this),
                    _length = _source.length;

                if (_length > 0) {
                    return _source.shift();
                }

                $error(ERROR_EMPTY_COLLECTION);
            },

            /**
            * Adds an object to the end of the Queue.
            * @param {Object} item The object to add to the Queue.
            */
            enqueue: function (item) {
                $prop(this).push(item);
            },

            /**
            * Returns the object at the beginning of the Queue without removing it.
            * @returns {Object}
            */
            peek: function () {
                var _source = $prop(this),
                    _length = _source.length;

                if (_length > 0) {
                    return _source[0];
                }

                $error(ERROR_EMPTY_COLLECTION);
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                return $enumerator($prop(this));
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

            if (collection != null) {
                _items = $buffer(collection).concat();
            }

            $prop(this, _items);
        }

        return $extend(Stack, __Collection, {

            /**
            * Removes all objects from the Stack.
            */
            clear: function () {
                $prop(this).length = 0;
            },

            /**
            * Gets the number of elements contained in the Stack.
            * @returns {Number}
            */
            count: function () {
                return $prop(this).length;
            },

            /**
            * Determines whether an element is in the Stack.
            * @param {Object} item The object to locate in the Stack.
            * @returns {Boolean}
            */
            contains: function (item) {
                return $prop(this).indexOf(item) !== -1;
            },

            /**
            * Copies the Stack to an existing one-dimensional Array, starting at the specified array index.
            * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Stack.
            * @param {Number} arrayIndex The zero-based index in array at which copying begins.
            */
            copyTo: function (array, arrayIndex) {
                $bufferTo(this, array, arrayIndex);
            },

            /**
            * Returns the object at the top of the Stack without removing it.
            * @returns {Object}
            */
            peek: function () {
                var _source = $prop(this),
                    _length = _source.length;

                if (_length > 0) {
                    return _source[_length - 1];
                }

                $error(ERROR_EMPTY_COLLECTION);
            },

            /**
            *   Removes and returns the object at the top of the Stack.
            *   @returns {Object}
            */
            pop: function () {
                var _source = $prop(this),
                    _length = _source.length;

                if (_length > 0) {
                    return _source.pop();
                }

                $error(ERROR_EMPTY_COLLECTION);
            },

            /**
            * Inserts an object at the top of the Stack.
            * @param {Object} item The object to push onto the Stack. 
            */
            push: function (item) {
                $prop(this).push(item);
            },

            /** 
            * Returns an enumerator that iterates through the collection. 
            * @returns {Enumerator}
            */
            getEnumerator: function () {
                return $enumerator($prop(this));
            }
        });
    })();


    /**
    * Defines a data structures that map keys to Enumerable sequences of values.
    */
    var __Lookup = (function () {

        /**
        * Represents a collection of keys each mapped to one or more values.
        * @param {Enumerable} source An Enumerable object.
        * @param {Enumerable} keySelector A function to extract the key from each element of the sequence. eg. function(outer)
        * @param {Function} elementSelector A transform function to produce a result element value from each element. eg. function(item)
        * @param {EqualityComparer} comparer An equality comparer to compare values.
        */
        function Lookup(source, keySelector, elementSelector, comparer) {

            var _table = new __HashTable($count(source), comparer),
                _buffer = $buffer(source),
                _count = _buffer.length,
                _item,
                _key,
                _entry,
                _val;

            for (var i = 0; i < _count; i++) {
                _item = _buffer[i];
                _key = keySelector(_item);
                _entry = _table.entry(_key);
                _val = elementSelector ? elementSelector(_item) : _item;

                if (_entry == null) {
                    _table.add(_key, new __Grouping(_key, [_val]));
                }
                else {
                    _entry.value.elements.push(_val);
                }
            }

            $prop(this, _table);
        }

        return $extend(Lookup, __Collection, {
            /**
            * Determines whether a specified key exists in the Lookup.
            * @param {Object} key The key to search for in the Lookup.
            * @returns {Boolean}
            */
            contains: function (key) {
                return $prop(this).contains(key);
            },

            /**
            * Gets the number of key/value collection pairs in the Lookup.
            * @returns {Number}
            */
            count: function () {
                return $prop(this).count();
            },

            /**
            * Gets the value associated with the specified key.
            * @param {Object} key The key of the element to add.
            * @returns {Enumerable}
            */
            get: function (key) {
                var _entry = $prop(this).entry(key);
                return _entry == null ? __Enumerable.empty() : _entry.value;
            },

            /**
            * Returns an enumerator that iterates through a Grouping object.
            * @returns {Enumerable}
            */
            getEnumerator: function () {
                var _e = $enumerator($prop(this));
                return new __Enumerator(function (yielder) {
                    while (_e.next()) {
                        return yielder(_e.current.value);
                    }
                });
            }
        });

    })();


    /**
    * Represents a collection of objects that have a common key.
    */
    var __Grouping = (function () {

        function Grouping(key, buffer) {

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
            $ensureType(keySelector, FUNCTION);

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
                var _keys = new ARRAY(count),
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
                var _map = new ARRAY(count);

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
                    _func = _args.length === 1 ? $lambda(funcOrSeed) : $lambda(func),
                    _seed = _args.length === 1 ? UNDEFINED : funcOrSeed,
                    _buffer = $buffer(this),
                    _len = _buffer.length,
                    _index = 0,
                    _result;

                $ensureType(_func, FUNCTION);

                if (resultSelector) {
                    resultSelector = $lambda(resultSelector);
                    $ensureType(resultSelector, FUNCTION);
                }

                if (_seed === UNDEFINED) {
                    if (_len === 0) {
                        $error(ERROR_NO_MATCH);
                    }
                    _result = _buffer[_index++];
                }
                else {
                    _result = _seed;
                }

                for (; _index < _len; _index++) {
                    _result = _func(_result, _buffer[_index]);
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
                $ensureType(predicate, FUNCTION);

                return iterate(this, function (item) {
                    return predicate(item) === true;
                });
            },

            /**
            * Determines whether a sequence contains any elements.
            * Returns true if any elements in the source sequence contains any elements or pass the test in the specified predicate; otherwise, false.
            * @param {Function=} predicate A function to test each element for a condition. eg. function(item).
            * @returns {Boolean}
            */
            any: function (predicate) {

                predicate = $lambda(predicate);

                return !iterate(this, function (item) {
                    return predicate ? predicate(item) === false : false;
                });
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
                    $ensureType(selector, FUNCTION);
                    return $enumerable(this).select(selector).average();
                }

                var _buffer = $buffer(this),
                    _len = _buffer.length,
                    _sum = 0;

                if (_len === 0) {
                    $error(ERROR_NO_ELEMENTS);
                }

                while (_len-- > 0) {
                    _sum += _buffer[_len];
                }

                if (isNaN(_sum)) {
                    $error(ERROR_NON_NUMERIC_TYPE);
                }

                return _sum / _buffer.length;
            },

            /**
            * Concatenates two sequences.
            * @param {Enumerable} second The sequence to concatenate to the first sequence.
            * @returns {Enumerable}
            */
            concat: function (second) {
                $nullCheck(second);

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
                    $ensureType(predicate, FUNCTION);
                    return $enumerable(this).where(predicate).count();
                }

                var _count = $count(this);

                // fast count for array-like enumerables
                if (_count !== -1) {
                    return _count;
                }
                else {
                    var _e = $enumerator(this),
                        _count = 0;

                    while (_e.next()) {
                        _count++;
                    }

                    return _count;
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
                    var _e = $enumerator(_source),
                        _empty = true;

                    return new __Enumerator(function (yielder) {
                        if (_e.next()) {
                            _empty = false;
                            do {
                                return yielder(_e.current);
                            } while (_e.next());
                        }
                        else if (_empty) {
                            _empty = false;
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
                        _table = new __HashTable($count(_source), comparer);

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
                $ensureType(index, NUMBER);

                if (index < 0) {
                    $error(ERROR_ARGUMENT_OUT_OF_RANGE);
                }

                var _arr = asArrayLike(this);

                // fast find for array-like enumerables
                if (_arr) {
                    if (index < _arr.length) {
                        return _arr[index];
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

                $error(ERROR_ARGUMENT_OUT_OF_RANGE);
            },

            /**
            * Returns the first element in a sequence that satisfies a specified condition. this method throws an exception if there is no element in the sequence.
            * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
            * @returns {Object}
            */
            first: function (predicate) {

                var _default = {},
                    _result = this.firstOrDefault(predicate, _default);

                if (_result === _default) {
                    $error(predicate ? ERROR_NO_MATCH : ERROR_NO_ELEMENTS);
                }

                return _result;
            },

            /**
            * Returns the first element of the sequence that satisfies a condition or a default value if no such element is found.
            * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
            * @param {Object=} defaultValue The value to return if no element exists with specified condition.
            * @returns {Object}
            */
            firstOrDefault: function (predicate, defaultValue) {

                var _result = defaultValue || null;
                predicate = $lambda(predicate);

                iterate(this, function (item) {
                    if (predicate == null || predicate(item)) {
                        _result = item;
                        return false;
                    }
                });

                return _result;
            },

            /**
            * Performs the specified action on each element of an Enumerable.
            * @param {Function} action The action function to perform on each element of an Enumerable. eg. function(item, index)
            */
            forEach: function (action) {
                action = $lambda(action);
                $ensureType(action, FUNCTION);

                var _i = 0;

                iterate(this, function (item) {
                    action(item, _i++);
                });
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
                $ensureType(keySelector, FUNCTION);

                var _args = arguments,
                    _elementSelector = $lambda(_args[2]),
                    _resultSelector = $lambda(_args[3]),
                    _comparer = _args.length === 2 && !_elementSelector ? _args[1] : (_args.length === 3 && !_resultSelector ? _args[2] : _args[3]),
                    _source = this;

                return new __Enumerable(function () {

                    var _e = $enumerator(new __Lookup(_source, keySelector, _elementSelector, _comparer));

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

                $nullCheck(inner);
                $ensureType(outerKeySelector, FUNCTION);
                $ensureType(innerKeySelector, FUNCTION);
                $ensureType(resultSelector, FUNCTION);

                var _source = this;

                return new __Enumerable(function () {
                    var _e = $enumerator(_source),
                        _table = createLookupTable(inner, innerKeySelector, comparer);

                    return new __Enumerator(function (yielder) {
                        while (_e.next()) {
                            var _entry = _table.entry(outerKeySelector(_e.current));
                            return yielder(resultSelector(_e.current, _entry ? new __Enumerable(_entry.value) : __Enumerable.empty()));
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

                $nullCheck(inner);
                $ensureType(outerKeySelector, FUNCTION);
                $ensureType(innerKeySelector, FUNCTION);
                $ensureType(resultSelector, FUNCTION);

                var _source = this;

                return new __Enumerable(function () {
                    var _eOuter = $enumerator(_source),
                        _table = createLookupTable(inner, innerKeySelector, comparer),
                        _elements,
                        _entry,
                        _index = 0;

                    if (!_eOuter.next()) {
                        return __Enumerable.empty().getEnumerator();
                    }

                    return new __Enumerator(function (yielder) {

                        do {
                            if (_elements == null) {
                                _entry = _table.entry(outerKeySelector(_eOuter.current));
                                if (_entry == null) {
                                    continue;
                                }
                                _elements = _entry.value;
                            }

                            if (_index < _elements.length) {
                                return yielder(resultSelector(_eOuter.current, _elements[_index++]));
                            }
                            else {
                                _index = 0;
                                _elements = null;
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

                var _default = {},
                    _result = this.lastOrDefault(predicate, _default);

                if (_result === _default) {
                    $error(predicate ? ERROR_NO_MATCH : ERROR_NO_ELEMENTS);
                }

                return _result;
            },

            /**
            * Returns the last element of a sequence that satisfies a condition or a default value if no such element is found.
            * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
            * @param {Object=} defaultValue The value to return if no element exists with specified condition.
            * @returns {Object}
            */
            lastOrDefault: function (predicate, defaultValue) {

                predicate = $lambda(predicate);

                var _result = defaultValue || null,
                    _arr = asArrayLike(this);

                // fast iteration for array-like enumerables
                if (_arr) {
                    var _len = _arr.length;

                    if (predicate) {
                        while (_len--) {
                            if (predicate(_arr[_len])) {
                                return _arr[_len];
                            }
                        }
                    }
                    else if (_len > 0) {
                        return _arr[_len - 1];
                    }
                }
                else {
                    iterate(this, function (item) {
                        if (predicate == null || predicate(item)) {
                            _result = item;
                        }
                    });
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
                    $ensureType(selector, FUNCTION);
                    return $enumerable(this).select(selector).max();
                }

                var _buffer = $buffer(this),
                    _len = _buffer.length;

                if (_len === 0) {
                    $error(ERROR_NO_ELEMENTS);
                }
                else {
                    var _max = _buffer[--_len],
                        _value;

                    while (_len-- > 0) {
                        _value = _buffer[_len];

                        if (_value > _max) {
                            _max = _value;
                        }
                    }

                    return _max;
                }
            },

            /**
            * Invokes a transform function on each element of a sequence and returns the minimum value.
            * @param {Function=} selector A transform function to apply to each element. eg. function(item)
            * @returns {Object}
            */
            min: function (selector) {

                if (selector) {
                    selector = $lambda(selector);
                    $ensureType(selector, FUNCTION);
                    return $enumerable(this).select(selector).min();
                }

                var _buffer = $buffer(this),
                    _len = _buffer.length;

                if (_len === 0) {
                    $error(ERROR_NO_ELEMENTS);
                }
                else {
                    var _min = _buffer[--_len],
                        _value;

                    while (_len-- > 0) {
                        _value = _buffer[_len];

                        if (_value < _min) {
                            _min = _value;
                        }
                    }

                    return _min;
                }
            },

            /**
            * Filters the elements of an Enumerable based on a specified type.
            * @param {Function} type The type to filter the elements of the sequence on.
            * @returns {Enumerable}
            */
            ofType: function (type) {
                $ensureType(type, FUNCTION);

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

                var _buffer = $buffer(this),
                    _len = _buffer.length;

                return new __Enumerable(function () {
                    return new __Enumerator(function (yielder) {
                        if (_len-- > 0) {
                            return yielder(_buffer[_len]);
                        }
                    });
                });
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
                    for (var i = 0; i < _len; i++) {
                        var _item1 = _arr1[i],
                            _item2 = _arr2[i];

                        if (!$equals(_item1, _item2, _comparer)) {
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
                $ensureType(selector, FUNCTION);

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
                $ensureType(collectionSelector, FUNCTION);

                if (resultSelector) {
                    resultSelector = $lambda(resultSelector);
                    $ensureType(resultSelector, FUNCTION);
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
                var _default = {},
                    _result = this.singleOrDefault(predicate, _default);

                if (_result === _default) {
                    $error(predicate ? ERROR_NO_MATCH : ERROR_NO_ELEMENTS);
                }

                return _result;
            },

            /**
            * Returns the only element of a sequence that satisfies a specified condition or a default value if no such element exists; this method throws an exception if more than one element satisfies the condition.
            * @param {Function=} predicate A function to test each source element for a condition. eg. function(item)
            * @param {Object=} defaultValue The value to return if no element exists with specified condition.
            * @returns {Object}
            */
            singleOrDefault: function (predicate, defaultValue) {

                var _count = 0,
                    _result = defaultValue || null;

                predicate = $lambda(predicate);

                iterate(this, function (item) {
                    if (predicate == null || predicate(item)) {

                        if (_count > 1) {
                            return false;
                        }

                        _result = item;
                        _count++;
                    }
                });

                if (_count < 2) {
                    return _result;
                }

                $error(predicate ? ERROR_MORE_THAN_ONE_MATCH : ERROR_MORE_THAN_ONE_ELEMENT);
            },

            /**
            * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
            * @param {Number} count The number of elements to skip before returning the remaining elements.
            * @returns {Enumerable}
            */
            skip: function (count) {
                $ensureType(count, NUMBER);

                var _source = this,
                    _arr = asArrayLike(this);

                if (_arr) {
                    return new __Enumerable($buffer(_arr).slice(count));
                }
                else {
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
                }
            },

            /**
            * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements. The element's index is used in the logic of the predicate function.
            * @param {Function=} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element. eg. function(item, index)
            * @returns {Enumerable}
            */
            skipWhile: function (predicate) {

                predicate = $lambda(predicate);
                $ensureType(predicate, FUNCTION);

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
                    $ensureType(selector, FUNCTION);
                    return $enumerable(this).select(selector).sum();
                }

                var _buffer = $buffer(this),
                    _len = _buffer.length,
                    _sum = 0;

                while (_len-- > 0) {
                    _sum += _buffer[_len];
                }

                if (isNaN(_sum)) {
                    $error(ERROR_NON_NUMERIC_TYPE);
                }

                return _sum;
            },

            /**
            * Returns a specified number of contiguous elements from the start of a sequence.
            * @param {Number} count The number of elements to return.
            * @returns {Enumerable}
            */
            take: function (count) {
                $ensureType(count, NUMBER);

                var _source = this,
                    _arr = asArrayLike(this);

                if (_arr) {
                    return new __Enumerable($buffer(_arr).slice(0, count));
                }
                else {
                    return new __Enumerable(function () {
                        var _e = $enumerator(_source),
                            _index = 0;

                        return new __Enumerator(function (yielder) {
                            while (_index++ < count && _e.next()) {
                                return yielder(_e.current);
                            }
                        });
                    });
                }
            },

            /**
            * Returns elements from a sequence as long as a specified condition is true. The element's index is used in the logic of the predicate function.
            * @param {Function=} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element. eg. Function(item, index)
            * @returns {Enumerable}
            */
            takeWhile: function (predicate) {

                predicate = $lambda(predicate);
                $ensureType(predicate, FUNCTION);

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
                // 'concat' is fastest way to duplicate an array
                return $buffer(this).concat();
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
                $ensureType(keySelector, FUNCTION);

                var _args = arguments,
                    _elementSelector = $lambda(_args[1]),
                    _comparer = _args.length === 2 && !_elementSelector ? _args[1] : _args[2],
                    _dic = new __Dictionary(_comparer);

                iterate(this, function (item) {
                    return _dic.add(keySelector(item), _elementSelector ? _elementSelector(item) : item);
                });

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
                keySelector = $lambda(keySelector || "t => t");
                $ensureType(keySelector, FUNCTION);

                var _args = arguments,
                    _elementSelector = $lambda(_args[1]),
                    _comparer = _args.length === 2 && !_elementSelector ? _args[1] : _args[2];

                return new __Lookup(this, keySelector, _elementSelector, _comparer);
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
                $ensureType(predicate, FUNCTION);

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
                $ensureType(resultSelector, FUNCTION);

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
        * Iterates over an Enumerable, executes a callback function in each iteration, returns false when callback function fails
        * @param {Enumerable} value An Enumerable object.
        * @param {Function} action The action function to perform on each element of an Enumerable.
        * @returns {Boolean}
        */
        function iterate(value, action) {
            var _arr = asArrayLike(value);

            if (_arr) {
                for (var i = 0, _len = _arr.length; i < _len; i++) {
                    if (action(_arr[i]) === false) {
                        return false;
                    }
                }

            }
            else {
                var _e = $enumerator(value);
                while (_e.next()) {
                    if (action(_e.current) === false) {
                        return false;
                    }
                }
            }

            return true;
        }


        /**
        * Returns array-like object if the value is Array, String, List or Array-like, otherwise null
        * @param {Enumerable} value An Enumerable object.
        * @returns {Array}
        */
        function asArrayLike(value) {
            if ($is(value, ARRAY) ||
                $is(value, STRING) ||
                $is(value, __List) ||
                $is(value, __ReadOnlyCollection)) {
                return value;
            }

            var _source = $prop(value);

            if (_source) {
                if ($is(_source, ARRAY) ||
                    $is(_source, STRING) ||
                    ($is(_source.length, NUMBER) && $isFunc(_source.splice))) {
                    return _source;
                }
            }

            return null;
        }


        /**
        * Creates a lookup-like HashTable to use in join operations
        * @param {Enumerable} source An Enumerable object.
        * @param {Enumerable} keySelector A function to extract the key from each element of the sequence. eg. function(outer)
        * @param {EqualityComparer} comparer An equality comparer to compare values.
        * @returns {HashTable}
        */
        function createLookupTable(source, keySelector, comparer) {

            var _table = new __HashTable($count(source), comparer);

            iterate(source, function (item) {
                var _key = keySelector(item),
                    _entry = _table.entry(_key);

                if (_entry == null) {
                    _table.add(_key, [item]);
                }
                else {
                    _entry.value.push(item);
                }
            });

            return _table;
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
    * Gets number of items if the value is a Collection, Array or an Array-like, otherwise returns -1.
    * @param {Enumerable} value An Enumerable object.
    * @returns {Number}
    */
    function $count(value) {

        if ($isArrayLike(value)) {
            return value.length;
        }
        else if (value instanceof __Collection) {
            return value.count();
        }
        else if (value instanceof __Enumerable) {
            var _source = $prop(value);

            if ($isArrayLike(_source)) {
                return _source.length;
            }
        }

        return -1;
    }


    /**
    * Buffers an Enumerable object into an array.
    * @param {Enumerable} value An Enumerable object.
    * @returns {Array}
    */
    function $buffer(value) {

        /// use 'instanceof' and 'typeof' operators to maximize performance

        if (value instanceof ARRAY) {                                   // fast buffer arrays
            return value;
        }

        else if (typeof value === "string") {                           // fast buffer strings
            return value.split("");
        }

        else {

            var _source = $prop(value);

            if (_source) {
                if (_source instanceof ARRAY) {                         // fast buffer array/string enumerable
                    return _source;
                }
                else if (typeof _source === "string") {                 // fast buffer strings
                    return _source.split("");
                }
                else if (typeof _source.slice === "function") {         // fast buffer enumerable with slice function: List
                    return _source.slice(0);
                }
            }


            // do it the hard way
            var _e = $enumerator(value),
                _length = 16,
                _count = 0,
                _arr;


            // collections have fixed element count
            if (value instanceof __Collection) {
                _arr = new ARRAY(value.count());

                while (_e.next()) {
                    _arr[_count++] = _e.current;
                }

                return _arr;
            }
            else {
                _arr = new ARRAY(_length);

                while (_e.next()) {
                    if (_count >= _length) {
                        _length *= 4;
                        _arr.length = _length;
                    }

                    _arr[_count++] = _e.current;
                }

                _arr.length = _count;
                return _arr;
            }
        }
    }


    /**
    * Buffers an Enumerable instance into a given array.
    * @param {mx.Collection} value A Collection object.
    * @param {Array} array The one-dimensional Array that is the destination of the elements copied from Dictionary keys.
    * @param {Number} index The zero-based index in array at which copying begins.
    */
    function $bufferTo(value, array, index) {

        $nullCheck(array);
        $ensureType(index, NUMBER);

        if (index > array.length || value.count() > array.length) {
            $error(ERROR_ARRAY_SIZE);
        }

        var _buffer = $buffer(value),
            _count = _buffer.length,
            _index = -1;

        while (++_index < _count) {
            array[index + _index] = _buffer[_index];
        }
    }


    /**
    * Searches a range of elements in a sorted Array for an element using the specified comparer and returns the zero-based index of the element.
    * @param {Array} array The sorted array to find value.
    * @param {Number} index The zero-based starting index of the range to search.
    * @param {Number} length The length of the range to search.
    * @param {Object} value The value to locate.
    * @param {Comparer} comparer The Comparer implementation to use when comparing elements.
    * @returns {Number}
    */
    function $binarySearch(array, index, length, value, comparer) {
        var _lo = index,
            _hi = index + length - 1,
            _order = 0,
            _i = 0;

        while (_lo <= _hi) {
            _i = _lo + ((_hi - _lo) >> 1);
            _order = comparer.compare(array[_i], value);

            if (_order === 0) {
                return _i;
            }
            else if (_order < 0) {
                _lo = _i + 1;
            }
            else {
                _hi = _i - 1;
            }
        }

        return ~_lo;
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
            return __Comparer.defaultComparer;
        }
    }


    /**
    * Gets or creates a new EqualityComparer object.
    * @param {EqualityComparer|Object} value An EqualityComparer object.
    * @returns {EqualityComparer}
    */
    function $equalityComparer(value) {
        if (value instanceof __EqualityComparer) {
            return value;
        }

        else if (value && $isFunc(value.hash) && $isFunc(value.equals)) {
            return __EqualityComparer.create(value.hash, value.equals);
        }

        else {
            return __EqualityComparer.defaultComparer;
        }
    }


    /**
    * Extends Enumerable extension methods to the given type
    * @param {Function} type The type to extend.
    */
    function $enumerableExtend(type) {
        var _proto = type.prototype;

        $ensureType(type, FUNCTION);
        $mixin(_proto, __EnumerableExtensions);

        if (!$isFunc(_proto.getEnumerator)) {
            $define(_proto, "getEnumerator", { value: function () { return $enumerator(this); } });
        }
    }





    /* Modules
    ---------------------------------------------------------------------- */

    $enumerableExtend(__Enumerable);


    /**
    * Creates a new Enumerable instance.
    * @param {Enumerable|Iterable|Array|String|Function|Function*|Object} value An Enumerable object.
    * @returns {Enumerable}
    */
    function multiplex(value) {
        return $is(value, __Enumerable) ? value : new __Enumerable(value);
    }


    var mx = $mixin(multiplex, {
        runtime: $mixin({}, {
            hash: $computeHash,
            equals: $computeEquals,
            compare: $computeCompare,
            lambda: $lambda,
            define: $define,
            mixin: $mixin
        }, { enumerable: true }),

        extensions: $mixin({}, __EnumerableExtensions, { enumerable: true }),

        hash: $hash,
        equals: $equals,
        compare: $computeCompare,
        range: __Enumerable.range,
        repeat: __Enumerable.repeat,
        empty: __Enumerable.empty,
        is: __Enumerable.is,
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
    }, { enumerable: true });


    $mixin(global, {
        mx: mx,
        multiplex: mx
    });



})(this);