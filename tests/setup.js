/// <reference path="..\src\javascript\multiplex.js" />

// class without equality-comparer
function Foo() {
};


// class with equality-comparer
function FooWithEqualityComparer(val) {
    this.value = val;
    this.name = val.toString();
};

FooWithEqualityComparer.prototype = {
    __hash: function () {
        return mx.hash(this.value, this.name);
    },

    __equals: function (o) {
        return o && o.value === this.value && o.name === this.name;
    }
};

var TestContext = (function () {

    var arr1 = [],
        arr1_clone = [],

        arr2 = [],
        arr2_clone = [],

        arr3 = [],
        arr3_clone = [],

        arr4 = [],
        arr4_clone = [],

        arr5 = [],
        arr5_clone = [],

        arr6 = [],
        arr6_clone = [],

        arr7 = [],
        arr7_clone = [],

        arr8 = [],
        arr8_clone = [],

        arr9 = [],
        arr9_clone = [],

        arr10 = [],
        arr10_clone = [];

    return {
        /// Array of empty literal objects
        arr1: arr1,
        arr1_clone: arr1_clone,

        /// Array of complex literal objects
        arr2: arr2,
        arr2_clone: arr2_clone,

        /// Array of class instances without equality-comparer
        arr3: arr3,
        arr3_clone: arr3_clone,

        /// Array of class instances with equality-comparer
        arr4: arr4,
        arr4_clone: arr4_clone,

        /// Array of numbers
        arr5: arr5,
        arr5_clone: arr5_clone,

        /// Array of float numbers
        arr6: arr6,
        arr6_clone: arr6_clone,

        /// Array of strings
        arr7: arr7,
        arr7_clone: arr7_clone,

        /// Array of date objects
        arr8: arr8,
        arr8_clone: arr8_clone,

        /// Array of booleans
        arr9: arr9,
        arr9_clone: arr9_clone,

        initialize: function (count) {
            for (var i = 0; i < count; i++) {
                arr1[i] = {};                                                       // Array of empty literal objects
                arr1_clone[i] = {};

                arr2[i] = { name: "n" + i, inner: { index: i, val: {} } };          // Array of complex literal objects
                arr2_clone[i] = { name: "n" + i, inner: { index: i, val: {} } };

                arr3[i] = new Foo();                                                // Array of class instances without equality-comparer
                arr3_clone[i] = new Foo();

                arr4[i] = new FooWithEqualityComparer(i);                           // Array of class instances with equality-comparer
                arr4_clone[i] = new FooWithEqualityComparer(i);

                arr5[i] = arr5_clone[i] = i;                                        // Array of numbers

                arr6[i] = arr6_clone[i] = i + .1;                                   // Array of float numbers

                arr7[i] = arr7_clone[i] = i + "_string";                            // Array of strings

                arr8[i] = arr8_clone[i] = new Date();                               // Array of date objects

                arr9[i] = arr9_clone[i] = i % 2 == 0;                               // Array of booleans
            }
        }
    };
})();