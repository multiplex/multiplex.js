import mixin from '../utils/mixin';
import select from './select';

export default function linq(iterable) {
    mixin(iterable, {
    });

    mixin(iterable.prototype, {
        select: function (selector) {
            return select(this, selector);
        }
    });
}
