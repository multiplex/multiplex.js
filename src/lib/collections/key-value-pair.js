import {runtimeHash, runtimeEquals} from '../runtime/runtime';
import combineHash from '../runtime/hash-combine';
import mixin from '../utils/mixin';

/**
* Initializes a new instance of the KeyValuePair with the specified key and value.
* @param {Object} key The object defined in each key/value pair.
* @param {Object} value The definition associated with key.
*/
export default function KeyValuePair(key, value) {
    this.key = key;
    this.value = value;
}

mixin(KeyValuePair.prototype, {
    __hash__: function () {
        return combineHash(runtimeHash(this.key), runtimeHash(this.value));
    },

    __eq__: function (obj) {
        return obj instanceof KeyValuePair &&
            runtimeEquals(this.key, obj.key) &&
            runtimeEquals(this.value, obj.value);
    },

    toString: function () {
        return '[KeyValuePair]';
    }
});

