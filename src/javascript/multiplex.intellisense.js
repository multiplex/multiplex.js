/// <reference path="multiplex.js" />


/* mx
---------------------------------------------------------------------- */
intellisense.annotate(mx, {
    /// <field>Provides a set of static methods that provide support for internal operations.</field>
    "runtime": {},
    /// <field>Represents Enumerable extension methods.</field>
    "extensions": {},
    "hash": function () {
        /// <signature>
        ///     <summary>
        ///         Gets and combines hash code for the given parameters, calls the overridden "hash" method when available.
        ///         <br />
        ///         Returns a hash code identified by the given parameters.
        ///     </summary>
        ///     <param name="obj" type="...Object">Optional number of objects to combine the hash code for.</param>
        ///     <returns type="Number" />
        /// </signature>
    },
    "equals": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether the specified object instances are considered equal. calls the overridden "equals" method when available.
        ///         <br />
        ///         Returns true if the objA parameter is the same instance as the objB parameter, or if both are null, or if objA.equals(objB) returns true; otherwise, false.
        ///     </summary>
        ///     <param name="objA" type="Object">The first object to compare.</param>
        ///     <param name="objB" type="Object">The second object to compare.</param>
        ///     <returns type="Boolean" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Determines whether the specified object instances are considered equal. calls the overridden "equals" method when available.
        ///         <br />
        ///         Returns true if the objA parameter is the same instance as the objB parameter, or if both are null, or if objA.equals(objB) returns true; otherwise, false.
        ///     </summary>
        ///     <param name="objA" type="Object">The first object to compare.</param>
        ///     <param name="objB" type="Object">The second object to compare.</param>
        ///     <param name="comparer" type="EqualityComparer">An equality comparer to compare values.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "compare": function () {
        /// <signature>
        ///     <summary>
        ///         Performs a comparison of two objects of the same type and returns a value indicating whether one object is less than, equal to, or greater than the other.
        ///         <br />
        ///         Returns an integer that indicates the relative values of objA and objB, as shown in the following table:
        ///         <br />
        ///         Less than zero objA is less than objB.
        ///         <br />
        ///         Zero objA equals objB.
        ///         <br />
        ///         Greater than zero objA is greater than objB.
        ///     </summary>
        ///     <param name="objA" type="Object">The first object to compare.</param>
        ///     <param name="objB" type="Object">The second object to compare.</param>
        ///     <returns type="Number" />
        /// </signature>
    },
    "empty": function () {
        /// <signature>
        ///     <summary>
        ///         Returns an empty Enumerable.
        ///     </summary>
        ///     <returns type="Enumerable" />
        /// </signature>
    },
    "range": function () {
        /// <signature>
        ///     <summary>
        ///         Generates a sequence of integral numbers within a specified range.
        ///     </summary>
        ///     <param name="start" type="Number">The value of the first integer in the sequence.</param>
        ///     <param name="count" type="Number">The number of sequential integers to generate.</param>
        ///     <returns type="Enumerable" />
        /// </signature>
    },
    "repeat": function () {
        /// <signature>
        ///     <summary>
        ///         Generates a sequence that contains one repeated value.
        ///     </summary>
        ///     <param name="element" type="Object">The value to be repeated.</param>
        ///     <param name="count" type="Number">The number of sequential integers to generate.</param>
        ///     <returns type="Enumerable" />
        /// </signature>
    },
    "is": function () {
        /// <signature>
        ///     <summary>
        ///         Detects if an object is Enumerable.
        ///     </summary>
        ///     <param name="obj" type="Object">An object to check its Enumerability.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "extend": function () {
        /// <signature>
        ///     <summary>
        ///         Extends Enumerable extension methods to the given type.
        ///     </summary>
        ///     <param name="type" type="Function">The type to extend.</param>
        /// </signature>
    },
    "Enumerator": function () {
        /// <signature>
        ///     <summary>
        ///         Supports an iteration over a collection.
        ///     </summary>
        ///     <param name="factory" type="Function">A function to yield the next item in the sequence</param>
        /// </signature>
    },
    "Enumerable": function () {
        /// <signature>
        ///     <summary>
        ///         Exposes the enumerator, which supports an iteration over the specified Enumerable object.
        ///     </summary>
        ///     <param name="obj" type="Enumerable">An Enumerable object.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Exposes the iterator, which supports an iteration over the specified Iterable object.
        ///         <br />
        ///         An Iterable object, is an object that implements the @@iterator method. eg. Map, Set and Iterable objects.
        ///     </summary>
        ///     <param name="obj" type="Iterable">An Iterable object that implements the @@iterator method.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Defines an enumerator, which supports an iteration over the items of the specified Array object.
        ///     </summary>
        ///     <param name="arr" type="Array">An array object.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Defines an enumerator, which supports an iteration over the characters of the specified String object.
        ///     </summary>
        ///     <param name="str" type="String">A string object.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Defines an enumerator, which supports an iteration over the specified Generator function.
        ///     </summary>
        ///     <param name="func" type="Function">A Generator function.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Defines an enumerator, which supports an iteration over the specified Generator function.
        ///     </summary>
        ///     <param name="func" type="Function*">An ES6 Generator function.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Defines an enumerator, which supports an iteration over the items of the specified Array-like object.
        ///         <br />
        ///         An Array-like object is an object which has the "length" property, eg. arguments, jQuery
        ///     </summary>
        ///     <param name="obj" type="{length:Number}">An Array-like object.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Defines an enumerator, which supports an iteration over the properties of the specified object.
        ///     </summary>
        ///     <param name="obj" type="Object">A regular Object.</param>
        /// </signature>
    },
    "Collection": function () {
        /// <signature>
        ///     <summary>
        ///         Provides an abstract base class for a strongly typed collection.
        ///     </summary>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Provides an abstract base class for a strongly typed collection.
        ///     </summary>
        ///     <param name="value" type="Enumerable">Enumerable whose elements are copied to the new collection.</param>
        /// </signature>
    },
    "ReadOnlyCollection": function () {
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the ReadOnlyCollection class that is a read-only wrapper around the specified list.
        ///     </summary>
        ///     <param name="list" type="Collection">The list to wrap.</param>
        /// </signature>
    },
    "List": function () {
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the List class that is empty.
        ///     </summary>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the List class that is empty and has the specified initial capacity.
        ///     </summary>
        ///     <param name="capacity" type="Number">The number of elements that the new list can initially store.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the List class that contains elements copied from the specified arguments
        ///     </summary>
        ///     <param name="args" type="...Object">Arbitrary number of arguments to copy to the new list.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the List class that contains elements copied from the specified collection 
        ///         and has sufficient capacity to accommodate the number of elements copied.
        ///     </summary>
        ///     <param name="collection" type="Enumerable">The collection whose elements are copied to the new list.</param>
        /// </signature>
    },
    "SortedList": function () {
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the SortedList class that is empty, 
        ///         has the default initial capacity, and uses the default Comparer.
        ///     </summary>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the SortedList class that contains elements  copied from the specified Dictionary, 
        ///         has sufficient capacity to accommodate the number of elements copied,  and uses the default Comparer.
        ///     </summary>
        ///     <param name="dictionary" type="Dictionary">The Dictionary whose elements are copied to the new SortedList.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the SortedList class that is empty, 
        ///         has the default initial capacity, and uses the specified Comparer.
        ///     </summary>
        ///     <param name="comparer" type="Comparer">The Comparer implementation to use when comparing keys.-or-null to use the default Comparer for the type of the key.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the SortedList class that is empty, 
        ///         has the specified initial capacity, and uses the default Comparer.
        ///     </summary>
        ///     <param name="capacity" type="Number">The initial number of elements that the SortedList can contain.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the SortedList class that contains elements copied from the specified Dictionary,
        ///         has sufficient capacity to accommodate the number of elements copied, and uses the specified Comparer.
        ///     </summary>
        ///     <param name="dictionary" type="Dictionary">The Dictionary whose elements are copied to the new SortedList.</param>
        ///     <param name="comparer" type="Comparer">The Comparer implementation to use when comparing keys.-or-null to use the default Comparer for the type of the key.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the SortedList class that is empty, 
        ///         has the specified initial capacity, and uses the specified Comparer.
        ///     </summary>
        ///     <param name="capacity" type="Number">The initial number of elements that the SortedList can contain.</param>
        ///     <param name="comparer" type="Comparer">The Comparer implementation to use when comparing keys.-or-null to use the default Comparer for the type of the key.</param>
        /// </signature>
    },
    "Dictionary": function () {
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the Dictionary class that is empty, 
        ///     </summary>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the Dictionary class that contains elements copied 
        ///         from the specified Dictionary and uses the default equality comparer for the key type.
        ///     </summary>
        ///     <param name="dictionary" type="Dictionary">The Dictionary whose elements are copied to the new Dictionary.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the Dictionary class that is empty, and uses the specified EqualityComparer.
        ///     </summary>
        ///     <param name="comparer" type="EqualityComparer">The EqualityComparer implementation to use when comparing keys.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///          Initializes a new instance of the Dictionary class that is empty, has the specified initial capacity, and uses the default equality comparer for the key type.
        ///     </summary>
        ///     <param name="capacity" type="Number">The initial number of elements that the Dictionary can contain.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the Dictionary that is empty, has the specified initial capacity, and uses the specified EqualityComparer.
        ///     </summary>
        ///     <param name="capacity" type="Number">The initial number of elements that the Dictionary can contain.</param>
        ///     <param name="comparer" type="EqualityComparer">The EqualityComparer implementation to use when comparing keys.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the Dictionary class that contains elements copied 
        ///         from the specified Dictionary and uses the specified EqualityComparer.
        ///     </summary>
        ///     <param name="dictionary" type="Dictionary">The Dictionary whose elements are copied to the new Dictionary.</param>
        ///     <param name="comparer" type="EqualityComparer">The EqualityComparer implementation to use when comparing keys.</param>
        /// </signature>
    },
    "KeyValuePair": function () {
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the KeyValuePair with the specified key and value.
        ///     </summary>
        ///     <param name="key" type="Object">The object defined in each key/value pair.</param>
        ///     <param name="value" type="Object">The definition associated with key.</param>
        /// </signature>
    },
    "HashSet": function () {
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the HashSet class that is empty and uses the default equality comparer for the set type.
        ///     </summary>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the HashSet class that uses the default equality comparer for the set type, 
        ///         and contains elements copied from the specified collection.
        ///     </summary>
        ///     <param name="collection" type="Enumerable">The collection whose elements are copied to the new set.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the HashSet class that is empty and uses the specified equality comparer for the set type.
        ///     </summary>
        ///     <param name="comparer" type="EqualityComparer">The EqualityComparer implementation to use when comparing values in the set.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the HashSet class that uses the specified equality comparer for the set type, 
        ///         contains elements copied from the specified collection, and uses the specified equality comparer for the set type.
        ///     </summary>
        ///     <param name="collection" type="Enumerable">The collection whose elements are copied to the new set.</param>
        ///     <param name="comparer" type="EqualityComparer">The EqualityComparer implementation to use when comparing values in the set.</param>
        /// </signature>
    },
    "LinkedList": function () {
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the LinkedList class that is empty.
        ///     </summary>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the LinkedList class that contains elements copied from the specified Enumerable.
        ///     </summary>
        ///     <param name="collection" type="Enumerable">The collection to copy elements from.</param>
        /// </signature>
    },
    "LinkedListNode": function () {
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the LinkedListNode class, containing the specified value.
        ///     </summary>
        ///     <param name="value" type="Object">The value to contain in the LinkedListNode</param>
        /// </signature>
    },
    "Queue": function () {
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the Queue class that is empty.
        ///     </summary>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the Queue class that contains elements copied from the specified collection.
        ///     </summary>
        ///     <param name="collection" type="Enumerable">The collection to copy elements from.</param>
        /// </signature>
    },
    "Stack": function () {
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the Stack class that is empty.
        ///     </summary>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Initializes a new instance of the Stack class that contains elements copied from the specified collection.
        ///     </summary>
        ///     <param name="collection" type="Enumerable">The collection to copy elements from.</param>
        /// </signature>
    },
    "Lookup": function () {
        /// <signature>
        ///     <summary>
        ///         Defines an indexer, size property, and Boolean search method for data structures that map keys to Enumerable sequences of values.
        ///     </summary>
        /// </signature>
    },
    "Grouping": function () {
        /// <signature>
        ///     <summary>
        ///         Represents a collection of objects that have a common key.
        ///     </summary>
        /// </signature>
    },
    "OrderedEnumerable": function () {
        /// <signature>
        ///     <summary>
        ///         Represents a sorted sequence.
        ///     </summary>
        /// </signature>
    },
    "Comparer": function () {
        /// <signature>
        ///     <summary>
        ///         Provides a base class for implementations of Comparer.
        ///     </summary>
        /// </signature>
    },
    "EqualityComparer": function () {
        /// <signature>
        ///     <summary>
        ///         Provides a base class for implementations of the EqualityComparer.
        ///     </summary>
        /// </signature>
    }
});




/* runtime
---------------------------------------------------------------------- */
intellisense.annotate(mx.runtime, {
    "hash": function () {
        /// <signature>
        ///     <summary>
        ///         Serves as a hash function for a particular type, suitable for use in hashing algorithms and data structures such as a hash table.
        ///         <br />
        ///         Returns a hash code identified by the obj parameter.
        ///     </summary>
        ///     <param name="obj" type="Object">An object to retrieve the hash code for.</param>
        ///     <returns type="Number" />
        /// </signature>
    },
    "equals": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether the specified object instances are considered equal.
        ///         <br />
        ///         Returns true if the objA parameter is the same instance as the objB parameter, or if both are null, or if objA.equals(objB) returns true; otherwise, false.
        ///     </summary>
        ///     <param name="objA" type="Object">The first object to compare.</param>
        ///     <param name="objB" type="Object">The second object to compare.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "compare": function () {
        /// <signature>
        ///     <summary>
        ///         Performs a comparison of two objects of the same type and returns a value indicating whether one object is less than, equal to, or greater than the other.
        ///         <br />
        ///         Returns an integer that indicates the relative values of objA and objB, as shown in the following table:
        ///         <br />
        ///         Less than zero objA is less than objB.
        ///         <br />
        ///         Zero objA equals objB.
        ///         <br />
        ///         Greater than zero objA is greater than objB.
        ///     </summary>
        ///     <param name="objA" type="Object">The first object to compare.</param>
        ///     <param name="objB" type="Object">The second object to compare.</param>
        ///     <returns type="Number" />
        /// </signature>
    },
    "lambda": function () {
        /// <signature>
        ///     <summary>
        ///         Creates A function expression from the specified string lambda expression
        ///         <br />
        ///         Returns a lambda function expression.
        ///     </summary>
        ///     <param name="exp" type="String">String lambda expression.</param>
        ///     <returns type="Function" />
        /// </signature>
    },
    "define": function () {
        /// <signature>
        ///     <summary>
        ///         Defines new or modifies existing properties directly on the specified object, returning the object.
        ///         <br />
        ///         Returns the specified object.
        ///     </summary>
        ///     <param name="obj" type="Object">The object on which to define or modify properties.</param>
        ///     <param name="prop" type="String">The name of the property to be defined or modified.</param>
        ///     <param name="attributes" type="PropertyDescriptor">The descriptor for the property being defined or modified.</param>
        ///     <returns type="Object" />
        /// </signature>
    },
    "mixin": function () {
        /// <signature>
        ///     <summary>
        ///         Extends the given object by implementing supplied members.
        ///         <br />
        ///         Returns the specified object.
        ///     </summary>
        ///     <param name="obj" type="Object">The object to extend.</param>
        ///     <param name="properties" type="Object">The mixin source object.</param>
        ///     <returns type="Object" />
        /// </signature>
    }
});




/* extensions
---------------------------------------------------------------------- */
intellisense.annotate(mx.extensions, {
    "aggregate": function () {
        /// <signature>
        ///     <summary>
        ///         Applies an accumulator function over a sequence.
        ///         <br />
        ///         Returns the final accumulator value.
        ///     </summary>
        ///     <param name="func" type="Function">An accumulator function to be invoked on each element. eg. function(accumulate, item)</param>
        ///     <returns type="Object" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Applies an accumulator function over a sequence. The specified seed value is used as the initial accumulator value.
        ///         <br />
        ///         Returns the final accumulator value.
        ///     </summary>
        ///     <param name="seed" type="Object">The initial accumulator value.</param>
        ///     <param name="func" type="Function">An accumulator function to be invoked on each element. eg. function(accumulate, item)</param>
        ///     <returns type="Object" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Applies an accumulator function over a sequence. The specified seed value is used as the initial accumulator value, and the specified function is used to select the result value.
        ///         <br />
        ///         Returns the final accumulator value.
        ///     </summary>
        ///     <param name="seed" type="Object">The initial accumulator value.</param>
        ///     <param name="func" type="Function">An accumulator function to be invoked on each element. eg. function(accumulate, item)</param>
        ///     <param name="resultSelector" type="Function">A function to transform the final accumulator value into the result value. eg. function(accumulate)</param>
        ///     <returns type="Object" />
        /// </signature>
    },
    "all": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether all elements of a sequence satisfy a condition.
        ///         <br />
        ///         Returns true if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
        ///     </summary>
        ///     <param name="predicate" type="Function">A function to test each element for a condition. eg. function(item)</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "any": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether a sequence contains any elements.
        ///         <br />
        ///         Returns true if the source sequence contains any elements; otherwise, false.
        ///     </summary>
        ///     <returns type="Boolean" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Determines whether any element of a sequence satisfies a condition.
        ///         <br />
        ///         Returns true if any elements in the source sequence pass the test in the specified predicate; otherwise, false.
        ///     </summary>
        ///     <param name="predicate" type="Function">A function to test each element for a condition. eg. function(item)</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "asEnumerable": function () {
        /// <signature>
        ///     <summary>
        ///         Returns the input typed as Enumerable.
        ///     </summary>
        ///     <returns type="Enumerable" />
        /// </signature>
    },
    "average": function () {
        /// <signature>
        ///     <summary>
        ///         Computes the average of a sequence of numeric values.
        ///         <br />
        ///         Returns the average of the sequence of values.
        ///     </summary>
        ///     <returns type="Number" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
        ///         <br />
        ///         Returns the average of the sequence of values.
        ///     </summary>
        ///     <param name="selector" type="Function">A transform function to apply to each element. eg. function(item)</param>
        ///     <returns type="Number" />
        /// </signature>
    },
    "concat": function () {
        /// <signature>
        ///   <summary>Concatenates two sequences.</summary>
        ///   <param name="second" type="Enumerable">The sequence to concatenate to the first sequence.</param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "contains": function () {
        /// <signature>
        ///   <summary>Determines whether a sequence contains a specified element by using the default equality comparer.</summary>
        ///   <param name="value" type="Object">The value to locate in the sequence.</param>
        ///   <returns type="Boolean" />
        /// </signature>
        /// <signature>
        ///   <summary>Returns the last element of a sequence that satisfies a specified condition.</summary>
        ///   <param name="value" type="Object">The value to locate in the sequence.</param>
        ///   <param name="comparer" type="EqualityComparer">
        ///     An equality comparer to compare values.
        ///     <para>An EqualityComparer defines methods to support the comparison of objects for equality.</para>
        ///     <para>{ hash: function(obj), equals: function(x, y) }</para>
        ///   </param>
        ///   <returns type="Boolean" />
        /// </signature>
    },
    "count": function () {
        /// <signature>
        ///   <summary>Returns the number of elements in a sequence.</summary>
        ///   <returns type="Number" />
        /// </signature>
        /// <signature>
        ///   <summary>Returns a number that represents how many elements in the specified sequence satisfy a condition.</summary>
        ///   <param name="predicate" type="Function">A function to test each element for a condition. eg. function(item)</param>
        ///   <returns type="Number" />
        /// </signature>
    },
    "defaultIfEmpty": function () {
        /// <signature>
        ///   <summary>Returns the elements of the specified sequence or null if the sequence is empty.</summary>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>Returns the elements of the specified sequence or the specified value in  a singleton collection if the sequence is empty.</summary>
        ///   <param name="defaultValue" type="Object">The value to return if the sequence is empty.</param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "distinct": function () {
        /// <signature>
        ///   <summary>Returns distinct elements from a sequence by using the default equality comparer to compare values.</summary>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>Produces the set difference of two sequences by using the EqualityComparer to compare values.</summary>
        ///   <param name="comparer" type="EqualityComparer">
        ///     An equality comparer to compare values.
        ///     <para>An EqualityComparer defines methods to support the comparison of objects for equality.</para>
        ///     <para>{ hash: function(obj), equals: function(x, y) }</para>
        ///   </param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "except": function () {
        /// <signature>
        ///   <summary>Produces the set difference of two sequences by using the default equality comparer to compare values.</summary>
        ///   <param name="second" type="Enumerable">An Enumerable whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.</param>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>Produces the set difference of two sequences by using the specified EqualityComparer to compare values.</summary>
        ///   <param name="second" type="Enumerable">An Enumerable whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.</param>
        ///   <param name="comparer" type="EqualityComparer">An EqualityComparer to compare values.</param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "elementAt": function () {
        /// <signature>
        ///   <summary>Returns the element at a specified index in a sequence. Throws an error if the index is less than 0 or greater than or equal to the number of elements in source.</summary>
        ///   <param name="index" type="Number">The zero-based index of the element to retrieve.</param>
        ///   <returns type="Object" />
        /// </signature>
    },
    "first": function () {
        /// <signature>
        ///   <summary>Returns the first element of a sequence. this method throws an exception if there is no element in the sequence.</summary>
        ///   <returns type="Object" />
        /// </signature>
        /// <signature>
        ///   <summary>Returns the first element in a sequence that satisfies a specified condition. this method throws an exception if there is no element in the sequence.</summary>
        ///   <param name="predicate" type="Function">A function to test each source element for a condition. function(item)</param>
        ///   <returns type="Object" />
        /// </signature>
    },
    "firstOrDefault": function () {
        /// <signature>
        ///   <summary>Returns the first element of a sequence, or null if the sequence contains no elements.</summary>
        ///   <returns type="Object" />
        /// </signature>
        /// <signature>
        ///   <summary>Returns the first element of the sequence that satisfies a condition or null if no such element is found.</summary>
        ///   <param name="predicate" type="Function">A function to test each source element for a condition. eg. function(item)</param>
        ///   <returns type="Object" />
        /// </signature>
        /// <signature>
        ///   <summary>Returns the first element of the sequence that satisfies a condition or a default value if no such element is found.</summary>
        ///   <param name="predicate" type="Function">A function to test each source element for a condition. eg. function(item)</param>
        ///   <param name="defaultValue" type="Object">The value to return if no element exists with specified condition.</param>
        ///   <returns type="Object" />
        /// </signature>
    },
    "forEach": function () {
        /// <signature>
        ///   <summary>Performs the specified action on each element of an Enumerable.</summary>
        ///   <param name="action" type="Function">The action function to perform on each element of an Enumerable. eg. function(item)</param>
        /// </signature>
        /// <signature>
        ///   <summary>Performs the specified action on each element of an Enumerable.</summary>
        ///   <param name="action" type="Function">The action function to perform on each element of an Enumerable. eg. function(item, index)</param>
        /// </signature>
    },
    "groupBy": function () {
        /// <signature>
        ///   <summary>Groups the elements of a sequence according to a specified key selector function.</summary>
        ///   <param name="keySelector" type="Function">A function to extract the key for each element. eg. function(item)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>Groups the elements of a sequence according to a specified key selector function.</summary>
        ///   <param name="keySelector" type="Function">A function to extract the key for each element. eg. function(item)</param>
        ///   <param name="comparer" type="EqualityComparer">
        ///     An equality comparer to compare values.
        ///     <para>An EqualityComparer defines methods to support the comparison of objects for equality.</para>
        ///     <para>{ hash: function(obj), equals: function(x, y) }</para>
        ///   </param>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>Groups the elements of a sequence according to a specified key selector function and projects the elements for each group by using a specified function.</summary>
        ///   <param name="keySelector" type="Function">A function to extract the key for each element. eg. function(item)</param>
        ///   <param name="elementSelector" type="Function">A function to map each source element to an element in the Grouping. eg. function(item)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>
        ///     Groups the elements of a sequence according to a key selector function. 
        ///     The keys are compared by using a comparer and each group's elements are projected by using a specified function.
        ///   </summary>
        ///   <param name="keySelector" type="Function">A function to extract the key for each element. eg. function(item)</param>
        ///   <param name="elementSelector" type="Function">A function to map each source element to an element in the Grouping. eg. function(item)</param>
        ///   <param name="comparer" type="EqualityComparer">
        ///     An equality comparer to compare values.
        ///     <para>An EqualityComparer defines methods to support the comparison of objects for equality.</para>
        ///     <para>{ hash: function(obj), equals: function(x, y) }</para>
        ///   </param>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>Groups the elements of a sequence according to a specified key selector function and projects the elements for each group by using a specified function.</summary>
        ///   <param name="keySelector" type="Function">A function to extract the key for each element. eg. function(item)</param>
        ///   <param name="elementSelector" type="Function">A function to map each source element to an element in the Grouping. eg. function(item)</param>
        ///   <param name="resultSelector" type="Function">A function to extract the key for each element. eg. function(key, Enumerable)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>
        ///     Groups the elements of a sequence according to a key selector function. 
        ///     The keys are compared by using a comparer and each group's elements are projected by using a specified function.
        ///   </summary>
        ///   <param name="keySelector" type="Function">A function to extract the key for each element. eg. function(item)</param>
        ///   <param name="elementSelector" type="Function">A function to map each source element to an element in the Grouping. eg. function(item)</param>
        ///   <param name="resultSelector" type="Function">A function to extract the key for each element. eg. function(key, Enumerable)</param>
        ///   <param name="comparer" type="EqualityComparer">
        ///     An equality comparer to compare values.
        ///     <para>An EqualityComparer defines methods to support the comparison of objects for equality.</para>
        ///     <para>{ hash: function(obj), equals: function(x, y) }</para>
        ///   </param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "groupJoin": function () {
        /// <signature>
        ///   <summary>Correlates the elements of two sequences based on equality of keys and groups the results. The default equality comparer is used to compare keys.</summary>
        ///   <param name="inner" type="Enumerable">The sequence to join to the first sequence.</param>
        ///   <param name="outerKeySelector" type="Function">A function to extract the join key from each element of the first sequence. eg. function(outer)</param>
        ///   <param name="innerKeySelector" type="Function">A function to extract the join key from each element of the second sequence. eg. function(inner)</param>
        ///   <param name="resultSelector" type="Function">A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence. eg. function(outer, inner)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>Correlates the elements of two sequences based on key equality and groups the results. A specified EqualityComparer is used to compare keys.</summary>
        ///   <param name="inner" type="Enumerable">The sequence to join to the first sequence.</param>
        ///   <param name="outerKeySelector" type="Function">A function to extract the join key from each element of the first sequence. eg. function(outer)</param>
        ///   <param name="innerKeySelector" type="Function">A function to extract the join key from each element of the second sequence. function(inner)</param>
        ///   <param name="resultSelector" type="Function">A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence. eg. function(outer, inner)</param>
        ///   <param name="comparer" type="EqualityComparer">
        ///     An equality comparer to compare values.
        ///     <para>An EqualityComparer defines methods to support the comparison of objects for equality.</para>
        ///     <para>{ hash: function(obj), equals: function(x, y) }</para>
        ///   </param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "intersect": function () {
        /// <signature>
        ///   <summary>Produces the set intersection of two sequences by using the default equality comparer to compare values.</summary>
        ///   <param name="second" type="Enumerable">An Enumerable whose distinct elements that also appear in the first sequence will be returned.</param>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>Produces the set intersection of two sequences by using the default equality comparer to compare values.</summary>
        ///   <param name="second" type="Enumerable">An Enumerable whose distinct elements that also appear in the first sequence will be returned.</param>
        ///   <param name="comparer" type="EqualityComparer">
        ///     An equality comparer to compare values.
        ///     <para>An EqualityComparer defines methods to support the comparison of objects for equality.</para>
        ///     <para>{ hash: function(obj), equals: function(x, y) }</para>
        ///   </param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "join": function () {
        /// <signature>
        ///   <summary>Correlates the elements of two sequences based on matching keys. The default equality comparer is used to compare keys.</summary>
        ///   <param name="inner" type="Enumerable">The sequence to join to the first sequence.</param>
        ///   <param name="outerKeySelector" type="Function">A function to extract the join key from each element of the first sequence. eg. function(outer)</param>
        ///   <param name="innerKeySelector" type="Function">A function to extract the join key from each element of the second sequence. eg. function(inner)</param>
        ///   <param name="resultSelector" type="Function">A function to create a result element from two matching elements. eg. function(outer, inner)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>Correlates the elements of two sequences based on matching keys. A specified EqualityComparer is used to compare keys.</summary>
        ///   <param name="inner" type="Enumerable">The sequence to join to the first sequence.</param>
        ///   <param name="outerKeySelector" type="Function">A function to extract the join key from each element of the first sequence. eg. function(outer)</param>
        ///   <param name="innerKeySelector" type="Function">A function to extract the join key from each element of the second sequence. eg. function(inner)</param>
        ///   <param name="resultSelector" type="Function">A function to create a result element from two matching elements. eg. function(outer, inner)</param>
        ///   <param name="comparer" type="EqualityComparer">
        ///     An equality comparer to compare values.
        ///     <para>An EqualityComparer defines methods to support the comparison of objects for equality.</para>
        ///     <para>{ hash: function(obj), equals: function(x, y) }</para>
        ///   </param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "last": function () {
        /// <signature>
        ///   <summary>Returns the last element of a sequence.</summary>
        ///   <returns type="Object" />
        /// </signature>
        /// <signature>
        ///   <summary>Returns the last element of a sequence that satisfies a specified condition.</summary>
        ///   <param name="predicate" type="Function">A function to test each source element for a condition. eg. function(item)</param>
        ///   <returns type="Object" />
        /// </signature>
    },
    "lastOrDefault": function () {
        /// <signature>
        ///   <summary>Returns the last element of a sequence, or null if the sequence contains no elements.</summary>
        ///   <returns type="Object" />
        /// </signature>
        /// <signature>
        ///   <summary>Returns the last element of a sequence that satisfies a condition or null if no such element is found.</summary>
        ///   <param name="predicate" type="Function">A function to test each source element for a condition. eg. function(item)</param>
        ///   <returns type="Object" />
        /// </signature>
        /// <signature>
        ///   <summary>Returns the last element of a sequence that satisfies a condition or a default value if no such element is found.</summary>
        ///   <param name="predicate" type="Function(item)">A function to test each source element for a condition. eg. function(item)</param>
        ///   <param name="defaultValue" type="Object">The value to return if no element exists with specified condition.</param>
        ///   <returns type="Object" />
        /// </signature>
    },
    "max": function () {
        /// <signature>
        ///   <summary>Returns the maximum value in a sequence of values.</summary>
        ///   <returns type="Object" />
        /// </signature>
        /// <signature>
        ///   <summary>Invokes a transform function on each element of a sequence and returns the maximum value.</summary>
        ///   <param name="selector" type="Function">A transform function to apply to each element. eg. function(item)</param>
        ///   <returns type="Object" />
        /// </signature>
    },
    "min": function () {
        /// <signature>
        ///   <summary>Returns the minimum value in a sequence of values.</summary>
        ///   <returns type="Object" />
        /// </signature>
        /// <signature>
        ///   <summary>Invokes a transform function on each element of a sequence and returns the minimum value.</summary>
        ///   <param name="selector" type="Function">A transform function to apply to each element. eg. function(item)</param>
        ///   <returns type="Object" />
        /// </signature>
    },
    "ofType": function () {
        /// <signature>
        ///   <summary>Filters the elements of an Enumerable based on a specified type.</summary>
        ///   <param name="type" type="Function">The type to filter the elements of the sequence on.</param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "orderBy": function () {
        /// <signature>
        ///     <summary>
        ///         Sorts the elements of a sequence in ascending order according to a key.
        ///         <br />
        ///         Returns an OrderedEnumerable whose elements are sorted according to a key.
        ///     </summary>
        ///     <param name="keySelector" type="Function">A function to extract a key from each element. eg. function(item)</param>
        ///     <returns type="OrderedEnumerable" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Sorts the elements of a sequence in ascending order by using a specified comparer.
        ///         <br />
        ///         Returns an OrderedEnumerable whose elements are sorted according to a key.
        ///     </summary>
        ///     <param name="keySelector" type="Function">A function to extract a key from each element. eg. function(item)</param>
        ///     <param name="comparer" type="Comparer">A Comparer to compare keys.</param>
        ///     <returns type="OrderedEnumerable" />
        /// </signature>
    },
    "orderByDescending": function () {
        /// <signature>
        ///     <summary>
        ///         Sorts the elements of a sequence in descending order according to a key.
        ///         <br />
        ///         Returns an OrderedEnumerable whose elements are sorted in descending order according to a key.
        ///     </summary>
        ///     <param name="keySelector" type="Function">A function to extract a key from each element. eg. function(item)</param>
        ///     <returns type="OrderedEnumerable" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Sorts the elements of a sequence in descending order by using a specified comparer.
        ///         <br />
        ///         Returns an OrderedEnumerable whose elements are sorted in descending order according to a key.
        ///     </summary>
        ///     <param name="keySelector" type="Function">A function to extract a key from each element. eg. function(item)</param>
        ///     <param name="comparer" type="Comparer">A Comparer to compare keys.</param>
        ///     <returns type="OrderedEnumerable" />
        /// </signature>
    },
    "reverse": function () {
        /// <signature>
        ///   <summary>Inverts the order of the elements in a sequence.</summary>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "sequenceEqual": function () {
        /// <signature>
        ///   <summary>Determines whether two sequences are equal by comparing the elements by using the default equality comparer for their type.</summary>
        ///   <param name="second" type="Enumerable">An Enumerable to compare to the first sequence.</param>
        ///   <returns type="Boolean" />
        /// </signature>
        /// <signature>
        ///   <summary>Determines whether two sequences are equal by comparing their elements by using a specified EqualityComparer.</summary>
        ///   <param name="second" type="Enumerable">An Enumerable to compare to the first sequence.</param>
        ///   <param name="comparer" type="EqualityComparer">
        ///     An equality comparer to compare values.
        ///     <para>An EqualityComparer defines methods to support the comparison of objects for equality.</para>
        ///     <para>{ hash: function(obj), equals: function(x, y) }</para>
        ///   </param>
        ///   <returns type="Boolean" />
        /// </signature>
    },
    "select": function () {
        /// <signature>
        ///   <summary>Projects each element of a sequence into a new form.</summary>
        ///   <param name="selector" type="Function">A transform function to apply to each element. eg. function(item)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>Projects each element of a sequence into a new form by incorporating the element's index.</summary>
        ///   <param name="selector" type="Function">A transform function to apply to each source element; the second parameter of the function represents the index of the source element. eg. function(item, index)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "selectMany": function () {
        /// <signature>
        ///   <summary>Projects each element of a sequence to an Enumerable and flattens the resulting sequences into one sequence.</summary>
        ///   <param name="collectionSelector" type="Function">A transform function to apply to each element. eg. function(item)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>Projects each element of a sequence to an Enumerable and flattens the resulting sequences into one sequence. The index of each source element is used in the projected form of that element.</summary>
        ///   <param name="collectionSelector" type="Function">A transform function to apply to each source element; the second parameter of the function represents the index of the source element. eg. function(item, index)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>Projects each element of a sequence to an Enumerable and flattens the resulting sequences into one sequence.</summary>
        ///   <param name="collectionSelector" type="Function">A transform function to apply to each element. eg. function(item)</param>
        ///   <param name="resultSelector" type="Function">A transform function to apply to each element of the intermediate sequence. function(item, collection)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>Projects each element of a sequence to an Enumerable and flattens the resulting sequences into one sequence. The index of each source element is used in the projected form of that element.</summary>
        ///   <param name="collectionSelector" type="Function">A transform function to apply to each source element; the second parameter of the function represents the index of the source element. eg. function(item, index)</param>
        ///   <param name="resultSelector" type="Function">A transform function to apply to each element of the intermediate sequence. eg. function(item, collection)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "single": function () {
        /// <signature>
        ///   <summary>Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.</summary>
        ///   <returns type="Object" />
        /// </signature>
        /// <signature>
        ///   <summary>Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.</summary>
        ///   <param name="predicate" type="Function">A function to test each source element for a condition. eg. function(item)</param>
        ///   <returns type="Object" />
        /// </signature>
    },
    "singleOrDefault": function () {
        /// <signature>
        ///   <summary>Returns the only element of a sequence, or a null if the sequence is empty; this method throws an exception if there is more than one element in the sequence.</summary>
        ///   <returns type="Object" />
        /// </signature>
        /// <signature>
        ///   <summary>Returns the only element of a sequence that satisfies a specified condition or a null if no such element exists; this method throws an exception if more than one element satisfies the condition.</summary>
        ///   <param name="predicate" type="Function">A function to test each source element for a condition. eg. function(item)</param>
        ///   <returns type="Object" />
        /// </signature>
        /// <signature>
        ///   <summary>Returns the only element of a sequence that satisfies a specified condition or a default value if no such element exists; this method throws an exception if more than one element satisfies the condition.</summary>
        ///   <param name="predicate" type="Function">A function to test each source element for a condition. eg. function(item)</param>
        ///   <param name="defaultValue" type="Object">The value to return if no element exists with specified condition.</param>
        ///   <returns type="Object" />
        /// </signature>
    },
    "skip": function () {
        /// <signature>
        ///   <summary>Bypasses a specified number of elements in a sequence and then returns the remaining elements.</summary>
        ///   <param name="count" type="Number">The number of elements to skip before returning the remaining elements.</param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "skipWhile": function () {
        /// <signature>
        ///   <summary>Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.</summary>
        ///   <param name="predicate" type="Function">A function to test each element for a condition. eg. function(item)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements. The element's index is used in the logic of the predicate function.</summary>
        ///   <param name="predicate" type="Function">A function to test each source element for a condition; the second parameter of the function represents the index of the source element. eg. function(item, index)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "sum": function () {
        /// <signature>
        ///   <summary>Computes the sum of a sequence of values.</summary>
        ///   <returns type="Number" />
        /// </signature>
        /// <signature>
        ///   <summary>Computes the sum of the sequence of values that are obtained by invoking a transform function on each element of the input sequence.</summary>
        ///   <param name="selector" type="Function">A transform function to apply to each element. eg. function(item)</param>
        ///   <returns type="Number" />
        /// </signature>
    },
    "take": function () {
        /// <signature>
        ///   <summary>Returns a specified number of contiguous elements from the start of a sequence.</summary>
        ///   <param name="count" type="Number">The number of elements to return.</param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "takeWhile": function () {
        /// <signature>
        ///   <summary>Returns elements from a sequence as long as a specified condition is true.</summary>
        ///   <param name="predicate" type="Function">A function to test each element for a condition. eg. function(item)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>Returns elements from a sequence as long as a specified condition is true. The element's index is used in the logic of the predicate function.</summary>
        ///   <param name="predicate" type="Function">A function to test each source element for a condition; the second parameter of the function represents the index of the source element. eg. Function(item, index)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "toArray": function () {
        /// <signature>
        ///   <summary>Creates an array from an Enumerable.</summary>
        ///   <returns type="Array" />
        /// </signature>
    },
    "toDictionary": function () {
        /// <signature>
        ///   <summary>Creates a Dictionary from an Enumerable according to a specified key selector function.</summary>
        ///   <param name="keySelector" type="Function">A function to extract a key from each element. eg. function(item)</param>
        ///   <returns type="Dictionary" />
        /// </signature>
        /// <signature>
        ///   <summary>Creates a Dictionary from an Enumerable according to specified key selector and comparer.</summary>
        ///   <param name="keySelector" type="function(item)">A function to extract a key from each element. eg. function(item)</param>
        ///   <param name="comparer" type="EqualityComparer">
        ///     An equality comparer to compare values.
        ///     <para>An EqualityComparer defines methods to support the comparison of objects for equality.</para>
        ///     <para>{ hash: function(obj), equals: function(x, y) }</para>
        ///   </param>
        ///   <returns type="Dictionary" />
        /// </signature>
        /// <signature>
        ///   <summary>Creates a Dictionary from an Enumerable according to specified key selector and element selector functions.</summary>
        ///   <param name="keySelector" type="function(item)">A function to extract a key from each element. eg. function(item)</param>
        ///   <param name="elementSelector" type="Function">A transform function to produce a result element value from each element. eg. function(item)</param>
        ///   <returns type="Dictionary" />
        /// </signature>
        /// <signature>
        ///   <summary>Creates a Dictionary from an Enumerable according to a specified key selector function, a comparer, and an element selector function.</summary>
        ///   <param name="keySelector" type="function(item)">A function to extract a key from each element. eg. function(item)</param>
        ///   <param name="elementSelector" type="Function">A transform function to produce a result element value from each element. eg. function(item)</param>
        ///   <param name="comparer" type="EqualityComparer">
        ///     An equality comparer to compare values.
        ///     <para>An EqualityComparer defines methods to support the comparison of objects for equality.</para>
        ///     <para>{ hash: function(obj), equals: function(x, y) }</para>
        ///   </param>
        ///   <returns type="Dictionary" />
        /// </signature>
    },
    "toList": function () {
        /// <signature>
        ///   <summary>Creates a List from an Enumerable.</summary>
        ///   <returns type="List" />
        /// </signature>
    },
    "toLookup": function () {
        /// <signature>
        ///   <summary>Creates a Lookup from an Enumerable according to a specified key selector function.</summary>
        ///   <param name="keySelector" type="Function">A function to extract a key from each element. eg. function(item)</param>
        ///   <returns type="Lookup" />
        /// </signature>
        /// <signature>
        ///   <summary>Creates a Lookup from an Enumerable according to a specified key selector function and comparer</summary>
        ///   <param name="keySelector" type="Function">A function to extract a key from each element. eg. function(item)</param>
        ///   <param name="comparer" type="EqualityComparer">
        ///     An equality comparer to compare values.
        ///     <para>An EqualityComparer defines methods to support the comparison of objects for equality.</para>
        ///     <para>{ hash: function(obj), equals: function(x, y) }</para>
        ///   </param>
        ///   <returns type="Lookup" />
        /// </signature>
        /// <signature>
        /// <signature>
        ///   <summary>Creates a Lookup from an Enumerable according to specified key selector and element selector functions.</summary>
        ///   <param name="keySelector" type="Function">A function to extract a key from each element. eg. function(item)</param>
        ///   <param name="elementSelector" type="Function">A transform function to produce a result element value from each element. eg. function(item)</param>
        ///   <returns type="Lookup" />
        /// </signature>
        ///   <summary>Creates a Lookup from an Enumerable according to a specified key selector function, a comparer and an element selector function.</summary>
        ///   <param name="keySelector" type="Function">A function to extract a key from each element. eg. function(item)</param>
        ///   <param name="elementSelector" type="Function">A transform function to produce a result element value from each element. eg. function(item)</param>
        ///   <param name="comparer" type="EqualityComparer">
        ///     An equality comparer to compare values.
        ///     <para>An EqualityComparer defines methods to support the comparison of objects for equality.</para>
        ///     <para>{ hash: function(obj), equals: function(x, y) }</para>
        ///   </param>
        ///   <returns type="Lookup" />
        /// </signature>
    },
    "union": function () {
        /// <signature>
        ///   <summary>Produces the set union of two sequences by using the default equality comparer.</summary>
        ///   <param name="second" type="Enumerable">An Enumerable whose distinct elements form the second set for the union.</param>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>Produces the set union of two sequences by using a specified EqualityComparer.</summary>
        ///   <param name="second" type="Enumerable">An Enumerable whose distinct elements form the second set for the union.</param>
        ///   <param name="comparer" type="EqualityComparer">
        ///     An equality comparer to compare values.
        ///     <para>An EqualityComparer defines methods to support the comparison of objects for equality.</para>
        ///     <para>{ hash: function(obj), equals: function(x, y) }</para>
        ///   </param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "where": function () {
        /// <signature>
        ///   <summary>Filters a sequence of values based on a predicate.</summary>
        ///   <param name="predicate" type="Function">A function to test each element for a condition. eg. function(item)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
        /// <signature>
        ///   <summary>Filters a sequence of values based on a predicate. Each element's index is used in the logic of the predicate function.</summary>
        ///   <param name="predicate" type="Function">A function to test each source element for a condition; the second parameter of the function represents the index of the source element. eg. function(item, index)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "zip": function () {
        /// <signature>
        ///   <summary>Merges two sequences by using the specified predicate function.</summary>
        ///   <param name="second" type="Enumerable">The second sequence to merge.</param>
        ///   <param name="resultSelector" type="Function">A function that specifies how to merge the elements from the two sequences. eg. function(first, second)</param>
        ///   <returns type="Enumerable" />
        /// </signature>
    }
});




/* Enumerator
---------------------------------------------------------------------- */
intellisense.annotate(mx.Enumerator.prototype, {
    /// <field name="current" type="Object">Gets the current element in the collection.</field>
    "current": {},
    "next": function () {
        /// <signature>
        ///     <summary>
        ///         Advances the enumerator to the next element of the collection.
        ///         <br />
        ///         Returns true if the enumerator was successfully advanced to the next element; false if the enumerator has passed the end of the collection.
        ///     </summary>
        ///     <returns type="Boolean" />
        /// </signature>
    }
});




/* Enumerable
---------------------------------------------------------------------- */
intellisense.annotate(mx.Enumerable, {
    "empty": function () {
        /// <signature>
        ///     <summary>
        ///         Returns an empty Enumerable.
        ///     </summary>
        ///     <returns type="Enumerable" />
        /// </signature>
    },
    "is": function () {
        /// <signature>
        ///     <summary>
        ///         Detects if an object is Enumerable.
        ///     </summary>
        ///     <param name="obj" type="Object">An object to check its Enumerability.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "range": function () {
        /// <signature>
        ///     <summary>
        ///         Generates a sequence of integral numbers within a specified range.
        ///     </summary>
        ///     <param name="start" type="Number">The value of the first integer in the sequence.</param>
        ///     <param name="count" type="Number">The number of sequential integers to generate.</param>
        ///     <returns type="Enumerable" />
        /// </signature>
    },
    "repeat": function () {
        /// <signature>
        ///     <summary>
        ///         Generates a sequence that contains one repeated value.
        ///     </summary>
        ///     <param name="element" type="Object">The value to be repeated.</param>
        ///     <param name="count" type="Number">The number of sequential integers to generate.</param>
        ///     <returns type="Enumerable" />
        /// </signature>
    }
});
intellisense.annotate(mx.Enumerable.prototype, {
    "getEnumerator": function () {
        /// <signature>
        ///     <summary>
        ///         Returns an enumerator that iterates through the collection. 
        ///     </summary>
        ///     <returns type="Enumerator" />
        /// </signature>
    }
});
intellisense.annotate(mx.Enumerable.prototype, mx.extensions);
intellisense.annotate(String.prototype, mx.extensions);
intellisense.annotate(Array.prototype, mx.extensions);




/* Comparer
---------------------------------------------------------------------- */
intellisense.annotate(mx.Comparer, {
    /// <field type="Comparer">Gets a default sort order comparer for the type specified by the generic argument.</field>
    "defaultComparer": {},
    "create": function () {
        /// <signature>
        ///     <summary>
        ///         Creates a comparer by using the specified comparison.
        ///         <br />
        ///         Returns a new comparer.
        ///     </summary>
        ///     <param name="comparison" type="Function">The comparison to use.</param>
        ///     <returns type="Comparer" />
        /// </signature>
    }
});
intellisense.annotate(mx.Comparer.prototype, {
    "compare": function () {
        /// <signature>
        ///     <summary>
        ///         Compares two objects and returns a value indicating whether one is less than, equal to, or greater than the other.
        ///         <br />
        ///         Returns an integer that indicates the relative values of x and y, as shown in the following table:
        ///         <br />
        ///         Less than zero x is less than y.
        ///         <br />
        ///         Zero x equals y.
        ///         <br />
        ///         Greater than zero x is greater than y.
        ///     </summary>
        ///     <param name="x" type="Object">The first object to compare.</param>
        ///     <param name="y" type="Object">The second object to compare.</param>
        ///     <returns type="Number" />
        /// </signature>
    }
});




/* EqualityComparer
---------------------------------------------------------------------- */
intellisense.annotate(mx.EqualityComparer, {
    /// <field type="EqualityComparer">Gets a default equality comparer for the type specified by the generic argument.</field>
    "defaultComparer": {},
    "create": function () {
        /// <signature>
        ///     <summary>
        ///         Creates an EqualityComparer by using the specified equality and hashCodeProvider.
        ///         <br />
        ///         Returns a new instance of the EqualityComparer class.
        ///     </summary>
        ///     <param name="hashCodeProvider" type="Function">The hashCodeProvider to use for a hash code is to be returned.</param>
        ///     <param name="equality" type="Function">The equality to use.</param>
        ///     <returns type="EqualityComparer" />
        /// </signature>
    }
});
intellisense.annotate(mx.EqualityComparer.prototype, {
    "equals": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether the specified objects are equal.
        ///         <br />
        ///         Returns true if the specified objects are equal; otherwise, false.
        ///     </summary>
        ///     <param name="x" type="Object">The first object to compare.</param>
        ///     <param name="y" type="Object">The second object to compare.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "hash": function () {
        /// <signature>
        ///     <summary>
        ///         Returns a hash code for the specified object.
        ///     </summary>
        ///     <param name="obj" type="Object">The Object for which a hash code is to be returned.</param>
        ///     <returns type="Number" />
        /// </signature>
    }
});




/* ReadOnlyCollection
---------------------------------------------------------------------- */
intellisense.annotate(mx.Collection.prototype, {
    "count": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the number of elements contained in the Collections.
        ///     </summary>
        ///     <returns type="Number" />
        /// </signature>
    },
    "copyTo": function () {
        /// <signature>
        ///     <summary>
        ///         Copies the elements of the Collections to an Array, starting at a particular Array index.
        ///     </summary>
        ///     <param name="array" type="Array">The one-dimensional Array that is the destination of the elements copied from Collections.</param>
        ///     <param name="arrayIndex" type="Number">The zero-based index in array at which copying begins.</param>
        /// </signature>
    },
    "getEnumerator": function () {
        /// <signature>
        ///     <summary>
        ///         Returns an enumerator that iterates through a Collections object.
        ///     </summary>
        ///     <returns type="Enumerator" />
        /// </signature>
    }
});




/* ReadOnlyCollection
---------------------------------------------------------------------- */
intellisense.annotate(mx.ReadOnlyCollection.prototype, {
    "get": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the element at the specified index.
        ///     </summary>
        ///     <param name="index" type="Number">The zero-based index of the element to get.</param>
        ///     <returns type="Object" />
        /// </signature>
    },
    "count": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the number of elements contained in the ReadOnlyCollection.
        ///     </summary>
        ///     <returns type="Number" />
        /// </signature>
    },
    "contains": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether the ReadOnlyCollection contains a specific value.
        ///         Returns true if item is found in the ReadOnlyCollection; otherwise, false.
        ///     </summary>
        ///     <param name="item" type="Object">The object to locate in the ReadOnlyCollection.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "copyTo": function () {
        /// <signature>
        ///     <summary>
        ///         Copies the elements of the ReadOnlyCollection to an Array, starting at a particular Array index.
        ///     </summary>
        ///     <param name="array" type="Array">The one-dimensional Array that is the destination of the elements copied from ReadOnlyCollection.</param>
        ///     <param name="arrayIndex" type="Number">The zero-based index in array at which copying begins.</param>
        /// </signature>
    },
    "indexOf": function () {
        /// <signature>
        ///     <summary>
        ///         Searches for the specified object and returns the zero-based index of the first occurrence within the entire ReadOnlyCollection.
        ///         Returns the zero-based index of the first occurrence of item within the entire ReadOnlyCollection, if found; otherwise, -1.
        ///     </summary>
        ///     <param name="item" type="Object">The object to locate in the ReadOnlyCollection.</param>
        ///     <returns type="Number" />
        /// </signature>
    },
    "getEnumerator": function () {
        /// <signature>
        ///     <summary>
        ///         Returns an enumerator that iterates through a ReadOnlyCollection object.
        ///     </summary>
        ///     <returns type="Enumerator" />
        /// </signature>
    }
});




/* List
---------------------------------------------------------------------- */
intellisense.annotate(mx.List.prototype, {
    "add": function () {
        /// <signature>
        ///     <summary>
        ///         Adds an object to the end of the List.
        ///     </summary>
        ///     <param name="item" type="Object">The object to be added to the end of the List.</param>
        /// </signature>
    },
    "addRange": function () {
        /// <signature>
        ///     <summary>
        ///         Adds the elements of the specified collection to the end of the List.
        ///     </summary>
        ///     <param name="collection" type="Enumerable">The collection whose elements should be added to the end of the List.</param>
        /// </signature>
    },
    "asReadOnly": function () {
        /// <signature>
        ///     <summary>
        ///         Returns a read-only wrapper for the current list.
        ///     </summary>
        ///     <returns type="ReadOnlyCollection" />
        /// </signature>
    },
    "binarySearch": function () {
        /// <signature>
        ///     <summary>
        ///         Searches the entire sorted List for an element using the default comparer and returns the zero-based index of the element.
        ///         Returns The zero-based index of item in the sorted List, if item is found; otherwise, a negative number 
        ///         that is the  bitwise complement of the index of the  next element that is larger than item or, if there is no larger element, 
        ///         the bitwise complement of List.count().
        ///     </summary>
        ///     <param name="item" type="Object">The object to locate.</param>
        ///     <returns type="Number" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Searches the entire sorted List for an element using the specified comparer and returns the zero-based index of the element.
        ///         returns The zero-based index of item in the sorted List, if item is found; otherwise, a negative number 
        ///         that is the  bitwise complement of the index of the  next element that is larger than item or, if there is no larger element, 
        ///         the bitwise complement of List.count().
        ///     </summary>
        ///     <param name="item" type="Object">The object to locate.</param>
        ///     <param name="comparer" type="Comparer">The Comparer implementation to use when comparing elements.</param>
        ///     <returns type="Number" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Searches a range of elements in the sorted List for an element using the specified comparer and returns the zero-based index of the element.
        ///         returns The zero-based index of item in the sorted List, if item is found; otherwise, a negative number 
        ///         that is the  bitwise complement of the index of the  next element that is larger than item or, if there is no larger element, 
        ///         the bitwise complement of List.count().
        ///     </summary>
        ///     <param name="item" type="Object">The object to locate.</param>
        ///     <param name="index" type="Number">The zero-based starting index of the range to search.</param>
        ///     <param name="count" type="Number">The length of the range to search.</param>
        ///     <param name="comparer" type="Comparer">The Comparer implementation to use when comparing elements.</param>
        ///     <returns type="Number" />
        /// </signature>
    },
    "clear": function () {
        /// <signature>
        ///     <summary>
        ///         Removes all items from the List.
        ///     </summary>
        /// </signature>
    },
    "count": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the number of elements contained in the List.
        ///     </summary>
        ///     <returns type="Number" />
        /// </signature>
    },
    "contains": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether the List contains a specific value.
        ///     </summary>
        ///     <param name="item" type="Object"The object to locate in the List.></param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "copyTo": function () {
        /// <signature>
        ///     <summary>
        ///         Copies the elements of the List to an Array, starting at a particular Array index.
        ///     </summary>
        ///     <param name="array" type="Array">The one-dimensional Array that is the destination of the elements copied from List.</param>
        ///     <param name="arrayIndex" type="Number">The zero-based index in array at which copying begins.</param>
        /// </signature>
    },
    "exists": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether the List contains elements that match the conditions defined by the specified predicate.
        ///     </summary>
        ///     <param name="match" type="Function">The predicate function that defines the conditions of the elements to search for. eg. function(item)</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "find": function () {
        /// <signature>
        ///     <summary>
        ///         Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire List.
        ///     </summary>
        ///     <param name="match" type="Function">The predicate function that defines the conditions of the elements to search for. eg. function(item)</param>
        ///     <returns type="Object" />
        /// </signature>
    },
    "findAll": function () {
        /// <signature>
        ///     <summary>
        ///         Retrieves all the elements that match the conditions defined by the specified predicate.
        ///     </summary>
        ///     <param name="match" type="Function">The predicate function that defines the conditions of the elements to search for. eg. function(item)</param>
        ///     <returns type="List" />
        /// </signature>
    },
    "findIndex": function () {
        /// <signature>
        ///     <summary>
        ///         Searches for an element that matches the conditions defined by the specified predicate, 
        ///         and returns the zero-based index of the first occurrence within the entire List, if found; otherwise, –1.
        ///     </summary>
        ///     <param name="match" type="Function">The predicate function that defines the conditions of the elements to search for.</param>
        ///     <returns type="Number" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Searches for an element that matches the conditions defined by the specified predicate, 
        ///         and returns the zero-based index of the first occurrence within the range of elements 
        ///         in the List that extends from the specified index to the last element, if found; otherwise, –1.
        ///     </summary>
        ///     <param name="startIndex" type="Number">The zero-based starting index of the search.</param>
        ///     <param name="match" type="Function">The predicate function that defines the conditions of the elements to search for.</param>
        ///     <returns type="Number" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Searches for an element that matches the conditions defined by the specified predicate, 
        ///         and returns the zero-based index of the first occurrence within the range of elements 
        ///         in the List that starts at the specified index and contains the specified number of elements, if found; otherwise, –1.
        ///     </summary>
        ///     <param name="startIndex" type="Number">The zero-based starting index of the search.</param>
        ///     <param name="count" type="Number">The number of elements in the section to search.</param>
        ///     <param name="match" type="Function">The predicate function that defines the conditions of the elements to search for.</param>
        ///     <returns type="Number" />
        /// </signature>
    },
    "findLast": function () {
        /// <signature>
        ///     <summary>
        ///         Searches for an element that matches the conditions defined by the specified predicate, 
        ///         and returns the last occurrence within the entire List.
        ///     </summary>
        ///     <param name="match" type="Function">The predicate function that defines the conditions of the elements to search for. eg. function(item)</param>
        ///     <returns type="Object" />
        /// </signature>
    },
    "findLastIndex": function () {
        /// <signature>
        ///     <summary>
        ///         Searches for an element that matches the conditions defined by the specified predicate, 
        ///         and returns the zero-based index of the last occurrence within the entire List, if found; otherwise, –1.
        ///     </summary>
        ///     <param name="match" type="Function">The predicate function that defines the conditions of the elements to search for.</param>
        ///     <returns type="Number" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Searches for an element that matches the conditions defined by the specified predicate, 
        ///         and returns the zero-based index  of the last occurrence within the range of elements 
        ///         in the List that extends from the first element to the specified index, if found; otherwise, –1.
        ///     </summary>
        ///     <param name="startIndex" type="Number">The zero-based starting index of the search.</param>
        ///     <param name="match" type="Function">The predicate function that defines the conditions of the elements to search for.</param>
        ///     <returns type="Number" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Searches for an element that matches the conditions defined by the specified predicate, 
        ///         and returns the zero-based index  of the last occurrence within the range of elements 
        ///         in the List that contains the specified number of elements and ends at the specified index, if found; otherwise, –1.
        ///     </summary>
        ///     <param name="startIndex" type="Number">The zero-based starting index of the search.</param>
        ///     <param name="count" type="Number">The number of elements in the section to search.</param>
        ///     <param name="match" type="Function">The predicate function that defines the conditions of the elements to search for.</param>
        ///     <returns type="Number" />
        /// </signature>
    },
    "forEach": function () {
        /// <signature>
        ///     <summary>
        ///         Performs the specified action on each element of the List.
        ///     </summary>
        ///     <param name="action" type="Function">The action function to perform on each element of the List. eg. function(item)</param>
        /// </signature>
    },
    "get": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the element at the specified index.
        ///     </summary>
        ///     <param name="index" type="Number">The zero-based index of the element to get.</param>
        ///     <returns type="Object" />
        /// </signature>
    },
    "getRange": function () {
        /// <signature>
        ///     <summary>
        ///         Creates a shallow copy of a range of elements in the source List.
        ///     </summary>
        ///     <param name="index" type="Number">The zero-based List index at which the range starts.</param>
        ///     <param name="count" type="Number">The number of elements in the range.</param>
        ///     <returns type="List" />
        /// </signature>
    },
    "indexOf": function () {
        /// <signature>
        ///     <summary>
        ///         Searches for the specified object and returns the zero-based index of the first occurrence within the entire List, if found; otherwise, –1.
        ///     </summary>
        ///     <param name="item" type="Object">The object to locate in the List.</param>
        ///     <returns type="Number" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Searches for the specified object and returns the zero-based index of the first occurrence within 
        ///         the range of elements in the List that extends from the specified index to the last element, if found; otherwise, –1.
        ///     </summary>
        ///     <param name="item" type="Object">The object to locate in the List.</param>
        ///     <param name="index" type="Number">The zero-based starting index of the search. 0 (zero) is valid in an empty list.</param>
        ///     <returns type="Number" />
        /// </signature>
    },
    "insert": function () {
        /// <signature>
        ///     <summary>
        ///         Inserts an element into the List at the specified index.
        ///     </summary>
        ///     <param name="index" type="Number">The zero-based index at which item should be inserted.</param>
        ///     <param name="item" type="Object">The object to insert.</param>
        /// </signature>
    },
    "insertRange": function () {
        /// <signature>
        ///     <summary>
        ///         Inserts the elements of a collection into the List at the specified index.
        ///     </summary>
        ///     <param name="index" type="Number">The zero-based index at which item should be inserted.</param>
        ///     <param name="collection" type="Enumerable">The collection whose elements should be inserted into the List.</param>
        /// </signature>
    },
    "lastIndexOf": function () {
        /// <signature>
        ///     <summary>
        ///         Searches for the specified object and returns the zero-based index of the last occurrence within the entire List, if found; otherwise, –1.
        ///     </summary>
        ///     <param name="item" type="Object">The object to locate in the List.</param>
        ///     <returns type="Number" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Searches for the specified object and returns the zero-based index of the last occurrence 
        ///         within the range of elements in the List that extends from the specified index to the last element if found; otherwise, –1.
        ///     </summary>
        ///     <param name="item" type="Object">The object to locate in the List.</param>
        ///     <param name="index" type="Number">The zero-based starting index of the search. 0 (zero) is valid in an empty list.</param>
        ///     <returns type="Number" />
        /// </signature>
    },
    "remove": function () {
        /// <signature>
        ///     <summary>
        ///         Removes the first occurrence of a specific object from the List.
        ///     </summary>
        ///     <param name="item" type="Object">The object to remove from the List.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "removeAll": function () {
        /// <signature>
        ///     <summary>
        ///         Removes all the elements that match the conditions defined by the specified predicate.
        ///         and returns The number of elements removed from the List.
        ///     </summary>
        ///     <param name="match" type="Function">The predicate function that defines the conditions of the elements to remove. eg. function(item)</param>
        ///     <returns type="Number" />
        /// </signature>
    },
    "removeAt": function () {
        /// <signature>
        ///     <summary>
        ///         Removes the element at the specified index of the List.
        ///     </summary>
        ///     <param name="index" type="Number">The zero-based index of the element to remove.</param>
        /// </signature>
    },
    "removeRange": function () {
        /// <signature>
        ///     <summary>
        ///        Removes a range of elements from the List. 
        ///     </summary>
        ///     <param name="index" type="Number">The zero-based index of the element to remove.</param>
        ///     <param name="count" type="Number">The number of elements to remove.</param>
        /// </signature>
    },
    "reverse": function () {
        /// <signature>
        ///     <summary>
        ///         Reverses the order of the elements in the entire List
        ///     </summary>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Reverses the order of the elements in the specified range.
        ///     </summary>
        ///     <param name="index" type="Number">The zero-based starting index of the range to reverse.</param>
        ///     <param name="count" type="Number">The number of elements in the range to reverse.</param>
        /// </signature>
    },
    "set": function () {
        /// <signature>
        ///     <summary>
        ///         Sets the element at the specified index.
        ///     </summary>
        ///     <param name="index" type="Number">The zero-based index of the element to set.</param>
        ///     <param name="item" type="Object">The object to be added at the specified index.</param>
        /// </signature>
    },
    "sort": function () {
        /// <signature>
        ///     <summary>
        ///         Sorts the elements in the entire List using the default comparer.
        ///     </summary>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Sorts the elements in the entire List using the specified Comparison.
        ///     </summary>
        ///     <param name="comparison" type="Function">The comparison function to use when comparing elements. eg. function(x, y)</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Sorts the elements in the entire List using the specified comparer.
        ///     </summary>
        ///     <param name="comparer" type="Comparer">The Comparer implementation to use when comparing elements.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Sorts the elements in a range of elements in List using the specified comparer.
        ///     </summary>
        ///     <param name="index" type="Number">The zero-based starting index of the range to sort.</param>
        ///     <param name="count" type="Number">The length of the range to sort.</param>
        ///     <param name="comparer" type="Comparer">The Comparer implementation to use when comparing elements.</param>
        /// </signature>
    },
    "toArray": function () {
        /// <signature>
        ///     <summary>
        ///         Copies the elements of the List to a new array.
        ///     </summary>
        ///     <returns type="Array" />
        /// </signature>
    },
    "trueForAll": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether every element in the List matches the conditions defined by the specified predicate.
        ///     </summary>
        ///     <param name="match" type="Function">The Predicate function that defines the conditions to check against the elements, eg. function(item)</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "getEnumerator": function () {
        /// <signature>
        ///     <summary>
        ///         Returns an enumerator that iterates through a List object.
        ///     </summary>
        ///     <returns type="Enumerator" />
        /// </signature>
    }
});




/* SortedList
---------------------------------------------------------------------- */
intellisense.annotate(mx.SortedList.prototype, {
    "add": function () {
        /// <signature>
        ///     <summary>
        ///         Adds an element with the specified key and value into the SortedList.
        ///     </summary>
        ///     <param name="key" type="Object">The key of the element to add.</param>
        ///     <param name="value" type="Object">The value of the element to add.</param>
        /// </signature>
    },
    "get": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the value associated with the specified key.
        ///     </summary>
        ///     <param name="key" type="Object">The key whose value to get.</param>
        ///     <returns type="Object" />
        /// </signature>
    },
    "capacity": function () {
        /// <signature>
        ///     <summary>
        ///         Gets or sets the number of elements that the SortedList can contain.
        ///     </summary>
        ///     <param name="value" type="Number">The number of elements that the SortedList can contain.</param>
        ///     <returns type="Numver" />
        /// </signature>
    },
    "clear": function () {
        /// <signature>
        ///     <summary>
        ///         Removes all elements from the SortedList.
        ///     </summary>
        /// </signature>
    },
    "comparer": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the Comparer for the sorted list.
        ///     </summary>
        ///     <returns type="Comparer" />
        /// </signature>
    },
    "containsKey": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether the SortedList contains a specific key.
        ///     </summary>
        ///     <param name="key" type="Object">The key to locate in the SortedList</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "containsValue": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether the SortedList contains a specific value.
        ///     </summary>
        ///     <param name="value" type="Object">The value to locate in the SortedList</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "count": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the number of key/value pairs contained in the SortedList.
        ///     </summary>
        ///     <returns type="Number" />
        /// </signature>
    },
    "keys": function () {
        /// <signature>
        ///     <summary>
        ///         Gets a collection containing the keys in the SortedList, in sorted order.
        ///     </summary>
        ///     <returns type="Collection" />
        /// </signature>
    },
    "values": function () {
        /// <signature>
        ///     <summary>
        ///         Gets a collection containing the values in the SortedLis.
        ///     </summary>
        ///     <returns type="Collection" />
        /// </signature>
    },
    "indexOfKey": function () {
        /// <signature>
        ///     <summary>
        ///         Searches for the specified key and returns the zero-based index within the entire SortedList.
        ///     </summary>
        ///     <param name="key" type="Object">The key to locate in the SortedList.</param>
        ///     <returns type="Number" />
        /// </signature>
    },
    "indexOfValue": function () {
        /// <signature>
        ///     <summary>
        ///         Searches for the specified value and returns the zero-based index of the first occurrence within the entire SortedList.
        ///     </summary>
        ///     <param name="value" type="Object">The value to locate in the SortedList.</param>
        ///     <returns type="Number" />
        /// </signature>
    },
    "remove": function () {
        /// <signature>
        ///     <summary>
        ///         Removes the element with the specified key from the SortedList.
        ///         Returns true if the element is successfully removed; otherwise, false. This method also returns false if key was not found in the original SortedList.
        ///     </summary>
        ///     <param name="key" type="Object">The key of the element to remove.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "removeAt": function () {
        /// <signature>
        ///     <summary>
        ///         Removes the element at the specified index of the SortedList.
        ///     </summary>
        ///     <param name="index" type="Number">The zero-based index of the element to remove.</param>
        /// </signature>
    },
    "set": function () {
        /// <signature>
        ///     <summary>
        ///         Sets the value associated with the specified key.
        ///     </summary>
        ///     <param name="key" type="Object">The key whose value to get or set.</param>
        ///     <param name="value" type="Object">The value associated with the specified key.</param>
        /// </signature>
    },
    "trimExcess": function () {
        /// <signature>
        ///     <summary>
        ///         Sets the capacity to the actual number of elements in the SortedList, if that number is less than 90 percent of current capacity.
        ///     </summary>
        /// </signature>
    },
    "tryGetValue": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the value associated with the specified key.
        ///     </summary>
        ///     <param name="key" type="Object">The key whose value to get.</param>
        ///     <param name="callback" type="Function">
        ///         When this method returns, callback method is called with the value
        ///         associated with the specified key, if the key is found; otherwise, null for the type of the value parameter.
        ///     </param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "getEnumerator": function () {
        /// <signature>
        ///     <summary>
        ///         Returns an enumerator that iterates through a ReadOnlyCollection object.
        ///     </summary>
        ///     <returns type="Enumerator" />
        /// </signature>
    }
});




/* Dictionary
---------------------------------------------------------------------- */
intellisense.annotate(mx.Dictionary.prototype, {
    "add": function () {
        /// <signature>
        ///     <summary>
        ///         Adds an element with the provided key and value to the Dictionary.
        ///     </summary>
        ///     <param name="key" type="Object">The object to use as the key of the element to add.</param>
        ///     <param name="value" type="Object">The object to use as the value of the element to add.</param>
        /// </signature>
    },
    "clear": function () {
        /// <signature>
        ///     <summary>
        ///         Removes all keys and values from the Dictionary.
        ///     </summary>
        /// </signature>
    },
    "count": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the number of elements contained in the Dictionary.
        ///     </summary>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "containsKey": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether the Dictionary contains the specified key.
        ///     </summary>
        ///     <param name="key" type="Object">The key to locate in the Dictionary.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "containsValue": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether the Dictionary contains a specific value.
        ///     </summary>
        ///     <param name="value" type="Object">The value to locate in the Dictionary.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "copyTo": function () {
        /// <signature>
        ///     <summary>
        ///         Copies the Dictionary keys to an existing one-dimensional Array, starting at the specified array index.
        ///     </summary>
        ///     <param name="array" type="Array">The one-dimensional Array that is the destination of the elements copied from Dictionary keys.</param>
        ///     <param name="arrayIndex" type="Number">The zero-based index in array at which copying begins.</param>
        /// </signature>
    },
    "keys": function () {
        /// <signature>
        ///     <summary>
        ///         Gets a Collection containing the keys of the Dictionary.
        ///     </summary>
        ///     <returns type="Collection" />
        /// </signature>
    },
    "values": function () {
        /// <signature>
        ///     <summary>
        ///         Gets a Collection containing the values of the Dictionary.
        ///     </summary>
        ///     <returns type="Collection" />
        /// </signature>
    },
    "get": function () {
        /// <signature>
        ///     <summary>
        ///         Gets element with the specified key.
        ///     </summary>
        ///     <param name="key" type="Object">The key of the element to get.</param>
        ///     <returns type="Object" />
        /// </signature>
    },
    "set": function () {
        /// <signature>
        ///     <summary>
        ///         Sets the element with the specified key.
        ///     </summary>
        ///     <param name="key" type="Object">The key of the element to set.</param>
        ///     <param name="value" type="Object">The object to use as the value of the element to set.</param>
        /// </signature>
    },
    "tryGetValue": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the value associated with the specified key.
        ///     </summary>
        ///     <param name="key" type="Object">The key whose value to get.</param>
        ///     <param name="callback" type="Function">
        ///         When this method returns, callback method is called with the value
        ///         associated with the specified key, if the key is found; otherwise, null for the type of the value parameter.
        ///     </param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "remove": function () {
        /// <signature>
        ///     <summary>
        ///         Removes the element with the specified key from the Dictionary.
        ///     </summary>
        ///     <param name="key" type="Object">The key of the element to remove.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "getEnumerator": function () {
        /// <signature>
        ///     <summary>
        ///         Returns an enumerator that iterates through a Dictionary object.
        ///     </summary>
        ///     <returns type="Enumerator" />
        /// </signature>
    }
});




/* KeyValuePair
---------------------------------------------------------------------- */
intellisense.annotate(mx.KeyValuePair.prototype, {
    /// <field type="Object">Gets the key in the key/value pair.</field>
    "key": {},
    /// <field type="Object">Gets the value in the key/value pair.</field>
    "value": {}
});




/* HashSet
---------------------------------------------------------------------- */
intellisense.annotate(mx.HashSet.prototype, {
    "add": function () {
        /// <signature>
        ///     <summary>
        ///         Adds an element to the current set.
        ///     </summary>
        ///     <param name="item" type="Object">The element to add to the set.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "clear": function () {
        /// <signature>
        ///     <summary>
        ///         Removes all elements from a HashSet object.
        ///     </summary>
        /// </signature>
    },
    "count": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the number of elements contained in the HashSet.
        ///     </summary>
        ///     <returns type="Number" />
        /// </signature>
    },
    "contains": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether a HashSet object contains the specified element.
        ///     </summary>
        ///     <param name="item" type="Object">The element to locate in the HashSet object.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "copyTo": function () {
        /// <signature>
        ///     <summary>
        ///         Copies the elements of a HashSet object to an array.
        ///     </summary>
        ///     <param name="array" type="Array">The one-dimensional array that is the destination of the elements copied from the HashSet object.</param>
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Copies the elements of a HashSet object to an array. starting at the specified array index.
        ///     </summary>
        ///     <param name="array" type="Array">The one-dimensional array that is the destination of the elements copied from the HashSet object.</param>
        ///     <param name="arrayIndex" type="Number">The zero-based index in array at which copying begins.</param>
        /// </signature>
    },
    "comparer": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the EqualityComparer object that is used to determine equality for the values in the set.
        ///     </summary>
        ///     <returns type="EqualityComparer" />
        /// </signature>
    },
    "remove": function () {
        /// <signature>
        ///     <summary>
        ///         Removes the specified element from a HashSet object.
        ///     </summary>
        ///     <param name="item" type="Object">The element to remove.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "removeWhere": function () {
        /// <signature>
        ///     <summary>
        ///         Removes all elements that match the conditions defined by the specified predicate from a HashSet collection.
        ///     </summary>
        ///     <param name="match" type="Function">The predicate function that defines the conditions of the elements to remove. eg. function(item)</param>
        ///     <returns type="Number" />
        /// </signature>
    },
    "exceptWith": function () {
        /// <signature>
        ///     <summary>
        ///         Removes all elements in the specified collection from the current set.
        ///     </summary>
        ///     <param name="other" type="Enumerable">The collection of items to remove from the set.</param>
        /// </signature>
    },
    "intersectWith": function () {
        /// <signature>
        ///     <summary>
        ///         Modifies the current set so that it contains only elements that are also in a specified collection.
        ///     </summary>
        ///     <param name="other" type="Enumerable">The collection to compare to the current set.</param>
        /// </signature>
    },
    "isProperSubsetOf": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether the current set is a proper (strict) subset of a specified collection.
        ///     </summary>
        ///     <param name="other" type="Enumerable">The collection to compare to the current set.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "isProperSupersetOf": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether the current set is a proper (strict) superset of a specified collection.
        ///     </summary>
        ///     <param name="other" type="Enumerable">The collection to compare to the current set.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "isSubsetOf": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether a set is a subset of a specified collection.
        ///     </summary>
        ///     <param name="other" type="Enumerable">The collection to compare to the current set.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "isSupersetOf": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether the current set is a superset of a specified collection.
        ///     </summary>
        ///     <param name="other" type="Enumerable">The collection to compare to the current set.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "overlaps": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether the current set overlaps with the specified collection.
        ///     </summary>
        ///     <param name="other" type="Enumerable">The collection to compare to the current set.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "setEquals": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether the current set and the specified collection contain the same elements.
        ///     </summary>
        ///     <param name="other" type="Enumerable">The collection to compare to the current set.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "symmetricExceptWith": function () {
        /// <signature>
        ///     <summary>
        ///         Modifies the current set so that it contains only elements that are present
        ///     </summary>
        ///     <param name="other" type="Enumerable">The collection to compare to the current set.</param>
        /// </signature>
    },
    "unionWith": function () {
        /// <signature>
        ///     <summary>
        ///         Modifies the current set so that it contains all elements that are present in either the current set or the specified collection.
        ///     </summary>
        ///     <param name="other" type="Enumerable">The collection to compare to the current set.</param>
        /// </signature>
    },
    "getEnumerator": function () {
        /// <signature>
        ///     <summary>
        ///         Returns an enumerator that iterates through a HashSet object.
        ///     </summary>
        ///     <returns type="Enumerator" />
        /// </signature>
    }
});




/* LinkedListNode
---------------------------------------------------------------------- */
intellisense.annotate(mx.LinkedListNode.prototype, {
    "value": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the value contained in the node.
        ///     </summary>
        ///     <returns type="Object" />
        /// </signature>
    },
    "list": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the LinkedList that the LinkedListNode belongs to.
        ///     </summary>
        ///     <returns type="LinkedList" />
        /// </signature>
    },
    "next": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the next node in the LinkedList.
        ///     </summary>
        ///     <returns type="LinkedListNode" />
        /// </signature>
    },
    "previous": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the previous node in the LinkedList.
        ///     </summary>
        ///     <returns type="LinkedListNode" />
        /// </signature>
    }
});




/* LinkedList
---------------------------------------------------------------------- */
intellisense.annotate(mx.LinkedList.prototype, {
    "add": function () {
        /// <signature>
        ///     <summary>
        ///         Adds an item to the LinkedList.
        ///     </summary>
        ///     <param name="item" type="Object">The object to add to the LinkedList.</param>
        /// </signature>
    },
    "clear": function () {
        /// <signature>
        ///     <summary>
        ///         Removes all nodes from the LinkedList.
        ///     </summary>
        /// </signature>
    },
    "count": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the number of elements contained in the LinkedList.
        ///     </summary>
        ///     <returns type="Number" />
        /// </signature>
    },
    "contains": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether a value is in the LinkedList.
        ///     </summary>
        ///     <param name="value" type="Object">The value to locate in the LinkedList.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "copyTo": function () {
        /// <signature>
        ///     <summary>
        ///         Copies the entire LinkedList to a compatible one-dimensional Array, starting at the specified index of the target array.
        ///     </summary>
        ///     <param name="array" type="Array">The one-dimensional Array that is the destination of the elements copied from LinkedList.</param>
        ///     <param name="arrayIndex" type="Number">The zero-based index in array at which copying begins.</param>
        /// </signature>
    },
    "getFirst": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the first node of the LinkedList.
        ///     </summary>
        ///     <returns type="LinkedListNode" />
        /// </signature>
    },
    "getLast": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the last node of the LinkedList.
        ///     </summary>
        ///     <returns type="LinkedListNode" />
        /// </signature>
    },
    "addAfter": function () {
        /// <signature>
        ///     <summary>
        ///         Adds the specified new node after the specified existing node in the LinkedList.
        ///         returns the new LinkedListNode.
        ///     </summary>
        ///     <param name="node" type="LinkedListNode">The LinkedListNode after which to insert newNode.</param>
        ///     <param name="newNode" type="LinkedListNode">The new LinkedListNode to add to the LinkedList.</param>
        ///     <returns type="LinkedListNode" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Adds the specified new node after the specified existing node in the LinkedList.
        ///         returns The new LinkedListNode containing value.
        ///     </summary>
        ///     <param name="node" type="LinkedListNode">The LinkedListNode after which to insert newNode.</param>
        ///     <param name="value" type="Object">The value to add to the LinkedList.</param>
        ///     <returns type="LinkedListNode" />
        /// </signature>
    },
    "addBefore": function () {
        /// <signature>
        ///     <summary>
        ///         Adds the specified new node before the specified existing node in the LinkedList.
        ///         returns The new LinkedListNode.
        ///     </summary>
        ///     <param name="node" type="LinkedListNode">The LinkedListNode before which to insert newNode.</param>
        ///     <param name="newNode" type="LinkedListNode">The new LinkedListNode to add to the LinkedList.</param>
        ///     <returns type="LinkedListNode" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Adds the specified new node before the specified existing node in the LinkedList.
        ///         returns The new LinkedListNode containing value.
        ///     </summary>
        ///     <param name="node" type="LinkedListNode">The LinkedListNode before which to insert newNode.</param>
        ///     <param name="value" type="Object">The value to add to the LinkedList.</param>
        ///     <returns type="LinkedListNode" />
        /// </signature>
    },
    "addFirst": function () {
        /// <signature>
        ///     <summary>
        ///         Adds the specified new node at the start of the LinkedList.
        ///         returns The new LinkedListNode.
        ///     </summary>
        ///     <param name="node" type="LinkedListNode">The new LinkedListNode to add at the start of the LinkedList.</param>
        ///     <returns type="LinkedListNode" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Adds the specified new node at the start of the LinkedList.
        ///         returns The new LinkedListNode containing value.
        ///     </summary>
        ///     <param name="node" type="LinkedListNode">The value to add at the start of the LinkedList.</param>
        ///     <returns type="LinkedListNode" />
        /// </signature>
    },
    "addLast": function () {
        /// <signature>
        ///     <summary>
        ///         Adds the specified new node at the end of the LinkedList.
        ///         returns The new LinkedListNode.
        ///     </summary>
        ///     <param name="node" type="LinkedListNode">The new LinkedListNode to add at the end of the LinkedList.</param>
        ///     <returns type="LinkedListNode" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Adds the specified new node at the end of the LinkedList.
        ///         returns The new LinkedListNode containing value.
        ///     </summary>
        ///     <param name="value" type="Object">The value to add at the end of the LinkedList.</param>
        ///     <returns type="LinkedListNode" />
        /// </signature>
    },
    "find": function () {
        /// <signature>
        ///     <summary>
        ///         Finds the first node that contains the specified value.
        ///     </summary>
        ///     <param name="value" type="Object">The value to locate in the LinkedList.</param>
        ///     <returns type="LinkedListNode" />
        /// </signature>
    },
    "findLast": function () {
        /// <signature>
        ///     <summary>
        ///         Finds the last node that contains the specified value.
        ///     </summary>
        ///     <param name="value" type="Object">The value to locate in the LinkedList.</param>
        ///     <returns type="LinkedListNode" />
        /// </signature>
    },
    "remove": function () {
        /// <signature>
        ///     <summary>
        ///         Removes the node at the start of the LinkedList.
        ///         returns true if the node is successfully removed; otherwise, false. 
        ///         This method also returns false if value was not found in the original LinkedList.
        ///     </summary>
        ///     <param name="node" type="LinkedListNode">The LinkedListNode to remove from the LinkedList.</param>
        ///     <returns type="Boolean" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Removes the first occurrence of the specified value from the LinkedList.
        ///         returns true if the element containing value is successfully removed; otherwise, false. 
        ///         This method also returns false if value was not found in the original LinkedList.
        ///     </summary>
        ///     <param name="value" type="Object">The value to remove from the LinkedList.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "removeFirst": function () {
        /// <signature>
        ///     <summary>
        ///         Removes the node at the start of the LinkedList.
        ///     </summary>
        /// </signature>
    },
    "removeLast": function () {
        /// <signature>
        ///     <summary>
        ///         Removes the node at the end of the LinkedList.
        ///     </summary>
        /// </signature>
    },
    "getEnumerator": function () {
        /// <signature>
        ///     <summary>
        ///         Returns an enumerator that iterates through a LinkedList object.
        ///     </summary>
        ///     <returns type="Enumerator" />
        /// </signature>
    }
});




/* Queue
---------------------------------------------------------------------- */
intellisense.annotate(mx.Queue.prototype, {
    "clear": function () {
        /// <signature>
        ///     <summary>
        ///         Removes all objects from the Queue.
        ///     </summary>
        /// </signature>
    },
    "count": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the number of elements contained in the Queue.
        ///     </summary>
        ///     <returns type="Number" />
        /// </signature>
    },
    "contains": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether an element is in the Queue.
        ///     </summary>
        ///     <param name="obj" type="Object">The object to locate in the Queue.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "copyTo": function () {
        /// <signature>
        ///     <summary>
        ///         Copies the Queue to an existing one-dimensional Array, starting at the specified array index.
        ///     </summary>
        ///     <param name="array" type="Array">The one-dimensional Array that is the destination of the elements copied from Queue.</param>
        ///     <param name="arrayIndex" type="Number">The zero-based index in array at which copying begins.</param>
        /// </signature>
    },
    "dequeue": function () {
        /// <signature>
        ///     <summary>
        ///         Removes and returns the object at the beginning of the Queue.
        ///     </summary>
        ///     <returns type="Object" />
        /// </signature>
    },
    "enqueue": function () {
        /// <signature>
        ///     <summary>
        ///         Adds an object to the end of the Queue.
        ///     </summary>
        ///     <param name="item" type="Object">The object to add to the Queue.</param>
        /// </signature>
    },
    "peek": function () {
        /// <signature>
        ///     <summary>
        ///        Returns the object at the beginning of the Queue without removing it.
        ///     </summary>
        ///     <returns type="Object" />
        /// </signature>
    },
    "getEnumerator": function () {
        /// <signature>
        ///     <summary>
        ///         Returns an enumerator that iterates through a Queue object.
        ///     </summary>
        ///     <returns type="Enumerator" />
        /// </signature>
    }
});




/* Stack
---------------------------------------------------------------------- */
intellisense.annotate(mx.Stack.prototype, {
    "clear": function () {
        /// <signature>
        ///     <summary>
        ///         Removes all objects from the Stack.
        ///     </summary>
        /// </signature>
    },
    "count": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the number of elements contained in the Stack.
        ///     </summary>
        ///     <returns type="Number" />
        /// </signature>
    },
    "contains": function () {
        /// <signature>
        ///     <summary>
        ///         Determines whether an element is in the Stack.
        ///     </summary>
        ///     <param name="obj" type="Object">The object to locate in the Stack.</param>
        ///     <returns type="Boolean" />
        /// </signature>
    },
    "copyTo": function () {
        /// <signature>
        ///     <summary>
        ///         Copies the Stack to an existing one-dimensional Array, starting at the specified array index.
        ///     </summary>
        ///     <param name="array" type="Array">The one-dimensional Array that is the destination of the elements copied from Stack.</param>
        ///     <param name="arrayIndex" type="Number">The zero-based index in array at which copying begins.</param>
        /// </signature>
    },
    "peek": function () {
        /// <signature>
        ///     <summary>
        ///         Returns the object at the top of the Stack without removing it.
        ///     </summary>
        ///     <returns type="Object" />
        /// </signature>
    },
    "pop": function () {
        /// <signature>
        ///     <summary>
        ///         Removes and returns the object at the top of the Stack.
        ///     </summary>
        ///     <returns type="Object" />
        /// </signature>
    },
    "push": function () {
        /// <signature>
        ///     <summary>
        ///         Inserts an object at the top of the Stack.
        ///     </summary>
        ///     <param name="obj" type="Object">The object to push onto the Stack.</param>
        /// </signature>
    },
    "getEnumerator": function () {
        /// <signature>
        ///     <summary>
        ///         Returns an enumerator that iterates through a Stack object.
        ///     </summary>
        ///     <returns type="Enumerator" />
        /// </signature>
    }
});




/* Lookup
---------------------------------------------------------------------- */
intellisense.annotate(mx.Lookup.prototype, {
    "contains": function () {
        /// <signature>
        ///   <summary>Determines whether a specified key exists in the Lookup.</summary>
        ///   <param name="key" type="Object">The key to search for in the Lookup.</param>
        ///   <returns type="Boolean" />
        /// </signature>
    },
    "count": function () {
        /// <signature>
        ///   <summary>Gets the number of key/value collection pairs in the Lookup.</summary>
        ///   <returns type="Number" />
        /// </signature>
    },
    "get": function () {
        /// <signature>
        ///   <summary>Gets the value associated with the specified key.</summary>
        ///   <param name="key" type="Object">The key of the element to add.</param>
        ///   <returns type="Enumerable" />
        /// </signature>
    },
    "getEnumerator": function () {
        /// <signature>
        ///     <summary>
        ///         Returns an enumerator that iterates through a Grouping object.
        ///     </summary>
        ///     <returns type="Enumerator" />
        /// </signature>
    }
});




/* Grouping
---------------------------------------------------------------------- */
intellisense.annotate(mx.Grouping.prototype, {
    /// <field type="Object">Gets the key of the Grouping.</field>
    "key": {},
    "count": function () {
        /// <signature>
        ///     <summary>
        ///         Gets the number of elements contained in the Grouping.
        ///     </summary>
        ///     <returns type="Number" />
        /// </signature>
    },
    "getEnumerator": function () {
        /// <signature>
        ///     <summary>
        ///         Returns an enumerator that iterates through a Grouping object.
        ///     </summary>
        ///     <returns type="Enumerator" />
        /// </signature>
    }
});




/* OrderedEnumerable
---------------------------------------------------------------------- */
intellisense.annotate(mx.OrderedEnumerable.prototype, {
    "createOrderedEnumerable": function () {
        /// <signature>
        ///     <summary>
        ///         Performs a subsequent ordering on the elements of an IOrderedEnumerable<TElement> according to a key.
        ///     </summary>
        ///     <param name="keySelector" type="Function">The selector used to extract the key for each element.</param>
        ///     <param name="comparer" type="Comparer">The Comparer used to compare keys for placement in the returned sequence.</param>
        ///     <param name="descending" type="Boolean">true to sort the elements in descending order; false to sort the elements in ascending order.</param>
        ///     <returns type="OrderedEnumerable" />
        /// </signature>
    },
    "thenBy": function () {
        /// <signature>
        ///     <summary>
        ///         Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
        ///         <br />
        ///         Returns an OrderedEnumerable whose elements are sorted according to a key.
        ///     </summary>
        ///     <param name="keySelector" type="Function">A function to extract a key from each element. eg. function(item)</param>
        ///     <returns type="OrderedEnumerable" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Performs a subsequent ordering of the elements in a sequence in ascending order by using a specified comparer.
        ///         <br />
        ///         Returns an OrderedEnumerable whose elements are sorted according to a key.
        ///     </summary>
        ///     <param name="keySelector" type="Function">A function to extract a key from each element. eg. function(item)</param>
        ///     <param name="comparer" type="Comparer">A Comparer to compare keys.</param>
        ///     <returns type="OrderedEnumerable" />
        /// </signature>
    },
    "thenByDescending": function () {
        /// <signature>
        ///     <summary>
        ///         Performs a subsequent ordering of the elements in a sequence in descending order, according to a key.
        ///         <br />
        ///         Returns an OrderedEnumerable whose elements are sorted in descending order according to a key.
        ///     </summary>
        ///     <param name="keySelector" type="Function">A function to extract a key from each element. eg. function(item)</param>
        ///     <returns type="OrderedEnumerable" />
        /// </signature>
        /// <signature>
        ///     <summary>
        ///         Performs a subsequent ordering of the elements in a sequence in descending order by using a specified comparer.
        ///         <br />
        ///         Returns an OrderedEnumerable whose elements are sorted in descending order according to a key.
        ///     </summary>
        ///     <param name="keySelector" type="Function">A function to extract a key from each element. eg. function(item)</param>
        ///     <param name="comparer" type="Comparer">A Comparer to compare keys.</param>
        ///     <returns type="OrderedEnumerable" />
        /// </signature>
    },
    "getEnumerator": function () {
        /// <signature>
        ///     <summary>
        ///         Returns an enumerator that iterates through the collection. 
        ///     </summary>
        ///     <returns type="Enumerator" />
        /// </signature>
    }
});




/* window
---------------------------------------------------------------------- */
intellisense.annotate(window, {
    "mx": mx,
    "multiplex": mx
});