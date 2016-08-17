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
}
