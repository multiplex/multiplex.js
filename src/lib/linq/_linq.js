import select from './select';

export default function linq(iterable) {
    Object.assign(iterable, {
    });

    Object.assign(iterable.prototype, {
        select(selector) {
            return select(this, selector);
        }
    });
}
