import {runtimeHash, runtimeEquals} from '../runtime/runtime';
import combineHash from '../runtime/hash-combine';

/**
* Initializes a new instance of the KeyValuePair with the specified key and value.
* @param {Object} key The object defined in each key/value pair.
* @param {Object} value The definition associated with key.
*/
export default class KeyValuePair {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

    __hash__() {
        return combineHash(runtimeHash(this.key), runtimeHash(this.value));
    }

    __eq__(obj) {
        return obj instanceof KeyValuePair &&
            runtimeEquals(this.key, obj.key) &&
            runtimeEquals(this.value, obj.value);
    }

    get [Symbol.toStringTag]() {
        return 'KeyValuePair';
    }

    toString() {
        return '[KeyValuePair]';
    }
}
