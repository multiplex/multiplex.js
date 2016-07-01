var compareSymbol = (typeof Symbol === 'function' && typeof Symbol('compare') === 'symbol') ? Symbol('compare') : '__cmp__';
export default compareSymbol;

