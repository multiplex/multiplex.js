var iterableSymbol = (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') ?
    Symbol('iterable') : '@@iterable';

export default iterableSymbol;
