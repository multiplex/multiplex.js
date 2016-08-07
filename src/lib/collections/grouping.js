import Collection from './collection';

export default class Grouping extends Collection {
    constructor(key, elements) {
        super(elements);
        this.key = key;
        this.elements = elements;
    }

    get [Symbol.toStringTag]() {
        return 'Grouping';
    }

    toString() {
        return '[Grouping]';
    }
}
