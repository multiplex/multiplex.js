import Collection from './collection';
import LookupTable from './lookup-table';
import iteratorSymbol from '../iteration/iterator-symbol';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';
import forOf from '../utils/for-of';
import extend from '../utils/extend';
import mixin from '../utils/mixin';

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


extend(Lookup, Collection);


mixin(Lookup.prototype, {
    get: function (key) {
        return this.table.get(key);
    },

    contains: function (key) {
        return this.table.contains(key);
    },

    count: function () {
        return this.table.size;
    },

    valueOf: function () {
        this.table.keys();
    },

    toString: function () {
        return '[Lookup]';
    }
});

Lookup[iteratorSymbol] = function () {
    return this.table[Symbol.iterator]();
};
