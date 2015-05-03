/// <reference path="..\src\javascript\multiplex.js" />

// class without equality-comparer
function Foo() {
};


// class overriding 'hash' and 'equals' methods.
function FooWithEqualityComparer(val) {
    this.value = val;
    this.name = val.toString();
};

FooWithEqualityComparer.prototype = {
    __hash__: function () {
        return mx.hash(this.value, this.name);
    },

    __equals__: function (o) {
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
        /// <field>Array of empty literal objects.</field>
        arr1: arr1,
        /// <field>Array of empty literal objects.</field>
        arr1_clone: arr1_clone,


        /// <field>Array of complex literal objects.</field>
        arr2: arr2,
        /// <field>Array of complex literal objects.</field>
        arr2_clone: arr2_clone,


        /// <field>Array of class instances without equality-comparer.</field>
        arr3: arr3,
        /// <field>Array of class instances without equality-comparer.</field>
        arr3_clone: arr3_clone,


        /// <field>Array of class instances overriding 'hash' and 'equals' methods.</field>
        arr4: arr4,
        /// <field>Array of class instances overriding 'hash' and 'equals' methods.</field>
        arr4_clone: arr4_clone,


        /// <field>Array of numbers.</field>
        arr5: arr5,
        /// <field>Array of numbers.</field>
        arr5_clone: arr5_clone,


        /// <field>Array of float numbers.</field>
        arr6: arr6,
        /// <field>Array of float numbers.</field>
        arr6_clone: arr6_clone,


        /// <field>Array of strings.</field>
        arr7: arr7,
        /// <field>Array of strings.</field>
        arr7_clone: arr7_clone,


        /// <field>Array of date objects.</field>
        arr8: arr8,
        /// <field>Array of date objects.</field>
        arr8_clone: arr8_clone,


        /// <field>Array of booleans.</field>
        arr9: arr9,
        /// <field>Array of booleans.</field>
        arr9_clone: arr9_clone,


        initialize: function (count) {
            var _time = new Date().getTime();

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

                arr8[i] = arr8_clone[i] = new Date(_time + i);                      // Array of date objects

                arr9[i] = arr9_clone[i] = i % 2 == 0;                               // Array of booleans
            }
        }
    };
})();