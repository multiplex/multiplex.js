export default function isType(obj, type) {
    // use 'typeof' operator in an if clause yields in better performance than switch-case

    if (obj === null || obj === undefined) {
        return false;
    }

    if (typeof obj === 'number') {
        return type === Number;
    }

    else if (typeof obj === 'string') {
        return type === String;
    }

    else if (typeof obj === 'function') {
        return type === Function;
    }

    else if (typeof obj === 'boolean') {
        return type === Boolean;
    }

    else {
        return obj instanceof type;
    }
}

