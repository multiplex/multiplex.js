/**
* Represents a node in a LinkedList.
*/
export default class LinkedListNode {
    /**
    * Initializes a new instance of the LinkedListNode class, containing the specified value.
    * @param {Object} value The value to contain in the LinkedListNode
    */
    constructor(value) {
        this._value = value;
        this._list = null;
        this._next = null;
        this._prev = null;
    }

    /**
    * Gets the value contained in the node.
    * @returns {Object}
    */
    value() {
        return this._value;
    }

    /**
    * Gets the LinkedList that the LinkedListNode belongs to.
    * @returns {LinkedList}
    */
    list() {
        return this._list;
    }

    /**
    * Gets the next node in the LinkedList.
    * @returns {LinkedListNode}
    */
    next() {
        return this._next === null || this._next === this._list.head ? null : this._next;
    }

    /**
    * Gets the previous node in the LinkedList.
    * @returns {LinkedListNode}
    */
    previous() {
        return this._prev === null || this === this._list.head ? null : this._prev;
    }

    get [Symbol.toStringTag]() {
        return 'LinkedList Node';
    }

    toString() {
        return '[LinkedList Node]';
    }
}
