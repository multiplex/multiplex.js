var modules = [
    './collections/collection.js',
    './core/create.js',
    './core/iterable.js',
    './core/iterator.js',
    './runtime/compare.js',
    './runtime/equals.js',
    './runtime/hash.js'
];

(function () {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        for (var i = 0; i < modules.length; i++) {
            require(modules[i]);
        }
    }
    else if (typeof define === 'function') {
        require(modules);
    }
})();
