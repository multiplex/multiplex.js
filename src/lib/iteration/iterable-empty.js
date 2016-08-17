import Iterable from './iterable';
import EmptyIterator from './iterator-empty';
import extend from '../utils/extend';

/**
* Creates a new EmptyIterable instance.
*/
export default function EmptyIterable() {
}

extend(EmptyIterable, Iterable, {
    toString: function () {
        return '[Empty Iterable]';
    },

    '@@iterator': function () {
        return new EmptyIterator();
    }
});
