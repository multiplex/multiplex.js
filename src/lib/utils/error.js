export default function error(msg) {
    throw new Error(msg);
}

export var ERROR_ARGUMENT_OUT_OF_RANGE = 'Argument was out of the range of valid values.';
export var ERROR_ARRAY_SIZE = 'The number of elements in the source is greater than the number of elements that the destination array can contain.';
export var ERROR_NOT_IMPLEMENTED = 'Method not implemented.';
export var ERROR_NO_ELEMENTS = 'Sequence contains no elements.';
export var ERROR_NO_MATCH = 'Sequence contains no matching element.';
export var ERROR_NON_NUMERIC_TYPE = 'Value is not a number.';
export var ERROR_MORE_THAN_ONE_ELEMENT = 'Sequence contains more than one element.';
export var ERROR_KEY_NOT_FOUND = 'The given key was not present in the collection.';
export var ERROR_DUPLICATE_KEY = 'An item with the same key has already been added.';
export var ERROR_EMPTY_COLLECTION = 'Collection is empty.';
