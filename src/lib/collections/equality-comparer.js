import isFunction from '../utils/is-function';
import assertType from '../utils/assert-type';
import {runtimeHash, runtimeEquals} from '../runtime/runtime';

/**
* Provides a base class for implementations of the EqualityComparer.
*/
export default class EqualityComparer {
    constructor(hashCodeProvider, equality) {
        assertType(hashCodeProvider, Function);
        assertType(equality, Function);

        this.hash = hashCodeProvider;
        this.equals = equality;
    }

    /**
    * Determines whether the specified objects are equal.
    * @param {Object} x The first object of type Object to compare.
    * @param {Object} y The second object of type Object to compare.
    * @returns true if the specified objects are equal; otherwise, false.
    */
    equals(x, y) {
        return runtimeEquals(x, y);
    }

    /**
    * Returns a hash code for the specified object.
    * @param {Object} obj The Object for which a hash code is to be returned.
    * @returns A hash code for the specified object.
    */
    hash(obj) {
        return runtimeHash(obj);
    }

    /**
    * Gets a default sort order comparer for the type specified by the generic argument.
    */
    static get instance() {
        return defaultEqualityComparer;
    }

    /**
    * Gets or creates a new EqualityComparer object.
    * @param {EqualityComparer|Object} value An EqualityComparer object.
    * @returns {EqualityComparer}
    */
    static from(value) {
        if (value === null || value === undefined || value === defaultEqualityComparer) {
            return defaultEqualityComparer;
        }

        else if (value instanceof EqualityComparer) {
            return value;
        }

        else if (isFunction(value.hash) && isFunction(value.equals)) {
            return new EqualityComparer(value.hash, value.equals);
        }

        return defaultEqualityComparer;
    }

    get [Symbol.toStringTag]() {
        return 'EqualityComparer';
    }

    toString() {
        return '[EqualityComparer]';
    }
}


const defaultEqualityComparer = new EqualityComparer(runtimeHash, runtimeEquals);
