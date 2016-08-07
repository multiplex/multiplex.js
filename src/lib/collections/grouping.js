import Collection from './collection';

export default class Grouping extends Collection {
    constructor(key, elements) {
        super();
        this.key = key;
        this.elements = elements;
    }

    valueOf() {
        return this.elements;
    }

    get [Symbol.toStringTag]() {
        return 'Grouping';
    }

    toString() {
        return '[Grouping]';
    }
}
