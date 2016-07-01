import error from './error';

export default function assertNotNull(obj) {
    if (obj == null) {
        error('Value cannot be null.');
    }
}
