export default function error(msg) {
    throw new Error(msg);
}

export function arraySizeError() {
    error('The number of elements in the source is greater than the number of elements that the destination array can contain.');
}

