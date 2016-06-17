/*!
* Multiplex.js - Comprehensive data-structure and LINQ library for JavaScript.
* Ver 2.0.0 (June 17, 2016)

* Created and maintained by Kamyar Nazeri <Kamyar.Nazeri@yahoo.com>
* Licensed under Apache License Version 2.0
* https://github.com/multiplex/multiplex.js
*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.mx = factory());
}(this, function () { 'use strict';

    function Multiplex(obj) {
        this._source = obj;
    }

    Multiplex.version = '2.0.0';

    return Multiplex;

}));
 