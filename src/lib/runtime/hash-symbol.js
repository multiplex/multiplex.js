var hashSymbol = typeof Symbol === 'function' && typeof Symbol('hash') === 'symbol' ? Symbol('hash') : '__hash__';
export default hashSymbol;
