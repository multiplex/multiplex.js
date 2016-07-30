import compare from '../runtime/compare';
import mixin from '../utils/mixin';
import isFunction from '../utils/is-function';
import assertType from '../utils/assert-type';

/**
* Provides a base class for implementations of Comparer.
*/
export default function Comparer(comparison) {
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
