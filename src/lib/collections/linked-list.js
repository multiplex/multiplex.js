import Collection from './collection';
import Iterator from '../iteration/iterator';
import LinkedListNode from './linked-list-node';
import forOf from '../utils/for-of';
import assertType from '../utils/assert-type';
import extend from '../utils/extend';
import count from '../utils/count';
import { runtimeEquals } from '../runtime/runtime';
import error, { ERROR_EMPTY_COLLECTION } from '../utils/error';

/**
* Represents a doubly linked list.
* Initializes a new instance of the LinkedList class that that is empty or contains elements copied from the specified collection.
* @param {Iterable=} collection The collection to copy elements from.
*/
export default function LinkedList(collection) {
    this.size = 0;
    this.head = null;

    if (collection) {
        var list = this;
        forOf(collection, function (element) {
            list.addLast(element);
        });
    }
}

extend(LinkedList, Collection, {
    /**
    * Adds an item to the LinkedList.
    * @param {Object} item The object to add to the LinkedList.
    */
    add: function (item) {
        this.addLast(item);
    },

    /**
    * Removes all nodes from the LinkedList.
    */
    clear: function () {
        while (this.head !== null) {
            var temp = this.head;
            this.head = this.head.next();   // use next() the instead of "_next", otherwise it will loop forever
            temp._list = null;
            temp._next = null;
            temp._prev = null;
        }

        this.head = null;
        this.size = 0;
    },

    /**
    * Gets the number of elements contained in the LinkedList.
    * @param {Function=} predicate A function to test each element for a condition. eg. function(item)
    * @returns {Number}
    */
    count: function (predicate) {
        return predicate ? count(this, predicate) : this.size;
    },

    /**
    * Determines whether a value is in the LinkedList.
    * @param {Object} value The value to locate in the LinkedList.
    * @returns {Boolean}
    */
    contains: function (item) {
        return this.find(item) !== null;
    },

    /**
    * Gets the first node of the LinkedList.
    * @returns {LinkedListNode}
    */
    getFirst: function () {
        return this.head;
    },

    /**
    * Gets the last node of the LinkedList.
    * @returns {LinkedListNode}
    */
    getLast: function () {
        var head = this.head;
        return head === null ? null : head._prev;
    },

    /**
    * Adds the specified new node after the specified existing node in the LinkedList.
    * @param {LinkedListNode} node The LinkedListNode after which to insert newNode.
    * @param {LinkedListNode|Object} value The value or the LinkedListNode to add to the LinkedList.
    * @returns {LinkedListNode}
    */
    addAfter: function (node, value) {
        assertType(node, LinkedListNode);

        var newNode;

        if (value instanceof LinkedListNode) {
            newNode = value;
            this.insertNodeBefore(node._next, newNode);
        }
        else {
            newNode = new LinkedListNode(value);
            this.addAfter(node, newNode);
        }

        return newNode;
    },

    /**
    * Adds the specified new node before the specified existing node in the LinkedList.
    * @param {LinkedListNode} node The LinkedListNode before which to insert newNode.
    * @param {LinkedListNode|Object} value The value or the LinkedListNode to add to the LinkedList.
    * @returns {LinkedListNode}
    */
    addBefore: function (node, value) {
        assertType(node, LinkedListNode);

        var newNode;

        if (value instanceof LinkedListNode) {
            newNode = value;
            this.insertNodeBefore(node, newNode);
            if (node === this.head) {
                this.head = newNode;
            }
        }
        else {
            newNode = new LinkedListNode(value);
            this.addBefore(node, newNode);
        }

        return newNode;
    },

    /**
    * Adds the specified new node at the start of the LinkedList.
    * @param {LinkedListNode|Object} value The value or the LinkedListNode to add at the start of the LinkedList.
    * @returns {LinkedListNode}
    */
    addFirst: function (value) {
        var node;

        if (value instanceof LinkedListNode) {
            node = value;
            validateNode(node, null);

            if (this.head === null) {
                this.insertNodeToEmptyList(node);
            }
            else {
                this.insertNodeBefore(this.head, node);
                this.head = node;
            }
        }
        else {
            node = new LinkedListNode(value);
            this.addFirst(node);
        }

        return node;
    },

    /**
        * Adds the specified new node at the end of the LinkedList.
        * @param {LinkedListNode|Object} value The value or the LinkedListNode to add at the end of the LinkedList.
        * @returns {LinkedListNode}
        */
    addLast: function (value) {
        var node;

        if (value instanceof LinkedListNode) {
            node = value;
            validateNode(node, null);

            if (this.head === null) {
                this.insertNodeToEmptyList(node);
            }
            else {
                this.insertNodeBefore(this.head, node);
            }
        }
        else {
            node = new LinkedListNode(value);
            this.addLast(node);
        }

        return node;
    },

    /**
    * Finds the first node that contains the specified value.
    * @param {Object} value The value to locate in the LinkedList.
    * @returns {LinkedListNode}
    */
    find: function (value) {
        var node = this.head;

        if (node !== null) {
            if (value !== null) {
                do {
                    if (runtimeEquals(node._value, value)) {
                        return node;
                    }
                    node = node._next;
                }
                while (node !== this.head);
            }
            else {
                do {
                    if (node._value === null) {
                        return node;
                    }

                    node = node._next;
                }
                while (node !== this.head);
            }
        }

        return null;
    },

    /**
    * Finds the last node that contains the specified value.
    * @param {Object} value The value to locate in the LinkedList.
    * @returns {LinkedListNode}
    */
    findLast: function (value) {
        if (this.head === null) {
            return null;
        }

        var last = this.head._prev,
            node = last;

        if (node !== null) {
            if (value !== null) {
                do {
                    if (runtimeEquals(node._value, value)) {
                        return node;
                    }

                    node = node._prev;
                }
                while (node !== last);
            }
            else {
                do {
                    if (node._value === null) {
                        return node;
                    }

                    node = node._prev;
                }
                while (node !== last);
            }
        }

        return null;
    },

    /**
    * Removes Removes the specified node or the first occurrence of the specified value from the LinkedList.
    * @param {LinkedListNode|Object} value The LinkedListNode or the value to remove from the LinkedList.
    * @returns {Boolean}
    */
    remove: function (value) {
        var node;

        if (value instanceof LinkedListNode) {
            node = value;
            validateNode(node, this);

            if (node._next === node) {
                this.head = null;
            }
            else {
                node._next._prev = node._prev;
                node._prev._next = node._next;

                if (this.head === node) {
                    this.head = node._next;
                }
            }
            node._list = null;
            node._next = null;
            node._prev = null;
            this.size--;

            return true;
        }
        else {
            if ((node = this.find(value)) !== null) {
                this.remove(node);
                return true;
            }
            return false;
        }
    },

    /**
    * Removes the node at the start of the LinkedList.
    */
    removeFirst: function () {
        if (this.head === null) {
            error(ERROR_EMPTY_COLLECTION);
        }

        this.remove(this.head);
    },

    /**
    * Removes the node at the end of the LinkedList.
    */
    removeLast: function () {
        if (this.head === null) {
            error(ERROR_EMPTY_COLLECTION);
        }

        this.remove(this.head._prev);
    },

    insertNodeBefore: function (node, newNode) {
        assertType(node, LinkedListNode);
        assertType(newNode, LinkedListNode);

        validateNode(newNode, null);
        validateNode(node, this);

        newNode._list = this;
        newNode._next = node;
        newNode._prev = node._prev;

        node._prev._next = newNode;
        node._prev = newNode;
        this.size++;
    },

    insertNodeToEmptyList: function (newNode) {
        assertType(newNode, LinkedListNode);
        validateNode(newNode, null);

        newNode._list = this;
        newNode._next = newNode;
        newNode._prev = newNode;

        this.head = newNode;
        this.size++;
    },

    toString: function () {
        return '[Linked List]';
    },

    '@@iterator': function () {
        var head = this.head,
            node = head;

        return new Iterator(function () {
            if (node !== null) {
                var current = node._value;

                node = node._next;
                if (node === head) {
                    node = null;
                }

                return {
                    value: current,
                    done: false
                };
            }

            return {
                done: true
            };
        });
    }
});

function validateNode(node, list) {
    if ((list === null && node._list !== null) || node._list !== list) {
        error('Invalid node list.');
    }
}
