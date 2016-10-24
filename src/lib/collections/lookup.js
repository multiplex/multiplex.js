import Collection from './collection';
import LookupTable, {LookupTableIterator} from './lookup-table';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import forOf from '../utils/for-of';
import count from '../utils/count';
import extend from '../utils/extend';

export default function Lookup(source, keySelector, elementSelector, comparer) {
    assertNotNull(source);
    assertType(keySelector, Function);

    if (elementSelector) {
        assertType(elementSelector, Function);
    }

    var table = new LookupTable(comparer);
    this.table = table;

    forOf(source, function (element) {
        table.add(keySelector(element), elementSelector ? elementSelector(element) : element);
    });
}


extend(Lookup, Collection, {
    get: function (key) {
        return this.table.get(key);
    },

    contains: function (key) {
        return this.table.contains(key);
    },

    count: function (predicate) {
        return predicate ? count(this, predicate) : this.table.size;
    },

    toArray: function () {
        this.table.entries();
    },

    toString: function () {
        return '[Lookup]';
    },

    '@@iterator': function () {
        return new LookupTableIterator(this.table);
    }
});

