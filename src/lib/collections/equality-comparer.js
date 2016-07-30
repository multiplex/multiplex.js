import hash from '../runtime/hash';
import equals from '../runtime/equals';
import mixin from '../utils/mixin';
import isFunction from '../utils/is-function';
import assertType from '../utils/assert-type';

/**
* Provides a base class for implementations of the EqualityComparer.
*/
export default function EqualityComparer(hashCodeProvider, equality) {
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
