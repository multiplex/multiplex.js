[![npm version][npm-version-image]][npm-url] 
[![build status][travis-image]][travis-url]
[![code climate][climate-image]][climate-url]
[![coverage status][coverage-image]][coverage-url] 
[![apache license][license-image]][license-url]


# Multiplex
#### Comprehensive data-structure and LINQ library for JavaScript.
----------------------------



## What is Multiplex
Multiplex is a set of data-structures and implementation of .Net LINQ methods in JavaScript which adds data querying capabilities to JavaScript objects. The main features are:

* Complete set of data-structures:
  - `List` - strongly typed list of objects that can be accessed by index.
  - `Dictionary` - collection of key/value pairs.
  - `Collection` - strongly typed collection.
  - `ReadOnlyCollection` - read-only wrapper collection.
  - `HashSet` - high-performance set of values that contains no duplicate elements.
  - `SortedList` - a collection of key/value pairs that are sorted by a key.
  - `LinkedList` - doubly linked list.
  - `Queue` - first-in, first-out (FIFO) collection of objects.
  - `Stack` - last-in-first-out (LIFO) collection of objects.
  - `Lookup` - collection of keys each mapped to one or more values.
  - `Map` - collection of key/value pairs.
  - `Set` - collection of unique values of any type.
* Over 40 LINQ methods (90 method overloads).
* LINQ lazy evaluation.
* TypeScript support.
* Support for [Lambda notation](#the-lambda-notation), [Object literal](#using-object-literals) and ES6 [Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).
* LINQ support over built-in [Array](#--array-and-string) and [String](#--array-and-string) classes and [jQuery](#--array-like-objects-arguments-nodelist-jquery) objects.
* Built-in `hash` and `equals` functions to identify objects in a hash-based collection.
* *JSDoc* documentation.



## Get started
* [How to install](#how-to-install)
* [Basic syntax](#basic-syntax)
* [The lambda notation](#the-lambda-notation)
* [Executing a query](#executing-a-query)
* [LINQ expression trees](#linq-expression-trees)
* [Using object literals](#using-object-literals)
* [Working with Iterable](#working-with-iterable)
  - [Multiplex Collections](#--multiplex-collections)
  - [Array and String](#--array-and-string)
  - [Array-like objects (arguments, NodeList, jQuery)](#--array-like-objects-arguments-nodelist-jquery)
  - [Enumerator interface](#--enumerator-interface)
  - [Regular JavaScript objects](#--regular-javascript-objects)
  - [ECMAScript 6 iteration protocols](#--ecmascript-6-iteration-protocols)
* [Iteration protocols](#iteration-protocols)
  - [ES6 Iteration protocols](#es6-iteration-protocols)
  - [Generator functions](#generator-functions)
  - [Legacy generator functions](#legacy-generator-functions)
  - [Using legacy generator functions as Enumerable](#using-legacy-generator-functions-as-enumerable)




### How to install
Several quick install options are available:
- Clone the repo: `git clone https://github.com/multiplex/multiplex.js.git`.
- Install with [npm](https://www.npmjs.com/package/multiplexjs): `npm install multiplexjs`.
- Install with [Bower](http://bower.io): `bower install multiplex`.
- Install with [Jam](http://jamjs.org/): `jam install multiplexjs`.



### Basic syntax 
----------------------------
The Multiplex LINQ syntax is standard, easily-learned patterns for querying and updating data:

`mx(source).operator()`
* A `mx` function to define an *Enumerable* object.
* A `(source)` to "query" data.
* A LINQ `operator()` to be performed on the data.

Example:

````javascript
var query = mx([1, 2, 3, 4, 5]).select(function (t) { return t * t });
````

Creates an *Enumerable* object which upon execution returns a square root of sequence of numbers.



### The lambda notation
----------------------------
Lambda comes from the *Lambda Calculus* and refers to anonymous functions in programming. A lambda expression is an anonymous function that can be used to create functions without the identifier. Lambda expressions are particularly helpful for writing LINQ query expressions and are supported in Multiplex:

Previous example using Lambda notation:
````javascript
var query = mx([1, 2, 3, 4, 5]).select(t => t * t);
````



### Executing a query
----------------------------
At what point query expressions are executed can vary. LINQ queries are always executed when the query variable is iterated over, not when the query variable is created. This is called *deferred execution*. You can also force a query to execute immediately, which is useful for caching query results.

In a query that returns a sequence of values, the query variable itself never holds the query results and only stores the query commands. This is known as *deferred execution*; that is, query execution occurs some time after the query is constructed. Execution of the query is deferred until the query variable is iterated over in a `forEach` loop or when you use singleton queries like `count`, `min`, `max`, `sum`, `aggregate`. These methods execute immediately because the query must produce a sequence to calculate the singleton result. To force immediate execution of a query that does not produce a singleton value, you can call the `toList` method, the `toDictionary` method, or the `toArray` method on a query or query variable.

The following example uses the `toArray` method to immediately evaluate a sequence into an array:

````javascript
mx([1, 2, 3, 4, 5]).select(t => t * t).toArray();   // [1, 4, 9, 16, 25]
````

The following example uses the `sum` method to evaluate sum of the first 10 numbers:

````javascript
mx([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).sum();            // 55
````

And the following example uses the `forEach` method to iterate over an array of numbers and print them in the developer console:

````javascript
mx([1, 2, 3, 4, 5]).forEach(t => console.log(t));
// 1
// 2
// 3
// 4
// 5
````



### LINQ expression trees
----------------------------
Since LINQ queries execution is deferred, you can chain different LINQ operations together to produce more complex expressions. You compose queries in method syntax by chaining the method calls together. And because a query variable does not store the results of the query, you can modify it or use it as the basis for a new query at any time, even after it has been executed.

````javascript
mx.range(0, 1000)
    .where(t => t % 2 == 0)
    .orderByDescending(t => t)
    .take(10)
    .toArray();
````

In the example above, `mx.range` method is used to create 1000 integer numbers starting from 0, then filter even numbers, sort the result in descending order and only take 10 of them. The result is the last 10 even numbers less than 1000:

`[998, 996, 994, 992, 990, 988, 986, 984, 982, 980]`

Note that the query is executed only 10 times, as soon as the query reaches the 10th element, the execution breaks and the result is evaluated into an array. [read more about LINQ iteration over a query.](https://msdn.microsoft.com/en-us/library/system.collections.ienumerator.aspx)



### Using object literals
----------------------------
An object literal is a list of zero or more pairs of property names and associated values of an object, enclosed in curly braces `{}`. Anonymous types typically are used in the select clause of a query expression to return a subset of the properties from each object in the source sequence:

````javascript
mx([1, 2, 3]).select(t => ({ val: t })).toArray();   // [{ val: 1 }, { val: 2 }, { val: 3 }]
````

In Multiplex, equality comparison on anonymous types are defined in terms of the equality of the properties, two instances of the same anonymous type are equal only if all their properties are equal. That becomes very handy working with LINQ operations which make use of equality to produce results, eg. `contains`, `join`, `groupBy`, `groupJoin`, `distinct`, `except` and `intersect`.

Note that in JavaScript two distinct objects are never equal for either strict or abstract comparisons:

````javascript
{ val: 1 } == { val: 1 }                  // false
{ val: 1 } === { val: 1 }                 // false
````

However using `mx.equals` method you can compare two object literals which results in true if all their properties are equal:

````javascript
mx.equals({ val: 1 }, { val: 1 });      // true
````

Since Multiplex LINQ operations internally make use of the `mx.equals` method, you can write expressions like these using object literals:

```javascript
mx([{ val: 1 }, { val: 1 }]).contains({ val: 1 });              // true
mx([{ val: 1 }, { val: 1 }]).distinct().count();                // 1
mx([{ val: 1 }, { val: 1 }]).except([{ val: 1 }]).count();      // 0
```

The following example uses object literals as the *key* for the `groupBy` operator:

````javascript
var arr = 
[
  { id: 1, val: 10, name: 'A' }, 
  { id: 1, val: 10, name: 'B' }, 
  { id: 2, val: 20, name: 'C' }, 
  { id: 2, val: 20, name: 'D' }
];

var grp = mx(arr)
  .groupBy(t => ({ id: t.id, val: t.val }))   // group `key`
  .select(t => t.key)
  .toArray();
  
// [{ id: 1, val: 10 }, { id: 2, val: 20 }]
  
````



### Working with Iterable
----------------------------
*Iterable* is the base class for all objects that can be iterated. It contains a `Symbol.iterator` method, which returns an *Iterator* object. *Iterator* provides the ability to iterate through the collection by exposing a `next()` method. *Iterator* is an implementation of [Iterator Design Pattern](http://en.wikipedia.org/wiki/Iterator).

The methods in *Iterable* class provide an implementation of the standard query operators for querying data sources which are *Iterable*, that is, either are sub-class of the *Iterable* class or implement `Symbol.iterator` method. The standard query operators are general purpose methods that follow the LINQ pattern and enable you to express traversal, filter, and projection operations over data in JavaScript.

The followings are types which can be used to create an *Iterable* in Multiplex:



#### - Multiplex Collections
All the collections defined in Multiplex are *Iterable*, and can be used in LINQ queries:
````javascript
var list = new mx.List([1, 2, 3, 4]);       // a list of numbers
var set = new mx.HashSet([1, 2, 3, 4]);     // a set of numbers
var dic = list.toDictionary("t => t");      // a dictionary with numeric keys

list.select(t => t * 2).toArray();            // [2, 4, 6, 8]
set.select(t => t * 2).toArray();             // [2, 4, 6, 8]
dic.select(t => t.key * 2).toArray();         // [2, 4, 6, 8]
````



#### - Array and String
*Array*s and *Strings* are *Iterable* per ser, because they have a default iteration behavior. This means you can pass *String* or *Array* objects to any method accepting *Iterable* argument without wrapping it in an *Iterable* object.
This comes handy in LINQ operations, so instead of this:

````javascript
mx([1, 2]).union(mx([3, 4])).toArray();     // [1, 4, 9, 16]
mx("str").union(mx("ing")).toArray();       // ["s", "t", "r", "i", "n", "g"]
````

You can write:

````javascript
mx([1, 2]).union([3, 4]).toArray();         // [1, 2, 3, 4]
mx("str").union("ing").toArray();           // ["s", "t", "r", "i", "n", "g"]
````

Note that, in the example above the string object is queried as a sequence of characters.
In practice, LINQ operations accept any argument implementing [ES6 iteration protocols](#es6-iteration-protocols).



#### - Array-like objects: `arguments`, `NodeList`, `jQuery`
Array-like objects which expose the `length` property can be used as `Iterable`, examples are `jQuery` objects, collections returned by `document.querySelectorAll` method and the `arguments` object corresponding to the arguments passed to a function.

The following example uses `jQuery` and Multiplex to get the count of each element in a page:
````javascript
mx($("*"))
  .groupBy(t => t.nodeName)
  .select(t => ({ name: t.key, count: t.count() }))
  .toArray();
````

The same result using `document.querySelectorAll`:
````javascript
mx(document.querySelectorAll("*"))
  .groupBy(t => t.nodeName)
  .select(t => ({ name: t.key, count: t.count() }))
  .toArray();
````

The following example uses Multiplex to iterate `arguments` variable available within the `Test` function:
````javascript
function Test()
{
  mx(arguments).forEach(t => console.log(t));
}

Test(1, 2, 3);    // 1, 2, 3
Test("a", "b");   // "a", "b"
````



#### - Enumerator interface
For advanced usage of *Enumerable*, any object containing a `getEnumerator()` method, which returns an *Enumerator* can be used as *Enumerable* source. Enumerators can be used to read the data in the collection by exposing the `current` property and `next()` method. *Enumerator* is an implementation of [Iterator Design Pattern](http://en.wikipedia.org/wiki/Iterator).

Initially, the enumerator is positioned before the first element in the collection. At this position, the `current` property is undefined. Therefore, you must call the `next()` method to advance the enumerator to the first element of the collection before reading the value of `current`.

`current` returns the same object until `next()` is called. `next()` sets `current` to the next element. If `next()` passes the end of the collection, the enumerator is positioned after the last element in the collection and `next()` returns false. When the enumerator is at this position, subsequent calls to `next()` also return false. If the last call to `next()` returns false, `current` is undefined.

The following code example demonstrates the implementation of the `getEnumerator()` method for a custom object. In this example, `getEnumerator()` is not explicitly called, but it is implemented to yield 3 integer numbers in a LINQ operation.
````javascript
var obj = {
    getEnumerator: function () {
        var count = 3, index = 0;
        return {
            current: undefined,
            next: function () {
                if (index++ < count) {
                    this.current = index;
                    return true;
                }
                else {
                    this.current = undefined;
                    return false;
                }
            }
        }
    }
};

mx(obj).toArray();    // [1, 2, 3]
````

Read more about [getEnumerator()](https://msdn.microsoft.com/en-us/library/system.collections.ienumerable.getenumerator.aspx) method.



#### - Regular JavaScript objects
Any regular JavaScript object can be used as an *Iterable* source, if an object does not implement `getEnumerator()` method, Multiplex uses object's enumerable properties, in the same order as that provided by a `for...in` loop, projecting `KeyValuePair` objects with `key` being the name of the property and `value` as value of the property:

````javascript
var obj = { name: "myObj", val: 1 };
mx(obj).toArray();      // [{ key: "name", value: "myObj" }, { key: "val", value: 1 }]
````



#### - ECMAScript 6 iteration protocols
[Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) is an addition of ECMAScript 6. Objects implementing this protocol can be used as an *Iterable* source in Multiplex and are discussed in the next section.



### Iteration protocols
----------------------------

#### ES6 Iteration protocols
ECMAScript 6 comes with two iteration protocols: The iterable protocol and the iterator protocol:

* The iterable protocol allows JavaScript objects to define or customize their iteration behavior. In order to be iterable, an object must implement the `@@iterator` method, meaning that the object (or one of the objects up its prototype chain) must have a property with a `Symbol.iterator` key. It is pretty much like the `getEnumerator()` method in the *Iterable* class.
* The iterator protocol defines a standard way to produce a sequence of values. An object is an iterator when it implements a `next()` method. It is pretty much like the *Iterable* class.

*Whenever an object needs to be iterated (such as at the beginning of a `for..of` loop), its `@@iterator` method is called with no arguments, and the returned iterator is used to obtain the values to be iterated.*

Both iterable and iterator protocols are supported in Multiplex:
* Every *Iterable* object implements *iterable protocol*
* Every JavaScript object implementing *iterator protocol* can be used as a source to *Iterable*


The following example demonstrates the use of *iterable protocol* and `for-of` loop in an *Iterable* object:

````javascript
var source = mx.range(0, 4);              // An Iterable of numbers
var iterable = source[Symbol.iterator];   // Retrieve @@iterator method

for(var value of source){
    console.log(value);
}
// 0
// 1
// 2
// 3

````

The following example demonstrates the use of `iterator protocol` in a `Set` to create an `Iterable`:

*(`String`, `Array`, `TypedArray`, `Map` and `Set` are all built-in JavaScript iterables, because the prototype objects of them all have an `@@iterator` method.)*

````javascript
var set = new Set([1, 2, 3]);     // Create a Set of numbers
mx(set).toArray();                // [1, 2, 3]
````

#### Generator functions
Generators are functions which can be exited and later re-entered. Their context (variable bindings) will be saved across re-entrances. Generators are part of ES6 iteration protocols.

The `function*` declaration defines a generator function, which returns a *Generator* object. A generator object is both, *iterator* and *iterable* and is a simple, efficient way to create an *Iterable*:

The following example demonstrates the use of *generator function* in to create an *Iterable*:

````javascript
var gen = function* () {
  yield 1;
  yield 2;
  yield 3;
}

mx(gen).toArray();    // [1, 2, 3]
````

*In practice, using generator function, is the best way to create a custom Iterable.*

#### Legacy generator functions
Generator functions are great to create an *Iterable*, however, browser support is at this point very limited (Chrome 39+, FireFox 36+)

To simulate generators functions, Multiplex supports an alternative legacy syntax which makes use of `closure` to create a stateful generator function. You have to use Multiplex's *Enumerator* class to initiate a generator function. 
When the *Enumerator*'s `next()` method is called, the generator function's body is executed and a `yielder` parameter is passed to the generator function. The `yielder` parameter is itself a **function** which upon execution yields  the value to be returned from the *Enumerator*:

The following example creates an infinite *Enumerator*, each time the `next()` method is called, it increments and yields a number:

````javascript
var index = 0;
var gen = new mx.Enumerator(function(yielder){
  yielder(index++);
});

gen.next();   // true
gen.current;  // 0
gen.next();   // true
gen.current;  // 1
````

#### Using legacy generator functions as Enumerable
To use a legacy generator function with Multiplex, you need to wrap the process of creating an *Enumerator* in a **factory function**. The following example demonstrates creating an *Enumerable* of numbers using legacy generator function:

````javascript
var source = mx(function(){
  var count = 3, index = 0;
  return new mx.Enumerator(function(yielder){
    if(index++ < count)
      yielder(index);
  });
});

source.toArray();     // [1, 2, 3]
````



## How to build Multiplex
In order to build Multiplex, you need to have the latest Node.js/npm and git 1.7 or later.
For Windows, you have to download and install [git](http://git-scm.com/downloads) and [Node.js](http://nodejs.org/download/).

Clone a copy of the main Multiplex git repo by running:

```bash
git clone git://github.com/multiplex/multiplex.js.git
```

To create custom build install [grunt command line interface](https://github.com/gruntjs/grunt-cli) as a global package (If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide):

```
npm install -g grunt-cli
```

Then, make sure all Node dependencies are installed by runnung the following command in the `Multiplex` directory:

````
npm install
````

Now by running the `grunt` command, in the `Multiplex` directory, you can build Multiplex:
```
grunt
```

This will first build Multiplex source code and all unit tests in the `build/` subdirectory, and then executes tests using grunt; you can also run tests from within your browser by running `build\test\testrunner.html` file.

To build a full version of Multiplex use:
````
grunt release
````
When the tests pass, the built version of Multiplex will be put in the `dist/` subdirectory, along with the minified copy and associated map file.


[npm-url]: https://npmjs.org/package/multiplexjs
[npm-version-image]: https://badge.fury.io/js/multiplexjs.svg

[license-url]: LICENSE
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg

[travis-url]: https://travis-ci.org/multiplex/multiplex.js
[travis-image]: https://travis-ci.org/multiplex/multiplex.js.svg

[climate-url]: https://codeclimate.com/github/multiplex/multiplex.js
[climate-image]: https://codeclimate.com/github/multiplex/multiplex.js/badges/gpa.svg

[coverage-url]: https://coveralls.io/github/multiplex/multiplex.js
[coverage-image]: https://coveralls.io/repos/github/multiplex/multiplex.js/badge.svg
