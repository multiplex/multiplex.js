import mixin from '../utils/mixin';

/**
* Represents a node in a LinkedList.
* Initializes a new instance of the LinkedListNode class, containing the specified value.
* @param {Object} value The value to contain in the LinkedListNode
*/
export default function LinkedListNode(value) {
    this._value = value;
    this._list = null;
    this._next = null;
    this._prev = null;
}

mixin(LinkedListNode, {
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
        return this._next === null || this._next === this._list.head ? null : this._next;
    },

    /**
    * Gets the previous node in the LinkedList.
    * @returns {LinkedListNode}
    */
    previous: function () {
        return this._prev === null || this === this._list.head ? null : this._prev;
    },

    toString: function () {
        return '[LinkedList Node]';
    }
});
