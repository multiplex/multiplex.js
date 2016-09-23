import Iterable from '../iteration/iterable';
import Iterator from '../iteration/iterator';
import Comparer from './comparer';
import iterableSymbol from '../iteration/iterable-symbol';
import buffer from '../utils/buffer';
import assertType from '../utils/assert-type';
import assertNotNull from '../utils/assert-not-null';

export default class OrderedIterable extends Iterable {
    constructor(source, keySelector, comparer = Comparer.instance, descending = false, parent = undefined) {
        assertNotNull(source);
        assertType(keySelector, Function);
        comparer = Comparer.from(comparer);

        let sorter = new OrderedIterableSorter(keySelector, comparer, descending);

        if (parent) {
            sorter = parent.sorter.create(sorter);
        }

        super(source);
        this.sorter = sorter;
    }

    /**
    * Performs a subsequent ordering of the elements in a sequence in ascending order by using a comparer.
    * @param {Function} keySelector A function to extract a key from each element. eg. function(item)
    * @param {Comparer=} comparer A Comparer to compare keys.
    * @returns {OrderedIterable}
    */
    thenBy(keySelector, comparer) {
        return new OrderedIterable(this[iterableSymbol], keySelector, comparer, false, this);
    }

    /**
    * Performs a subsequent ordering of the elements in a sequence in descending order by using a comparer.
    * @param {Function} keySelector A function to extract a key from each element. eg. function(item)
    * @param {Comparer=} comparer A Comparer to compare keys.
    * @returns {OrderedIterable}
    */
    thenByDescending(keySelector, comparer) {
        return new OrderedIterable(this[iterableSymbol], keySelector, comparer, true, this);
    }

    [Symbol.iterator]() {
        let index = 0,
            arr = buffer(this[iterableSymbol]),
            len = arr.length,
            map = this.sorter.sort(arr);

        return new Iterator(() => {
            if (index < len) {
                return {
                    value: arr[map[index++]],
                    done: false
                };
            }
            return {
                done: true
            };
        });
    }

    get [Symbol.toStringTag]() {
        return 'Ordered Iterable';
    }

    toString() {
        return '[Ordered Iterable]';
    }
}


class OrderedIterableSorter {
    constructor(keySelector, comparer, descending, next) {
        this.keySelector = keySelector;
        this.comparer = comparer;
        this.descending = descending;
        this.next = next;
    }

    create(next) {
        return new OrderedIterableSorter(
            this.keySelector,
            this.comparer,
            this.descending,
            this.next ? this.next.create(next) : next
        );
    }

    computeKeys(elements) {
        let count = elements.length,
            keys = new Array(count),
            selector = this.keySelector;

        for (let i = 0; i < count; i++) {
            keys[i] = selector(elements[i]);
        }

        if (this.next !== undefined) {
            this.next.computeKeys(elements, count);
        }

        this.keys = keys;
    }

    compareKeys(index1, index2) {
        let c = this.comparer.compare(this.keys[index1], this.keys[index2]);

        if (c === 0) {
            if (this.next === undefined) {
                return index1 - index2;
            }
            return this.next.compareKeys(index1, index2);
        }

        return this.descending ? -c : c;
    }

    sort(elements) {
        let count = elements.length,
            map = new Array(count);

        this.computeKeys(elements);

        for (let i = 0; i < count; i++) {
            map[i] = i;
        }

        this.quickSort(map, 0, count - 1);

        return map;
    }

    quickSort(map, left, right) {
        do {
            let i = left,
                j = right,
                x = map[i + ((j - i) >> 1)];

            do {
                while (i < map.length && this.compareKeys(x, map[i]) > 0) {
                    i++;
                }

                while (j >= 0 && this.compareKeys(x, map[j]) < 0) {
                    j--;
                }

                if (i > j) {
                    break;
                }

                if (i < j) {
                    [map[i], map[j]] = [map[j], map[i]];
                }
                i++;
                j--;
            } while (i <= j);

            if (j - left <= right - i) {
                if (left < j) {
                    this.quickSort(map, left, j);
                }

                left = i;
            }
            else {
                if (i < right) {
                    this.quickSort(map, i, right);
                }

                right = j;
            }
        } while (left < right);
    }
}
