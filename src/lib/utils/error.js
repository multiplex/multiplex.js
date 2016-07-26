export default function error(msg) {
    throw new Error(msg);
}

export const ERROR_ARGUMENT_OUT_OF_RANGE = 'Argument was out of the range of valid values.';
export const ERROR_ARRAY_SIZE = 'The number of elements in the source is greater than the number of elements that the destination array can contain.';
export const ERROR_NOT_IMPLEMENTED = 'Method not implemented.';
