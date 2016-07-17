import assign from '../utils/assign';
import select from './select';

export default function linq(iterable) {
    assign(iterable, {
    });

    assign(iterable.prototype, {
        select: function (selector) {
            return select(this, selector);
        }
    });
}
