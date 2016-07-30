import Collection from './collection';

export default class HashSet extends Collection {
    constructor(comparer) {
        super();
        this._comparer = comparer;
    }
}
