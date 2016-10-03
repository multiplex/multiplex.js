import Collection from './collection';

export default class Grouping extends Collection {
    constructor(key, elements) {
        super();
        this.key = key;
        this.elements = elements;
    }

    /**
    * Gets the number of elements in the Grouping.
    * @returns {Number}
    */
    count() {
        return this.elements.length;
    }

    /**
    * Creates an array from the Grouping.
    * @returns {Array}
    */
    toArray() {
        return this.elements;
    }

    get [Symbol.toStringTag]() {
        return 'Grouping';
    }

    toString() {
        return '[Grouping]';
    }
}
