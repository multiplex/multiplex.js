import mixin from '../utils/mixin';
import assertType from '../utils/assert-type';


/**
* Supports an iteration over an object using specified factory method.
* @param {Function} factory A function to yield the next item in the sequence.
*/
export default function Iterator(factory) {
    assertType(factory, Function);
    this.next = factory;
}

mixin(Iterator.prototype, {
    toString: function () {
        return '[Iterator]';
    }
});
