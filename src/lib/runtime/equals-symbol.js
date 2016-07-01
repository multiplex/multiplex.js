var equalsSymbol = (typeof Symbol === 'function' && typeof Symbol('equals') === 'symbol') ? Symbol('equals') : '__eq__';
export default equalsSymbol;
