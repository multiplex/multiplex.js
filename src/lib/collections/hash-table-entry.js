export default class HashTableEntry {
    constructor(hash, next, key, value = null) {
        this.hash = hash;       // item's key hash-code
        this.next = next;       // index of the next bucket in the chained bucket list
        this.key = key;         // item's key
        this.value = value;     // item's value
    }
}
