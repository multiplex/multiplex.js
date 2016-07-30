import error from './error';

export default function assertNotNull(obj) {
    if (obj === null || obj === undefined) {
        error('Value cannot be null.');
    }
}
