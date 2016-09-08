import Collection from './collection';

export default class HashSet extends Collection {
    constructor(comparer) {
        super();
        this.comparer = comparer;
    }

    get [Symbol.toStringTag]() {
        return 'HashSet';
    }

    toString() {
        return '[HashSet]';
    }
}
