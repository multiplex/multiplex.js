export default function HashTableEntry(hash, next, key, value) {
    this.hash = hash;       // item's key hash-code
    this.next = next;       // index of the next bucket in the chained bucket list
    this.key = key;         // item's key
    this.value = value;     // item's value
}
