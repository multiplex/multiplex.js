/*--------------------------------------------------------------------------
* Multiplex.js - Comprehensive data-structure and LINQ library for JavaScript.
* Ver 0.9.2 (May 1, 2015)
*
* Created and maintained by Kamyar Nazeri <Kamyar.Nazeri@yahoo.com>
* Licensed under Apache License Version 2.0
* https://github.com/multiplex/multiplex.js
*
*--------------------------------------------------------------------------*/



declare module 'mx' {
    export = mx;
}

import multiplex = mx;

import IEnumerator = mx.IEnumerator;
import IEnumerable = mx.IEnumerable;

import Enumerator = mx.Enumerator;
import Enumerable = mx.Enumerable;
import Comparer = mx.Comparer;
import EqualityComparer = mx.EqualityComparer;
import ReadOnlyCollection = mx.ReadOnlyCollection;
import List = mx.List;
import SortedList = mx.SortedList;
import KeyValuePair = mx.KeyValuePair;
import Dictionary = mx.Dictionary;
import HashSet = mx.HashSet;
import LinkedListNode = mx.LinkedListNode;
import LinkedList = mx.LinkedList;
import Queue = mx.Queue;
import Stack = mx.Stack;


interface String extends IEnumerable<string> { }
interface Array<T> extends IEnumerable<T> { }




declare module mx {


    /* runtime module
    ---------------------------------------------------------------------- */

    /**
    * Provides a set of static methods that provide support for internal operations.
    */
    export module runtime {
        /**
        * Serves as a hash function for a particular type, suitable for use in hashing algorithms and data structures such as a hash table.
        * @param obj An object to retrieve the hash code for.
        * @param override When true, uses the overriden __hash__ function if it is defined.
        */
        function hash(obj: any, override?: boolean): number;


        /** 
        * Determines whether the specified object instances are considered equal.
        * @param objA The first object to compare.
        * @param objB The second object to compare.
        * @param override When true, uses the overriden __equals__ function if it is defined.
        */
        function equals(objA: any, objB: any, override?: boolean): boolean;


        /**
        * Performs a comparison of two objects of the same type and returns a value indicating whether one object is less than, equal to, or greater than the other.
        * @param objA The first object to compare.
        * @param objB The second object to compare.
        */
        function compare(objA: any, objB: any): number;


        /**
        * Creates A function expression from the specified string lambda expression
        * @param exp String lambda expression.
        */
        function lambda<T>(exp: string): (...args: any[]) => T;


        /**
        * Defines new or modifies existing properties directly on the specified object, returning the object.
        * @param obj The object on which to define or modify properties.
        * @param prop The name of the property to be defined or modified.
        * @param attributes The descriptor for the property being defined or modified.
        */
        function define<T>(obj: T, prop: String, attributes: PropertyDescriptor): T;


        /**
        * Extends the given object by implementing supplied members.
        * @param obj The object on which to define or modify properties.
        * @param properties Represetnts the mixin source object
        * @param attributes The descriptor for the property being defined or modified.
        */
        function mixin<T>(obj: T, properties: Object, attributes?: PropertyDescriptor): T;
    }





    /* multiplex static
    ---------------------------------------------------------------------- */

    /**
    * Gets and combines hash code for the given parameters, calls the overridden "hash" method when available.
    * @param objs Optional number of objects to combine their hash codes.
    */
    function hash(...obj: any[]): number;


    /**
    * Determines whether the specified object instances are considered equal. calls the overridden "equals" method when available.
    * @param objA The first object to compare.
    * @param objB The second object to compare.
    */
    function equals(objA: any, objB: any): boolean;


    /**
    * Determines whether the specified object instances are considered equal. calls the overridden "equals" method when available.
    * @param objA The first object to compare.
    * @param objB The second object to compare.
    * @param comparer An equality comparer to compare values.
    */
    function equals(objA: any, objB: any, comparer: IEqualityComparer<any>): boolean;


    /**
    * Extends Enumerable extension methods to the given type
    * @param type The type to extend.
    */
    function enumerableExtend(type: Function): void;





    /* Enumerator
    ---------------------------------------------------------------------- */

    /**
    * Supports a simple iteration over a collection.
    */
    interface IEnumerator<T> {

        /**
        * Advances the enumerator to the next element of the collection.
        */
        next(): boolean;

        /** 
        * Gets the element in the collection at the current position of the enumerator. 
        */
        current: T;
    }


    /**
    * Supports a simple iteration over a collection.
    */
    var Enumerator: {
        new <T>(factory: (yielder: (value: T) => any) => void): IEnumerator<T>;
    }





    /* Enumerable
    ---------------------------------------------------------------------- */

    /**
    * Exposes the enumerator, which supports a simple iteration over a collection of a specified type.
    */
    interface IEnumerable<T> {

        /** 
        * Returns an enumerator that iterates through the collection. 
        */
        getEnumerator(): IEnumerator<T>;
    }


    /**
    * An object's iterator result returned by ES6 iteretor's next() method.
    */
    interface IEnumeratorResult<T> {
        /**
        * Has the value true if the iterator is past the end of the iterated sequence. In this case value optionally specifies the return value of the iterator.
        */
        done: boolean;
        /**
        * Any JavaScript value returned by the iterator.Can be omitted when done is true.
        */
        value?: T;
    }


    /**
    * Exposes the enumerator, which supports a simple iteration over a collection of a specified type.
    */
    var Enumerable: {

        /**
        * Exposes the enumerator, which supports an iteration over the specified Enumerable object.
        * @param obj An Enumerable object.
        */
        new <T>(obj: IEnumerable<T>): IEnumerable<T>;

        /**
        * Exposes the iterator, which supports an iteration over the specified Iterable object.
        * An Iterable object, is an object that implements the @@iterator method. eg. Map, Set and Iterable objects.
        * @param obj An Iterable object that implements the @@iterator method.
        */
        new <T>(obj: { "@@iterator": () => { next: () => IEnumeratorResult<T> } }): IEnumerable<T>;

        /**
        * Defines an enumerator, which supports an iteration over the items of the specified Array object.
        * @param arr An array object.
        */
        new <T>(arr: T[]): IEnumerable<T>;

        /**
        * Defines an enumerator, which supports an iteration over the characters of the specified String object.
        * @param str A string object.
        */
        new (str: string): IEnumerable<string>;

        /**
        * Defines an enumerator, which supports an iteration over the specified Generator function.
        * @param func A Generator function.
        */
        new <T>(func: () => (yielder: (value: T) => any) => void): IEnumerable<T>;

        /**
        * Defines an enumerator, which supports an iteration over the items of the specified Array-like object.
        * An Array-like object is an object which has the "length" property, eg. arguments, jQuery
        * @param obj An Array-like object.
        */
        new <T>(obj: { length: Number }): IEnumerable<T>;

        /**
        * Defines an enumerator, which supports an iteration over the properties of the specified object.
        * @param obj A regular Object.
        */
        new <T>(obj: Object): IEnumerable<KeyValuePair<string, T>>;




        /**
        * Returns an empty Enumerable.
        */
        empty<T>(): IEnumerable<T>;

        /**
        * Detects if an object is Enumerable.
        * @param obj An object to check its Enumerability.
        */
        is(obj: any): boolean;

        /**
        * Generates a sequence of integral numbers within a specified range.
        * @param start The value of the first integer in the sequence.
        * @param count The number of sequential integers to generate.
        */
        range(start: number, count: number): IEnumerable<number>;

        /**
        * Generates a sequence that contains one repeated value.
        * @param element The value to be repeated.
        * @param count The number of times to repeat the value in the generated sequence.
        */
        repeat<T>(element: T, count: number): IEnumerable<T>;
    }





    /* Comparer
    ---------------------------------------------------------------------- */

    /**
    * Defines a method that a type implements to compare two objects.
    */
    interface IComparer<T> {
        /**
        * Compares two objects and returns a value indicating whether one is less than, equal to, or greater than the other.
        * returns An integer that indicates the relative values of x and y, as shown in the following table:
        * Less than zero x is less than y.
        * Zero x equals y.
        * Greater than zero x is greater than y..
        * @param x The first object to compare.
        * @param y The second object to compare.
        */
        compare(x: T, y: T): number;
    }



    /**
    * Provides a base class for implementations of IComparer<T> generic interface.
    */
    var Comparer: {

        /**
        * Returns a default sort order comparer for the type specified by the generic argument.
        */
        defaultComparer: IComparer<any>;

        /**
        * Creates a comparer by using the specified comparison.
        * @param comparison The comparison to use.
        */
        create<T>(comparison: (x: T, y: T) => number): IComparer<T>;
    }





    /* EqualityComparer
    ---------------------------------------------------------------------- */

    /**
    * Provides a base class for implementations of the EqualityComparer.
    */
    interface IEqualityComparer<T> {

        /**
        * Determines whether the specified objects are equal.
        * @param x The first object of type Object to compare.
        * @param y The second object of type Object to compare.
        */
        equals(x: T, y: T): boolean;


        /**
        * Returns a hash code for the specified object.
        * @param obj The Object for which a hash code is to be returned.
        */
        hash(obj: T): number
    }


    /**
    * Provides a base class for implementations of the EqualityComparer.
    */
    var EqualityComparer: {

        /**
        * Gets a default equality comparer for the type specified by the generic argument.
        */
        defaultComparer: IEqualityComparer<any>;


        /**
        * Creates an EqualityComparer by using the specified equality and hashCodeProvider.
        * @param hashCodeProvider The hashCodeProvider to use for a hash code is to be returned.
        * @param equality The equality function.
        */
        create<T>(hashCodeProvider: (obj: T) => number, equality: (x: T, y: T) => boolean): IEqualityComparer<T>;
    }





    /* Collection
    ---------------------------------------------------------------------- */

    /**
    * Initializes a new instance of the abstract Collection class.
    */
    interface ICollection<T> extends IEnumerable<T> {

        /**
        * Gets the number of elements contained in the Collection.
        */
        count(): number;


        /**
        * Copies the Collection to an existing one-dimensional Array, starting at the specified array index.
        * @param array The one-dimensional Array that is the destination of the elements copied from Dictionary keys.
        * @param arrayIndex The zero-based index in array at which copying begins.
        */
        copyTo(array: T[], arrayIndex: number): void
    }





    /* ReadOnlyCollection
    ---------------------------------------------------------------------- */

    /**
    * Initializes a new instance of the abstract Collection class.
    */
    interface IReadOnlyCollection<T> extends ICollection<T> {

        /**
        * Gets the element at the specified index.
        * @param index The zero-based index of the element to get.
        */
        [index: number]: T;


        /**
        * Gets the element at the specified index.
        * @param index The zero-based index of the element to get.
        */
        get(index: number): T


        /**
        * Determines whether the ReadOnlyCollection contains a specific value.
        * @param item The object to locate in the ReadOnlyCollection.
        */
        contains(item: T): boolean


        /**
        * Searches for the specified object and returns the zero-based index of the first occurrence within the entire ReadOnlyCollection.
        * @param item The object to locate in the ReadOnlyCollection.
        */
        indexOf(item: T): number
    }


    var ReadOnlyCollection: {

        /**
        * Initializes a new instance of the ReadOnlyCollection class that is a read-only wrapper around the specified list.
        * @param list The list to wrap.
        */
        new <T>(list: IList<T>): IReadOnlyCollection<T>
    }





    /* List
    ---------------------------------------------------------------------- */

    /**
    * Represents a strongly typed list of objects that can be accessed by index.
    */
    interface IList<T> extends ICollection<T> {

        /**
        * Gets the element at the specified index.
        * @param index The zero-based index of the element to get.
        */
        [index: number]: T;


        /**
        * Adds an object to the end of the List.
        * @param item The object to be added to the end of the List.
        */
        add(item: T): void


        /**
        * Adds the elements of the specified collection to the end of the List.
        * @param collection The collection whose elements should be added to the end of the List.
        */
        addRange(collection: IEnumerable<T>): void


        /**
        * Returns a read-only wrapper for the current list.
        */
        asReadOnly(): IReadOnlyCollection<T>


        /**
        * Searches the entire sorted List for an element using the default comparer and returns the zero-based index of the element.
        * Returns The zero-based index of item in the sorted List, if item is found; otherwise, a negative number 
        * that is the  bitwise complement of the index of the  next element that is larger than item or, if there is no larger element, 
        * the bitwise complement of List.count().
        * @param item The object to locate. The value can be null for reference types.
        */
        binarySearch(item: T): number


        /**
        * Searches the entire sorted List for an element using the specified comparer and returns the zero-based index of the element.
        * returns The zero-based index of item in the sorted List, if item is found; otherwise, a negative number 
        * that is the  bitwise complement of the index of the  next element that is larger than item or, if there is no larger element, 
        * the bitwise complement of List.count().
        * @param item The object to locate. The value can be null for reference types.
        * @param index The zero-based starting index of the range to search.
        */
        binarySearch(item: T, index: number): number


        /**
        * Searches a range of elements in the sorted List for an element using the specified comparer and returns the zero-based index of the element.
        * returns The zero-based index of item in the sorted List, if item is found; otherwise, a negative number 
        * that is the  bitwise complement of the index of the  next element that is larger than item or, if there is no larger element, 
        * the bitwise complement of List.count().
        * @param item The object to locate. The value can be null for reference types.
        * @param index The zero-based starting index of the range to search.
        * @param comparer The Comparer implementation to use when comparing elements.
        */
        binarySearch(item: T, index: number, comparer: IComparer<T>): number


        /**
        * Removes all items from the List.
        */
        clear(): void


        /**
        * Determines whether the List contains elements that match the conditions defined by the specified predicate.
        * @param match The predicate function that defines the conditions of the elements to search for.
        */
        exists(match: (item: T) => boolean): boolean


        /**
        * Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire List.
        * @param match The predicate function that defines the conditions of the elements to search for.
        */
        find(match: (item: T) => boolean): T


        /**
        * Retrieves all the elements that match the conditions defined by the specified predicate.
        * @param match The predicate function that defines the conditions of the elements to search for.
        */
        findAll(match: (item: T) => boolean): IList<T>


        /**
        * Searches for an element that matches the conditions defined by the specified predicate, 
        * and returns the zero-based index of the first occurrence within the entire List, if found; otherwise, –1.
        * @param match The predicate function that defines the conditions of the elements to search for.
        */
        findIndex(match: (item: T) => boolean): number


        /**
        * Searches for an element that matches the conditions defined by the specified predicate, 
        * and returns the zero-based index of the first occurrence within the range of elements 
        * in the List that extends from the specified index to the last element, if found; otherwise, –1.
        * @param startIndex The zero-based starting index of the search.
        * @param match The predicate function that defines the conditions of the elements to search for.
        */
        findIndex(startIndex: number, match: (item: T) => boolean): number


        /**
        * Searches for an element that matches the conditions defined by the specified predicate, 
        * and returns the zero-based index of the first occurrence within the range of elements 
        * in the List that starts at the specified index and contains the specified number of elements, if found; otherwise, –1.
        * @param startIndex The zero-based starting index of the search.
        * @param count The number of elements in the section to search.
        * @param match The predicate function that defines the conditions of the elements to search for.
        */
        findIndex(startIndex: number, count: number, match: (item: T) => boolean): number


        /**
        * Searches for an element that matches the conditions defined by the specified predicate, 
        * and returns the last occurrence within the entire List.
        * @param match The predicate function that defines the conditions of the elements to search for.
        */
        findLast(match: (item: T) => boolean): T


        /**
        * Searches for an element that matches the conditions defined by the specified predicate, 
        * and returns the zero-based index of the last occurrence within the entire List, if found; otherwise, –1.
        * @param match The predicate function that defines the conditions of the elements to search for.
        */
        findLastIndex(match: (item: T) => boolean): number


        /**
        * Searches for an element that matches the conditions defined by the specified predicate, 
        * and returns the zero-based index  of the last occurrence within the range of elements 
        * in the List that extends from the first element to the specified index, if found; otherwise, –1.
        * @param startIndex The zero-based starting index of the search.
        * @param match The predicate function that defines the conditions of the elements to search for.
        */
        findLastIndex(startIndex: number, match: (item: T) => boolean): number


        /**
        * Searches for an element that matches the conditions defined by the specified predicate, 
        * and returns the zero-based index  of the last occurrence within the range of elements 
        * in the List that contains the specified number of elements and ends at the specified index, if found; otherwise, –1.
        * @param startIndex The zero-based starting index of the search.
        * @param count The number of elements in the section to search.
        * @param match The predicate function that defines the conditions of the elements to search for.
        */
        findLastIndex(startIndex: number, count: number, match: (item: T) => boolean): number


        /**
        * Performs the specified action on each element of the List.
        * @param action The action function to perform on each element of the List.
        */
        forEach(action: (item: T) => void): void


        /**
        * Gets the element at the specified index.
        * @param index The zero-based index of the element to get.
        */
        get(index: number): T


        /**
        * Creates a shallow copy of a range of elements in the source List.
        * @param index The zero-based List index at which the range starts.
        * @param count The number of elements in the range.
        */
        getRange(index: number, count: number): IList<T>


        /**
        *   Searches for the specified object and returns the zero-based index of the first occurrence within the entire List, if found; otherwise, –1.
        *   @param item The object to locate in the List.
        */
        indexOf(item: T): number


        /**
        *   Searches for the specified object and returns the zero-based index of the first occurrence within 
        *   the range of elements in the List that extends from the specified index to the last element, if found; otherwise, –1.
        *   @param item The object to locate in the List.
        *   @param index The zero-based starting index of the search. 0 (zero) is valid in an empty list.
        */
        indexOf(item: T, index: number): number


        /**
        * Inserts an element into the List at the specified index.
        * @param index The zero-based index at which item should be inserted.
        * @param item The object to insert. The value can be null for reference types.
        */
        insert(index: number, item: T): void


        /**
        * Inserts the elements of a collection into the List at the specified index.
        * @param index The zero-based index at which item should be inserted.
        * @param collection The collection whose elements should be inserted into the List.
        */
        insertRange(index: number, collection: IEnumerable<T>): void


        /**
        * Gets an Array wrapper around the List.
        */
        items(): T[]


        /**
        *   Searches for the specified object and returns the zero-based index of the last occurrence within the entire List, if found; otherwise, –1.
        *   @param item The object to locate in the List. 
        */
        lastIndexOf(item: T): number


        /**
        *   Searches for the specified object and returns the zero-based index of the last occurrence 
        *   within the range of elements in the List that extends from the specified index to the last element if found; otherwise, –1.
        *   @param item The object to locate in the List. 
        *   @param index The zero-based starting index of the search. 0 (zero) is valid in an empty list.
        */
        lastIndexOf(item: T, index: number): number


        /**
        * Removes the first occurrence of a specific object from the List.
        * @param item The object to remove from the List.
        */
        remove(item: T): boolean


        /**
        * Removes all the elements that match the conditions defined by the specified predicate.
        * @param match The predicate function that defines the conditions of the elements to remove.
        */
        removeAll(match: (item: T) => boolean): number


        /**
        * Removes the element at the specified index of the List.
        * @param index The zero-based index of the element to remove.
        */
        removeAt(index: number): void


        /**
        * Removes a range of elements from the List.
        * @param index The zero-based index of the element to remove.
        * @param count The number of elements to remove.
        */
        removeRange(index: number, count: number): void


        /**
        * Reverses the order of the elements in the entire List
        */
        reverse(): any


        /**
        * Reverses the order of the elements in the entire List
        * @param index The zero-based starting index of the range to reverse.
        * @param count The number of elements in the range to reverse.
        */
        reverse(index: number, count: number): void


        /**
        * Sets the element at the specified index.
        * @param index The zero-based index of the element to set.
        * @param item The object to be added at the specified index.
        */
        set(index: number, value: T): void


        /**
        * Sorts the elements in the entire List using the default comparer.
        */
        sort(): void


        /**
        * Sorts the elements in the entire List using the specified Comparison.
        * @param comparison The comparison function to use when comparing elements.
        */
        sort(comparison: (x: T, y: T) => number): void


        /**
        * Sorts the elements in the entire List using the specified comparer.
        * @param comparer The Comparer implementation to use when comparing elements.
        */
        sort(comparer: IComparer<T>): void


        /**
        * Sorts the elements in a range of elements in List using the specified comparer.
        * @param index The zero-based starting index of the range to sort.
        * @param count The length of the range to sort.
        * @param comparer The Comparer implementation to use when comparing elements.
        */
        sort(index: number, count: number, comparer: IComparer<T>): void


        /**
        * Copies the elements of the List to a new array.
        */
        toArray(): T[]


        /**
        * Determines whether every element in the List matches the conditions defined by the specified predicate.
        * @param match The Predicate function that defines the conditions to check against the elements.
        */
        trueForAll(match: (item: T) => boolean): boolean
    }


    var List: {

        /**
        * Initializes a new instance of the List class that is empty.
        */
        new <T>(): IList<T>


        /**
        * Initializes a new instance of the List class that is empty and has the specified initial capacity.
        * @param capacity The number of elements that the new list can initially store.
        */
        new <T>(capacity: number): IList<T>


        /**
        * Initializes a new instance of the List class that contains elements copied from the specified arguments
        * @param args Arbitrary number of arguments to copy to the new list.
        */
        new <T>(...args: T[]): IList<T>


        /**
        * Initializes a new instance of the List class that contains elements copied from the specified collection 
        * and has sufficient capacity to accommodate the number of elements copied.
        * @param collection The collection whose elements are copied to the new list.
        */
        new <T>(collection: IEnumerable<T>): IList<T>
    }





    /* SortedList
    ---------------------------------------------------------------------- */

    /**
    * Represents a collection of key/value pairs that are sorted by key based on the associated Comparer implementation.
    */
    interface ISortedList<TKey, TValue> extends ICollection<KeyValuePair<TKey, TValue>> {

        /**
        * Adds an element with the specified key and value into the SortedList.
        * @param key The key of the element to add.
        * @param value The value of the element to add. The value can be null for reference types.
        */
        add(key: TKey, value: TValue): void


        /**
        * Gets the value associated with the specified key.
        * @param key The key whose value to get.
        */
        get(key: TKey): TValue


        /**
        * Gets or sets the number of elements that the SortedList can contain.
        * @param value The number of elements that the SortedList can contain.
        */
        capacity(value: number): number


        /**
        * Removes all elements from the SortedList.
        */
        clear(): void


        /**
        * Gets the Comparer for the sorted list.
        */
        comparer(): IEqualityComparer<TKey>


        /**
        * Determines whether the SortedList contains a specific key.
        * @param key The key to locate in the SortedList.
        */
        containsKey(key: TKey): boolean


        /**
        * Determines whether the SortedList contains a specific value.
        * @param value The value to locate in the SortedList.
        */
        containsValue(value: TValue): boolean


        /**
        * Gets a collection containing the keys in the SortedList, in sorted order.
        */
        keys(): TKey[]


        /**
        * Gets a collection containing the values in the SortedLis.
        */
        values(): TValue[]


        /**
        * Searches for the specified key and returns the zero-based index within the entire SortedList.
        * @param key The key to locate in the SortedList.
        */
        indexOfKey(key: TKey): number


        /**
        * Searches for the specified value and returns the zero-based index of the first occurrence within the entire SortedList.
        * @param value The value to locate in the SortedList.
        */
        indexOfValue(value: TValue): number


        /**
        * Removes the element with the specified key from the SortedList.
        * Returns true if the element is successfully removed; otherwise, false. This method also returns false if key was not found in the original SortedList.
        * @param key The key of the element to remove.
        */
        remove(key: TKey): boolean


        /**
        * Removes the element at the specified index of the SortedList.
        * @param index The zero-based index of the element to remove.
        */
        removeAt(index: number): void


        /**
        * Sets the value associated with the specified key.
        * @param key The key whose value to get or set.
        * @param value The value associated with the specified key.
        */
        set(key: TKey, value: TValue): void


        /**
        * Sets the capacity to the actual number of elements in the SortedList, if that number is less than 90 percent of current capacity.
        */
        trimExcess(): void


        /**
        * Gets the value associated with the specified key.
        * @param key The key whose value to get.
        * @param callback When this method returns, callback method is called with the value
        * associated with the specified key, if the key is found; otherwise, null for the type of the value parameter.
        */
        tryGetValue(key: TKey, callback: (value: TValue) => void): boolean
    }


    var SortedList: {

        /**
        * Initializes a new instance of the SortedList class that is empty, 
        * has the default initial capacity, and uses the default Comparer.
        */
        new <TKey, TValue>(): ISortedList<TKey, TValue>


        /**
        * Initializes a new instance of the SortedList class that contains elements  copied from the specified Dictionary, 
        * has sufficient capacity to accommodate the number of elements copied,  and uses the default Comparer.
        * @param dictionary The Dictionary whose elements are copied to the new SortedList.
        */
        new <TKey, TValue>(dictionary: IDictionary<TKey, TValue>): ISortedList<TKey, TValue>


        /**
        * Initializes a new instance of the SortedList class that is empty, 
        * has the default initial capacity, and uses the specified Comparer.
        * @param comparer The Comparer implementation to use when comparing keys.-or-null to use the default Comparer for the type of the key.
        */
        new <TKey, TValue>(comparer: IComparer<TKey>): ISortedList<TKey, TValue>


        /**
        * Initializes a new instance of the SortedList class that is empty, 
        * has the specified initial capacity, and uses the default Comparer.
        * @param capacity The initial number of elements that the SortedList can contain.
        */
        new <TKey, TValue>(capacity: number): ISortedList<TKey, TValue>


        /**
        * Initializes a new instance of the SortedList class that contains elements copied from the specified Dictionary,
        * has sufficient capacity to accommodate the number of elements copied, and uses the specified Comparer.
        * @param dictionary The Dictionary whose elements are copied to the new SortedList.
        * @param comparer The Comparer implementation to use when comparing keys.-or-null to use the default Comparer for the type of the key.
        */
        new <TKey, TValue>(dictionary: IDictionary<TKey, TValue>, comparer: IComparer<TKey>): ISortedList<TKey, TValue>


        /**
        * Initializes a new instance of the SortedList class that is empty, 
        * has the specified initial capacity, and uses the specified Comparer.
        * @param capacity The initial number of elements that the SortedList can contain.
        * @param comparer The Comparer implementation to use when comparing keys.-or-null to use the default Comparer for the type of the key.
        */
        new <TKey, TValue>(capacity: number, comparer: IComparer<TKey>): ISortedList<TKey, TValue>
    }





    /* KeyValuePair
    ---------------------------------------------------------------------- */

    /**
    * Initializes a new instance of the abstract Collection class.
    */
    class KeyValuePair<TKey, TValue> {

        /**
        * Initializes a new instance of the KeyValuePair with the specified key and value.
        * @param key The object defined in each key/value pair.
        * @param value The definition associated with key.
        */
        constructor(key: TKey, value: TValue);

        /**
        * Gets the key in the key/value pair.
        */
        public key: TKey;


        /**
        * Gets the value in the key/value pair.
        */
        public value: TValue;
    }





    /* Dictionary
    ---------------------------------------------------------------------- */

    /**
    * Initializes a new instance of the abstract Collection class.
    */
    interface IDictionary<TKey, TValue> extends ICollection<KeyValuePair<TKey, TValue>> {

        /**
        * Adds an element with the provided key and value to the Dictionary.
        * @param key The object to use as the key of the element to add.
        * @param value The object to use as the value of the element to add.
        */
        add(key: TKey, value: TValue): void


        /**
        * Removes all keys and values from the Dictionary.
        */
        clear(): void


        /**
        * Determines whether the Dictionary contains the specified key.
        * @param key The key to locate in the Dictionary.
        */
        containsKey(key: TKey): boolean


        /**
        * Determines whether the Dictionary contains a specific value.
        * @param value The value to locate in the Dictionary.
        */
        containsValue(value: TValue): boolean


        /**
        * Copies the Dictionary keys to an existing one-dimensional Array, starting at the specified array index.
        * @param array The one-dimensional Array that is the destination of the elements copied from Dictionary keys.
        * @param arrayIndex The zero-based index in array at which copying begins.
        */
        copyTo(array: TKey[], arrayIndex: number): void
        copyTo(array: KeyValuePair<TKey, TValue>[], arrayIndex: number): void


        /**
        * Gets a Array containing the keys of the Dictionary.
        */
        keys(): TKey[]


        /**
        * Gets a Array containing the values in the Dictionary.
        */
        values(): TValue[]


        /**
        * Gets element with the specified key.
        * @param key The key of the element to get.
        */
        get(key: TKey): TValue


        /**
        * Sets the element with the specified key.
        * @param key The key of the element to set.
        * @param value The object to use as the value of the element to set.
        */
        set(key: TKey, value: TValue): void


        /**
        * Gets the value associated with the specified key.
        * @param key The key whose value to get.
        * @param callback When this method returns, callback method is called with the value
        * associated with the specified key, if the key is found; otherwise, null for the type of the value parameter.
        */
        tryGetValue(key: TKey, callback: (value: TValue) => void): boolean


        /**
        * Removes the element with the specified key from the Dictionary.
        * @param key The key of the element to remove.
        */
        remove(key: TKey): boolean
    }


    var Dictionary: {

        /**
        * Initializes a new instance of the Dictionary class that is empty, 
        */
        new <TKey, TValue>(): IDictionary<TKey, TValue>


        /**
        * Initializes a new instance of the Dictionary class that contains elements copied 
        * from the specified Dictionary and uses the default equality comparer for the key type.
        * @param dictionary The Dictionary whose elements are copied to the new Dictionary.
        */
        new <TKey, TValue>(dictionary: IDictionary<TKey, TValue>): IDictionary<TKey, TValue>


        /**
        * Initializes a new instance of the Dictionary class that is empty, and uses the specified EqualityComparer.
        * @param comparer The EqualityComparer implementation to use when comparing keys.
        */
        new <TKey, TValue>(comparer: IEqualityComparer<TKey>): IDictionary<TKey, TValue>


        /**
        * Initializes a new instance of the Dictionary class that is empty, has the specified initial capacity, and uses the default equality comparer for the key type.
        * @param capacity The initial number of elements that the Dictionary can contain.
        */
        new <TKey, TValue>(capacity: number): IDictionary<TKey, TValue>


        /**
        * Initializes a new instance of the Dictionary that is empty, has the specified initial capacity, and uses the specified EqualityComparer.
        * @param capacity The initial number of elements that the Dictionary can contain.
        * @param comparer The EqualityComparer implementation to use when comparing keys.
        */
        new <TKey, TValue>(capacity: number, comparer: IEqualityComparer<TKey>): IDictionary<TKey, TValue>


        /**
        * Initializes a new instance of the Dictionary class that contains elements copied 
        * from the specified Dictionary and uses the specified EqualityComparer.
        * @param dictionary The Dictionary whose elements are copied to the new Dictionary.
        * @param comparer The EqualityComparer implementation to use when comparing keys.
        */
        new <TKey, TValue>(dictionary: IDictionary<TKey, TValue>, comparer: IEqualityComparer<TKey>): IDictionary<TKey, TValue>
    }





    /* HashSet
    ---------------------------------------------------------------------- */

    /**
    * Represents a set of values.
    */
    interface IHashSet<T> extends ICollection<T> {

        /**
        * Adds an element to the current set.
        * @param item The element to add to the set.
        */
        add(item: T): boolean


        /**
        * Removes all elements from a HashSet object.
        */
        clear(): void


        /**
        * Copies the elements of a HashSet object to an array.
        * @param array The one-dimensional array that is the destination of the elements copied from the HashSet object.
        */
        copyTo(array: T[]): void


        /**
        * Copies the elements of a HashSet object to an array. starting at the specified array index.
        * @param array The one-dimensional array that is the destination of the elements copied from the HashSet object.
        * @param arrayIndex The zero-based index in array at which copying begins.
        */
        copyTo(array: T[], arrayIndex: number): void


        /**
        * Copies the elements of a HashSet object to an array.
        * @param array The one-dimensional array that is the destination of the elements copied from the HashSet object.
        * @param arrayIndex The zero-based index in array at which copying begins.
        * @param count The number of elements to copy to array.
        */
        copyTo(array: T[], arrayIndex: number, count: number): void


        /**
        * Gets the EqualityComparer object that is used to determine equality for the values in the set.
        */
        comparer(): IEqualityComparer<T>


        /**
        * Removes the specified element from a HashSet object.
        * @param item The element to remove.
        */
        remove(item: T): boolean


        /**
        * Removes all elements that match the conditions defined by the specified predicate from a HashSet collection.
        * @param match The predicate function that defines the conditions of the elements to remove.
        */
        removeWhere(match: (item: T) => boolean): number


        /**
        * Removes all elements in the specified collection from the current set.
        * @param other The collection of items to remove from the set.
        */
        exceptWith(other: IEnumerable<T>): void


        /**
        * Modifies the current set so that it contains only elements that are also in a specified collection.
        * @param other The collection to compare to the current set.
        */
        intersectWith(other: IEnumerable<T>): void


        /**
        * Determines whether the current set is a proper (strict) subset of a specified collection.
        * @param other The collection to compare to the current set.
        */
        isProperSubsetOf(other: IEnumerable<T>): boolean


        /**
        * Determines whether the current set is a proper (strict) superset of a specified collection.
        * @param other The collection to compare to the current set.
        */
        isProperSupersetOf(other: IEnumerable<T>): boolean


        /**
        * Determines whether a set is a subset of a specified collection.
        * @param other The collection to compare to the current set.
        */
        isSubsetOf(other: IEnumerable<T>): boolean


        /**
        * Determines whether the current set is a superset of a specified collection.
        * @param other The collection to compare to the current set.
        */
        isSupersetOf(other: IEnumerable<T>): boolean


        /**
        * Determines whether the current set overlaps with the specified collection.
        * @param other The collection to compare to the current set.
        */
        overlaps(other: IEnumerable<T>): boolean


        /**
        * Determines whether the current set and the specified collection contain the same elements.
        * @param other The collection to compare to the current set.
        */
        setEquals(other: IEnumerable<T>): boolean


        /**
        * Modifies the current set so that it contains only elements that are present
        * either in the current set or in the specified collection, but not both.
        * @param other The collection to compare to the current set.
        */
        symmetricExceptWith(other: IEnumerable<T>): void


        /**
        * Modifies the current set so that it contains all elements that are present
        * in either the current set or the specified collection.
        * @param other The collection to compare to the current set.
        */
        unionWith(other: IEnumerable<T>): void

    }


    var HashSet: {

        /**
        * Initializes a new instance of the HashSet class that is empty and uses the default equality comparer for the set type.
        */
        new <T>(): IHashSet<T>


        /**
        * Initializes a new instance of the HashSet class that uses the default equality comparer for the set type, 
        * and contains elements copied from the specified collection.
        * @param collection The collection whose elements are copied to the new set.
        */
        new <T>(collection: IEnumerable<T>): IHashSet<T>


        /**
        * Initializes a new instance of the HashSet class that is empty and uses the specified equality comparer for the set type.
        * @param comparer The EqualityComparer implementation to use when comparing values in the set.
        */
        new <T>(comparer: IEqualityComparer<T>): IHashSet<T>


        /**
        * Initializes a new instance of the HashSet class that uses the specified equality comparer for the set type, 
        * contains elements copied from the specified collection, and uses the specified equality comparer for the set type.
        * @param collection The collection whose elements are copied to the new set.
        * @param comparer The EqualityComparer implementation to use when comparing values in the set.
        */
        new <T>(collection: IEnumerable<T>, comparer: IEqualityComparer<T>): IHashSet<T>
    }





    /* LinkedListNode
    ---------------------------------------------------------------------- */

    /**
    * Represents a node in a LinkedList.
    */
    class LinkedListNode<T> {

        /**
        * Initializes a new instance of the LinkedListNode class, containing the specified value.
        * @param value The value to contain in the LinkedListNode
        */
        constructor(value: T);


        /**
        * Gets the value contained in the node.
        */
        public value(): T


        /**
        * Gets the LinkedList that the LinkedListNode belongs to.
        */
        public list(): ILinkedList<T>


        /**
        * Gets the next node in the LinkedList.
        */
        public next(): LinkedListNode<T>


        /**
        * Gets the previous node in the LinkedList.
        */
        public previous(): LinkedListNode<T>
    }





    /* LinkedList
    ---------------------------------------------------------------------- */

    /**
    * Represents a doubly linked list.
    */
    interface ILinkedList<T> extends ICollection<T> {

        /**
        * Adds an item to the LinkedList.
        * @param item The object to add to the LinkedList.
        */
        add(item: T): void


        /**
        * Removes all nodes from the LinkedList.
        */
        clear(): void


        /**
        * Determines whether a value is in the LinkedList.
        * @param value The value to locate in the LinkedList. The value can be null for reference types.
        */
        contains(item: T): boolean


        /**
        * Gets the first node of the LinkedList.
        */
        getFirst(): LinkedListNode<T>


        /**
        * Gets the last node of the LinkedList.
        */
        getLast(): LinkedListNode<T>


        /**
        * Adds the specified new node after the specified existing node in the LinkedList and returns the new LinkedListNode.
        * @param node The LinkedListNode after which to insert newNode.
        * @param newNode The new LinkedListNode to add to the LinkedList.
        */
        addAfter(node: LinkedListNode<T>, newNode: LinkedListNode<T>): LinkedListNode<T>


        /**
        * Adds the specified new node after the specified existing node in the LinkedList.
        * returns The new LinkedListNode containing value.
        * @param node The LinkedListNode after which to insert newNode.
        * @param value The value to add to the LinkedList.
        */
        addAfter(node: LinkedListNode<T>, value: T): LinkedListNode<T>


        /**
        * Adds the specified new node before the specified existing node in the LinkedList.
        * returns The new LinkedListNode.
        * @param node The LinkedListNode before which to insert newNode.
        * @param newNode The new LinkedListNode to add to the LinkedList.
        */
        addBefore(node: LinkedListNode<T>, newNode: LinkedListNode<T>): LinkedListNode<T>


        /**
        * Adds the specified new node before the specified existing node in the LinkedList.
        * returns The new LinkedListNode containing value.
        * @param node The LinkedListNode before which to insert newNode.
        * @param value The value to add to the LinkedList.
        */
        addBefore(node: LinkedListNode<T>, value: T): LinkedListNode<T>


        /**
        * Adds the specified new node at the start of the LinkedList.
        * returns The new LinkedListNode.
        * @param node The new LinkedListNode to add at the start of the LinkedList.
        */
        addFirst(node: LinkedListNode<T>): LinkedListNode<T>


        /**
        * Adds the specified new node at the start of the LinkedList.
        * returns The new LinkedListNode containing value.
        * @param value The value to add at the start of the LinkedList.
        */
        addFirst(value: T): LinkedListNode<T>


        /**
        * Adds the specified new node at the end of the LinkedList.
        * returns The new LinkedListNode. 
        * @param node The new LinkedListNode to add at the end of the LinkedList.
        */
        addLast(node: LinkedListNode<T>): LinkedListNode<T>


        /**
        * Adds the specified new node at the end of the LinkedList.
        * returns The new LinkedListNode containing value.
        * @param value The value to add at the end of the LinkedList.
        */
        addLast(value: T): LinkedListNode<T>


        /**
        * Finds the first node that contains the specified value.
        * @param value The value to locate in the LinkedList.
        */
        find(value: T): LinkedListNode<T>


        /**
        * Finds the last node that contains the specified value.
        * @param value The value to locate in the LinkedList.
        */
        findLast(value: T): LinkedListNode<T>

        /**
        * Removes the node at the start of the LinkedList.
        * returns true if the node is successfully removed; otherwise, false. 
        * This method also returns false if value was not found in the original LinkedList.
        * @param node
        */
        remove(node: LinkedListNode<T>): boolean


        /**
        * Removes the first occurrence of the specified value from the LinkedList.
        * returns true if the element containing value is successfully removed; otherwise, false. 
        * This method also returns false if value was not found in the original LinkedList.
        * @param value The value to remove from the LinkedList.
        */
        remove(value: T): boolean


        /**
        * Removes the node at the start of the LinkedList.
        */
        removeFirst(): void


        /**
        * Removes the node at the end of the LinkedList.
        */
        removeLast(): void
    }


    var LinkedList: {

        /**
        * Initializes a new instance of the LinkedList class that is empty.
        */
        new <T>(): ILinkedList<T>


        /**
        * Initializes a new instance of the LinkedList class that contains elements copied from the specified Enumerable.
        * @param collection The collection to copy elements from.
        */
        new <T>(collection: IEnumerable<T>): ILinkedList<T>
    }





    /* Queue
    ---------------------------------------------------------------------- */

    /**
    * Represents a first-in, first-out collection of objects.
    */
    interface IQueue<T> extends ICollection<T> {

        /**
        * Removes all objects from the Queue.
        */
        clear(): void


        /**
        * Determines whether an element is in the Queue.
        * @param item The object to locate in the Queue.
        */
        contains(item: T): boolean


        /**
        * Removes and returns the object at the beginning of the Queue.
        */
        dequeue(): T

        /**
        * Adds an object to the end of the Queue.
        * @param item The object to add to the Queue.
        */
        enqueue(item: T): void


        /**
        * Returns the object at the beginning of the Queue without removing it.
        */
        peek(): T


        /**
        * Copies the Queue to a new array.
        */
        toArray(): T[]
    }


    var Queue: {

        /**
        * Initializes a new instance of the Queue class that is empty.
        */
        new <T>(): IQueue<T>


        /**
        * Initializes a new instance of the Queue class that contains elements copied from the specified collection.
        * @param collection The collection to copy elements from.
        */
        new <T>(collection: IEnumerable<T>): IQueue<T>
    }





    /* Stack
    ---------------------------------------------------------------------- */

    /**
    * Represents a variable size last-in-first-out (LIFO) collection of instances of the same arbitrary type.
    */
    interface IStack<T> extends ICollection<T> {

        /**
        * Removes all objects from the Stack.
        */
        clear(): void


        /**
        * Determines whether an element is in the Stack.
        * @param item The object to locate in the Stack.
        */
        contains(item: T): boolean


        /**
        * Returns the object at the top of the Stack without removing it.
        */
        peek(): T


        /**
        *   Removes and returns the object at the top of the Stack.
        */
        pop(): T


        /**
        * Inserts an object at the top of the Stack.
        * @param item The object to push onto the Stack. 
        */
        push(item: T): void


        /**
        *   Copies the Stack to a new array.
        */
        toArray(): T[]
    }


    var Stack: {

        /**
        * Initializes a new instance of the Stack class that is empty.
        */
        new <T>(): IStack<T>


        /**
        * Initializes a new instance of the Stack class that contains elements copied from the specified collection.
        * @param collection The collection to copy elements from.
        */
        new <T>(collection: IEnumerable<T>): IStack<T>
    }





    /* Lookup
    ---------------------------------------------------------------------- */

    /**
    * Defines a data structures that map keys to Enumerable sequences of values.
    */
    interface ILookup<TKey, TElement> extends ICollection<IGrouping<TKey, TElement>> {

        /**
        * Determines whether a specified key exists in the Lookup.
        * @param key The key to search for in the Lookup.
        */
        contains(key: TKey): boolean
        contains(item: IGrouping<TKey, TElement>): boolean



        /**
        * Gets the value associated with the specified key.
        * @param key The key of the element to add.
        */
        get(key: TKey): IEnumerable<TElement>
    }





    /* Grouping
    ---------------------------------------------------------------------- */

    /**
    * Represents a collection of objects that have a common key.
    */
    interface IGrouping<TKey, TElement> extends ICollection<TElement> {

        /**
        * Gets the key of the Grouping.
        */
        key: TKey
    }





    /* OrderedEnumerable
    ---------------------------------------------------------------------- */

    /**
    * Exposes the enumerator, which supports a simple iteration over a collection of a specified type.
    */
    interface IOrderedEnumerable<TElement> extends IEnumerable<TElement> {

        /**
        * Performs a subsequent ordering on the elements of an IOrderedEnumerable<TElement> according to a key.
        * @param keySelector The selector used to extract the key for each element.
        * @param comparer The Comparer used to compare keys for placement in the returned sequence.
        * @param descending true to sort the elements in descending order; false to sort the elements in ascending order.
        */
        createOrderedEnumerable<TKey>(keySelector: (item: TElement) => TKey, comparer: IComparer<TKey>, descending: boolean): IOrderedEnumerable<TElement>


        /**
        * Performs a subsequent ordering of the elements in a sequence in descending order, according to a key.
        * Returns an OrderedEnumerable whose elements are sorted in descending order according to a key.
        * @param keySelector A function to extract a key from each element.
        */
        thenBy<TKey>(keySelector: (item: TElement) => TKey): IOrderedEnumerable<TElement>


        /**
        * Performs a subsequent ordering of the elements in a sequence in ascending order by using a specified comparer.
        * Returns an OrderedEnumerable whose elements are sorted according to a key.
        * @param keySelector A function to extract a key from each element.
        * @param comparer A Comparer to compare keys.
        */
        thenBy<TKey>(keySelector: (item: TElement) => TKey, comparer: IComparer<TKey>): IOrderedEnumerable<TElement>


        /**
        * Performs a subsequent ordering of the elements in a sequence in descending order, according to a key.
        * Returns an OrderedEnumerable whose elements are sorted in descending order according to a key.
        * @param keySelector A function to extract a key from each element.
        */
        thenByDescending<TKey>(keySelector: (item: TElement) => TKey): IOrderedEnumerable<TElement>


        /**
        * Performs a subsequent ordering of the elements in a sequence in descending order, according to a key.
        * Returns an OrderedEnumerable whose elements are sorted in descending order according to a key.
        * @param keySelector A function to extract a key from each element. 
        * @param comparer A Comparer to compare keys.
        */
        thenByDescending<TKey>(keySelector: (item: TElement) => TKey, comparer: IComparer<TKey>): IOrderedEnumerable<TElement>
    }





    /* EnumerableExtensions
    ---------------------------------------------------------------------- */

    /**
    * Defines Enumerable extention methods, applies on String, Array and Enumerable
    */
    interface IEnumerable<T> {

        /**
        * Applies an accumulator function over a sequence.
        * Returns the final accumulator value.
        * @param func An accumulator function to be invoked on each element.
        */
        aggregate(func: (accumulate: T, item: T) => T): T


        /**
        * Applies an accumulator function over a sequence. The specified seed value is used as the initial accumulator value.
        * Returns the final accumulator value.
        * @param seed The initial accumulator value.
        * @param func An accumulator function to be invoked on each element.
        */
        aggregate<TAccumulate>(seed: TAccumulate, func: (accumulate: TAccumulate, item: T) => TAccumulate): TAccumulate


        /**
        * Applies an accumulator function over a sequence. The specified seed value is used as the initial accumulator value, 
        * and the specified function is used to select the result value.
        * Returns the final accumulator value.
        * @param seed The initial accumulator value.
        * @param func An accumulator function to be invoked on each element. 
        * @param resultSelector A function to transform the final accumulator value into the result value.
        */
        aggregate<TAccumulate, TResult>(seed: TAccumulate, func: (accumulate: TAccumulate, item: T) => TAccumulate, resultSelector: (accumulate: TAccumulate) => TResult): TResult;


        /**
        * Determines whether all elements of a sequence satisfy a condition.
        * Returns true if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
        * @param predicate A function to test each element for a condition. 
        */
        all(predicate: (item: T) => boolean): boolean


        /**
        * Determines whether a sequence contains any elements.
        * Returns true if the source sequence contains any elements; otherwise, false.
        */
        any(): boolean


        /**
        * Determines whether any element of a sequence satisfies a condition.
        * Returns true if any elements in the source sequence pass the test in the specified predicate; otherwise, false.
        * @param predicate A function to test each element for a condition. 
        */
        any(predicate: (item: T) => boolean): boolean


        /**
        * Returns the input typed as Enumerable.
        */
        asEnumerable(): IEnumerable<T>


        /**
        * Computes the average of a sequence of numeric values.
        */
        average(): number


        /**
        * Computes the average of a sequence of numeric values that are obtained by invoking a transform function on each element of the input sequence.
        * @param selector A transform function to apply to each element. 
        */
        average(selector: (item: number) => number): number


        /**
        * Concatenates two sequences.
        * @param second The sequence to concatenate to the first sequence.
        */
        concat(second: IEnumerable<T>): IEnumerable<T>


        /**
        * Determines whether a sequence contains a specified element by using the default equality comparer.
        * @param value The value to locate in the sequence.
        */
        contains(value: T): boolean


        /**
        * Returns the last element of a sequence that satisfies a specified condition.
        * @param value The value to locate in the sequence.
        * @param comparer An equality comparer to compare values.
        */
        contains(value: T, comparer: IEqualityComparer<T>): boolean


        /**
        * Returns the number of elements in a sequence.
        */
        count(): number


        /**
        * Returns a number that represents how many elements in the specified sequence satisfy a condition.
        * @param predicate A function to test each element for a condition. 
        */
        count(predicate: (item: T) => boolean): number


        /**
        * Returns the elements of the specified sequence or null if the sequence is empty.
        */
        defaultIfEmpty(): IEnumerable<T>


        /**
        * Returns the elements of the specified sequence or the specified value in  a singleton collection if the sequence is empty.
        * @param defaultValue The value to return if the sequence is empty.
        */
        defaultIfEmpty(defaultValue: T): IEnumerable<T>


        /**
        * Returns distinct elements from a sequence by using the default equality comparer to compare values.
        */
        distinct(): IEnumerable<T>


        /**
        * Produces the set difference of two sequences by using the EqualityComparer to compare values.
        * @param comparer An EqualityComparer to compare values.
        */
        distinct(comparer: IEqualityComparer<T>): IEnumerable<T>


        /**
        * Produces the set difference of two sequences by using the default equality comparer to compare values.
        * @param second An Enumerable whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
        */
        except(second: IEnumerable<T>): IEnumerable<T>


        /**
        * Produces the set difference of two sequences by using the specified EqualityComparer to compare values.
        * @param second An Enumerable whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
        * @param comparer An EqualityComparer to compare values.
        */
        except(second: IEnumerable<T>, comparer: IEqualityComparer<T>): IEnumerable<T>


        /**
        * Returns the element at a specified index in a sequence. Throws an error if the index is less than 0 or greater than or equal to the number of elements in source.
        * @param index The zero-based index of the element to retrieve.
        */
        elementAt(index: number): T


        /**
        * Returns the first element of a sequence. this method throws an exception if there is no element in the sequence.
        */
        first(): T


        /**
        * Returns the first element in a sequence that satisfies a specified condition. this method throws an exception if there is no element in the sequence.
        * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
        */
        first(predicate: (item: T) => boolean): T


        /**
        * Returns the first element of a sequence, or null if the sequence contains no elements.
        */
        firstOrDefault(): T


        /**
        * Returns the first element of the sequence that satisfies a condition or null if no such element is found.
        * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
        */
        firstOrDefault(predicate: (item: T) => boolean): T


        /**
        * Returns the first element of the sequence that satisfies a condition or a default value if no such element is found.
        * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
        * @param defaultValue The value to return if no element exists with specified condition.
        */
        firstOrDefault(predicate: (item: T) => boolean, defaultValue: T): T


        /**
        * Performs the specified action on each element of an Enumerable.
        * @param action The action function to perform on each element of an Enumerable.
        */
        forEach(action: (item: T) => void): void


        /**
        * Performs the specified action on each element of an Enumerable.
        * @param action The action function to perform on each element of an Enumerable; the second parameter of the function represents the index of the source element.
        */
        forEach(action: (item: T, index: number) => void): void


        /**
        * Groups the elements of a sequence according to a specified key selector function.
        * @param keySelector A function to extract the key for each element.
        */
        groupBy<TKey>(keySelector: (item: T) => TKey): IEnumerable<IGrouping<TKey, T>>;


        /**
        * Groups the elements of a sequence according to a specified key selector function.
        * @param keySelector A function to extract the key for each element.
        * @param comparer An equality comparer to compare values.
        */
        groupBy<TKey>(keySelector: (item: T) => TKey, comparer: IEqualityComparer<TKey>): IEnumerable<IGrouping<TKey, T>>;


        /**
        * Groups the elements of a sequence according to a specified key selector function and projects the elements for each group by using a specified function.
        * @param keySelector A function to extract the key for each element.
        * @param elementSelector A function to map each source element to an element in the Grouping.
        */
        groupBy<TKey, TElement>(keySelector: (item: T) => TKey, elementSelector: (item: T) => TElement): IEnumerable<IGrouping<TKey, TElement>>;


        /**
        * Groups the elements of a sequence according to a key selector function. 
        * The keys are compared by using a comparer and each group's elements are projected by using a specified function.
        * @param keySelector A function to extract the key for each element. 
        * @param elementSelector A function to map each source element to an element in the Grouping.
        * @param comparer An equality comparer to compare values.
        */
        groupBy<TKey, TElement>(keySelector: (item: T) => TKey, elementSelector: (item: T) => TElement, comparer: IEqualityComparer<TKey>): IEnumerable<IGrouping<TKey, TElement>>;


        /**
        * Groups the elements of a sequence according to a specified key selector function and projects the elements for each group by using a specified function.
        * @param keySelector A function to extract the key for each element. 
        * @param elementSelector A function to map each source element to an element in the Grouping. 
        * @param resultSelector A function to extract the key for each element.
        */
        groupBy<TKey, TElement, TResult>(keySelector: (item: T) => TKey, elementSelector: (item: T) => TElement, resultSelector: (key: TKey, elements: IEnumerable<TElement>) => TResult): IEnumerable<TResult>;


        /**
        * Groups the elements of a sequence according to a key selector function. 
        * The keys are compared by using a comparer and each group's elements are projected by using a specified function.
        * @param keySelector A function to extract the key for each element.
        * @param elementSelector A function to map each source element to an element in the Grouping.
        * @param resultSelector A function to extract the key for each element.
        * @param comparer An equality comparer to compare values.
        */
        groupBy<TKey, TElement, TResult>(keySelector: (item: T) => TKey, elementSelector: (item: T) => TElement, resultSelector: (key: TKey, elements: IEnumerable<TElement>) => TResult, comparer: IEqualityComparer<TKey>): IEnumerable<TResult>;


        /**
        * Correlates the elements of two sequences based on equality of keys and groups the results. The default equality comparer is used to compare keys.
        * @param inner The sequence to join to the current sequence.
        * @param outerKeySelector A function to extract the join key from each element of the first sequence. 
        * @param innerKeySelector A function to extract the join key from each element of the second sequence.
        * @param resultSelector A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.
        */
        groupJoin<TInner, TKey, TResult>(inner: IEnumerable<TInner>, outerKeySelector: (item: T) => TKey, innerKeySelector: (item: TInner) => TKey, resultSelector: (outer: T, inner: IEnumerable<TInner>) => TResult): IEnumerable<TResult>;


        /**
        * Correlates the elements of two sequences based on key equality and groups the results. A specified EqualityComparer is used to compare keys.
        * @param inner The sequence to join to the current sequence.
        * @param outerKeySelector A function to extract the join key from each element of the first sequence. 
        * @param innerKeySelector A function to extract the join key from each element of the second sequence.
        * @param resultSelector A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.
        * @param comparer An equality comparer to compare values.
        */
        groupJoin<TInner, TKey, TResult>(inner: IEnumerable<TInner>, outerKeySelector: (item: T) => TKey, innerKeySelector: (item: TInner) => TKey, resultSelector: (outer: T, inner: IEnumerable<TInner>) => TResult, comparer: IEqualityComparer<TKey>): IEnumerable<TResult>;


        /**
        * Produces the set intersection of two sequences by using the default equality comparer to compare values.
        * @param second An Enumerable whose distinct elements that also appear in the first sequence will be returned.
        */
        intersect(second: IEnumerable<T>): IEnumerable<T>;


        /**
        * Produces the set intersection of two sequences by using the default equality comparer to compare values.
        * @param second An Enumerable whose distinct elements that also appear in the first sequence will be returned.
        * @param comparer An EqualityComparer to compare values.
        */
        intersect(second: IEnumerable<T>, comparer: IEqualityComparer<T>): IEnumerable<T>;


        /**
        * Correlates the elements of two sequences based on matching keys. The default equality comparer is used to compare keys.
        * @param inner The sequence to join to the current sequence.
        * @param outerKeySelector A function to extract the join key from each element of the first sequence.
        * @param innerKeySelector A function to extract the join key from each element of the second sequence.
        * @param resultSelector A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.
        */
        join<TInner, TKey, TResult>(inner: IEnumerable<TInner>, outerKeySelector: (item: T) => TKey, innerKeySelector: (item: TInner) => TKey, resultSelector: (outer: T, inner: TInner) => TResult): IEnumerable<TResult>;


        /**
        * Correlates the elements of two sequences based on matching keys. A specified EqualityComparer is used to compare keys.
        * @param inner The sequence to join to the current sequence.
        * @param outerKeySelector A function to extract the join key from each element of the first sequence.
        * @param innerKeySelector A function to extract the join key from each element of the second sequence.
        * @param resultSelector A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.
        * @param comparer An equality comparer to compare values.
        */
        join<TInner, TKey, TResult>(inner: IEnumerable<TInner>, outerKeySelector: (item: T) => TKey, innerKeySelector: (item: TInner) => TKey, resultSelector: (outer: T, inner: TInner) => TResult, comparer: IEqualityComparer<TKey>): IEnumerable<TResult>;


        /**
        * Returns the last element of a sequence.
        */
        last(): T


        /**
        * Returns the last element of a sequence that satisfies a specified condition.
        * @param predicate A function to test each source element for a condition.
        */
        last(predicate: (item: T) => boolean): T


        /**
        * Returns the first element of a sequence, or null if the sequence contains no elements.
        */
        lastOrDefault(): T


        /**
        * Returns the last element of a sequence, or null if the sequence contains no elements.
        * @param predicate A function to test each source element for a condition.
        */
        lastOrDefault(predicate: (item: T) => boolean): T


        /**
        * Returns the last element of a sequence that satisfies a condition or null if no such element is found.
        * @param predicate A function to test each source element for a condition.
        * @param defaultValue The value to return if no element exists with specified condition.
        */
        lastOrDefault(predicate: (item: T) => boolean, defaultValue: T): T


        /**
        * Returns the maximum value in a sequence of values.
        */
        max(): T


        /**
        * Invokes a transform function on each element of a sequence and returns the maximum value.
        * @param selector A transform function to apply to each element.
        */
        max<TResult>(selector: (item: T) => TResult): TResult


        /**
        * Returns the minimum value in a sequence of values.
        */
        min(): T


        /**
        * Invokes a transform function on each element of a sequence and returns the minimum value.
        * @param selector A transform function to apply to each element.
        */
        min<TResult>(selector: (item: T) => TResult): TResult


        /**
        * Filters the elements of an Enumerable based on a specified type.
        * @param type The type to filter the elements of the sequence on.
        */
        ofType<TResult>(type: { new (...args: any[]): TResult }): IEnumerable<TResult>


        /**
        * Sorts the elements of a sequence in ascending order by using a specified comparer.
        * @param keySelector A function to extract a key from each element.
        */
        orderBy<TKey>(keySelector: (item: T) => TKey): IOrderedEnumerable<T>


        /**
        * Sorts the elements of a sequence in ascending order by using a specified comparer.
        * Returns an OrderedEnumerable whose elements are sorted according to a key.
        * @param keySelector A function to extract a key from each element.
        * @param comparer A Comparer to compare keys.
        */
        orderBy<TKey>(keySelector: (item: T) => TKey, comparer: IEqualityComparer<TKey>): IOrderedEnumerable<T>


        /**
        * Sorts the elements of a sequence in descending order by using a specified comparer.
        * Returns an OrderedEnumerable whose elements are sorted according to a key.
        * Returns an OrderedEnumerable whose elements are sorted in descending order according to a key.
        * @param keySelector A function to extract a key from each element.
        */
        orderByDescending<TKey>(keySelector: (item: T) => TKey): IOrderedEnumerable<T>


        /**
        * Sorts the elements of a sequence in descending order by using a specified comparer.
        * Returns an OrderedEnumerable whose elements are sorted in descending order according to a key.
        * @param keySelector A function to extract a key from each element.
        * @param comparer A Comparer to compare keys.
        */
        orderByDescending<TKey>(keySelector: (item: T) => TKey, comparer: IEqualityComparer<TKey>): IOrderedEnumerable<T>


        /**
        * Inverts the order of the elements in a sequence.
        */
        reverse(): IEnumerable<T>


        /**
        * Determines whether two sequences are equal by comparing the elements by using the default equality comparer for their type.
        * @param second An Enumerable to compare to the first sequence.
        */
        sequenceEqual(second: IEnumerable<T>): boolean


        /**
        * Determines whether two sequences are equal by comparing their elements by using a specified EqualityComparer.
        * @param second An Enumerable to compare to the first sequence.
        * @param comparer The EqualityComparer to compare values.
        */
        sequenceEqual(second: IEnumerable<T>, comparer: IEqualityComparer<T>): boolean


        /**
        * Projects each element of a sequence into a new form.
        * @param selector A transform function to apply to each source element.
        */
        select<TResult>(selector: (item: T) => TResult): IEnumerable<TResult>


        /**
        * Projects each element of a sequence into a new form by incorporating the element's index.
        * @param selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
        */
        select<TResult>(selector: (item: T, index: number) => TResult): IEnumerable<TResult>


        /**
        * Projects each element of a sequence to an Enumerable and flattens the resulting sequences into one sequence.
        * @param collectionSelector A transform function to apply to each source element.
        */
        selectMany<TResult>(selector: (item: T) => IEnumerable<TResult>): IEnumerable<TResult>;


        /**
        * Projects each element of a sequence to an Enumerable and flattens the resulting sequences into one sequence. The index of each source element is used in the projected form of that element.
        * @param collectionSelector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
        */
        selectMany<TResult>(selector: (item: T, index: number) => IEnumerable<TResult>): IEnumerable<TResult>;


        /**
        * Projects each element of a sequence to an Enumerable and flattens the resulting sequences into one sequence.
        * @param collectionSelector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
        * @param resultSelector A transform function to apply to each element of the intermediate sequence.
        */
        selectMany<TCollection, TResult>(collectionSelector: (item: T) => IEnumerable<TCollection>, resultSelector: (item: T, collection: TCollection) => TResult): IEnumerable<TResult>;


        /**
        * Projects each element of a sequence to an Enumerable and flattens the resulting sequences into one sequence. The index of each source element is used in the projected form of that element.
        * @param collectionSelector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
        * @param resultSelector A transform function to apply to each element of the intermediate sequence.
        */
        selectMany<TCollection, TResult>(collectionSelector: (item: T, index: number) => IEnumerable<TCollection>, resultSelector: (item: T, collection: TCollection) => TResult): IEnumerable<TResult>;


        /**
        * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
        */
        single(): T


        /**
        * Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.
        * @param predicate A function to test each source element for a condition.
        */
        single(predicate: (item: T) => boolean): T


        /**
        * Returns the only element of a sequence, or a null if the sequence is empty; this method throws an exception if there is more than one element in the sequence.
        */
        singleOrDefault(): T


        /**
        * Returns the only element of a sequence that satisfies a specified condition or a null if no such element exists; this method throws an exception if more than one element satisfies the condition.
        * @param predicate A function to test each source element for a condition.
        */
        singleOrDefault(predicate: (item: T) => boolean): T


        /**
        * Returns the only element of a sequence that satisfies a specified condition or a default value if no such element exists; this method throws an exception if more than one element satisfies the condition.
        * @param predicate A function to test each source element for a condition.
        * @param defaultValue The value to return if no element exists with specified condition.
        */
        singleOrDefault(predicate: (item: T) => boolean, defaultValue: T): T


        /**
        * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
        * @param count The number of elements to skip before returning the remaining elements.
        */
        skip(count: number): IEnumerable<T>


        /**
        * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
        * @param predicate A function to test each source element for a condition.
        */
        skipWhile(predicate: (item: T) => boolean): IEnumerable<T>


        /**
        * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements. The element's index is used in the logic of the predicate function.
        * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
        */
        skipWhile(predicate: (item: T, index: number) => boolean): IEnumerable<T>


        /**
        * Computes the sum of a sequence of values.
        */
        sum(): number


        /**
        * Computes the sum of the sequence of values that are obtained by invoking a transform function on each element of the input sequence.
        * @param selector A transform function to apply to each element.
        */
        sum(selector: (item: number) => number): number


        /**
        * Returns a specified number of contiguous elements from the start of a sequence.
        * @param count The number of elements to return.
        */
        take(count: number): IEnumerable<T>


        /**
        * Returns elements from a sequence as long as a specified condition is true.
        * @param predicate A function to test each source element for a condition.
        */
        takeWhile(predicate: (item: T) => boolean): IEnumerable<T>


        /**
        * Returns elements from a sequence as long as a specified condition is true. The element's index is used in the logic of the predicate function.
        * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
        */
        takeWhile(predicate: (item: T, index: number) => boolean): IEnumerable<T>


        /**
        * Creates an array from an Enumerable.
        */
        toArray(): T[]


        /**
        * Creates a Dictionary from an Enumerable according to a specified key selector function.
        * @param keySelector A function to extract a key from each element.
        */
        toDictionary<TKey>(keySelector: (item: T) => TKey): IDictionary<TKey, T>;


        /**
        * Creates a Dictionary from an Enumerable according to specified key selector and comparer.
        * @param keySelector A function to extract a key from each element.
        * @param comparer An equality comparer to compare values.
        */
        toDictionary<TKey>(keySelector: (item: T) => TKey, comparer: IEqualityComparer<TKey>): IDictionary<TKey, T>;


        /**
        * Creates a Dictionary from an Enumerable according to specified key selector and element selector functions.
        * @param keySelector A function to extract a key from each element.
        * @param elementSelector A transform function to produce a result element value from each element.
        */
        toDictionary<TKey, TElement>(keySelector: (item: T) => TKey, elementSelector: (item: T) => TElement): IDictionary<TKey, TElement>;


        /**
        * Creates a Dictionary from an Enumerable according to a specified key selector function, a comparer, and an element selector function.
        * @param keySelector A function to extract a key from each element.
        * @param elementSelector A transform function to produce a result element value from each element.
        * @param comparer An equality comparer to compare values.
        */
        toDictionary<TKey, TElement>(keySelector: (item: T) => TKey, elementSelector: (item: T) => TElement, comparer: IEqualityComparer<TKey>): IDictionary<TKey, TElement>;


        /**
        * Creates a List from an Enumerable.
        */
        toList(): IList<T>


        /**
        * Creates a Lookup from an Enumerable according to a specified key selector function.
        * @param keySelector A function to extract a key from each element.
        */
        toLookup<TKey>(keySelector: (item: T) => TKey): ILookup<TKey, T>;


        /**
        * Creates a Lookup from an Enumerable according to a specified key selector function and comparer.
        * @param keySelector A function to extract a key from each element.
        * @param comparer An equality comparer to compare values.
        */
        toLookup<TKey>(keySelector: (item: T) => TKey, comparer: IEqualityComparer<TKey>): ILookup<TKey, T>;


        /**
        * Creates a Lookup from an Enumerable according to specified key selector and element selector functions.
        * @param keySelector A function to extract a key from each element.
        * @param elementSelector A transform function to produce a result element value from each element.
        */
        toLookup<TKey, TElement>(keySelector: (item: T) => TKey, elementSelector: (item: T) => TElement): ILookup<TKey, TElement>;


        /**
        * Creates a Lookup from an Enumerable according to a specified key selector function, a comparer and an element selector function.
        * @param keySelector A function to extract a key from each element.
        * @param elementSelector A transform function to produce a result element value from each element.
        * @param comparer An equality comparer to compare values.
        */
        toLookup<TKey, TElement>(keySelector: (item: T) => TKey, elementSelector: (item: T) => TElement, comparer: IEqualityComparer<TKey>): ILookup<TKey, TElement>;


        /**
        * Produces the set union of two sequences by using the default equality comparer.
        * @param second An Enumerable whose distinct elements form the second set for the union.
        */
        union(second: IEnumerable<T>): IEnumerable<T>


        /**
        * Produces the set union of two sequences by using a specified EqualityComparer.
        * @param second An Enumerable whose distinct elements form the second set for the union.
        * @param comparer The EqualityComparer to compare values.
        */
        union(second: IEnumerable<T>, comparer: IEqualityComparer<T>): IEnumerable<T>


        /**
        * Filters a sequence of values based on a predicate.
        * @param predicate A function to test each source element for a condition.
        */
        where(predicate: (item: T) => boolean): IEnumerable<T>;


        /**
        * Filters a sequence of values based on a predicate. Each element's index is used in the logic of the predicate function.
        * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
        */
        where(predicate: (item: T, index: number) => boolean): IEnumerable<T>;


        /**
        * Merges two sequences by using the specified predicate function.
        * @param second The second sequence to merge.
        * @param resultSelector A function that specifies how to merge the elements from the two sequences.
        */
        zip<TSecond, TResult>(second: IEnumerable<TSecond>, resultSelector: (first: T, second: TSecond) => TResult): IEnumerable<TResult>;

    }
}





/* mx
---------------------------------------------------------------------- */

/**
* Exposes the enumerator, which supports an iteration over the specified Enumerable object.
* @param obj An Enumerable object.
*/
declare function mx<T>(obj: IEnumerable<T>): IEnumerable<T>


/**
* Exposes the iterator, which supports an iteration over the specified Iterable object.
* An Iterable object, is an object that implements the @@iterator method. eg. Map, Set and Iterable objects.
* @param obj An Iterable object that implements the @@iterator method.
*/
declare function mx<T>(obj: { "@@iterator": () => { next: () => mx.IEnumeratorResult<T> } }): IEnumerable<T>


/**
* Defines an enumerator, which supports an iteration over the items of the specified Array object.
* @param arr An array object.
*/
declare function mx<T>(arr: T[]): IEnumerable<T>


/**
* Defines an enumerator, which supports an iteration over the characters of the specified String object.
* @param str A string object.
*/
declare function mx(str: string): IEnumerable<string>


/**
* Defines an enumerator, which supports an iteration over the specified Generator function.
* @param func A Generator function.
*/
declare function mx<T>(func: () => (yielder: (value: T) => any) => void): IEnumerable<T>


/**
* Defines an enumerator, which supports an iteration over the items of the specified Array-like object.
* An Array-like object is an object which has the "length" property, eg. arguments, jQuery
* @param obj An Array-like object.
*/
declare function mx<T>(obj: { length: Number }): IEnumerable<T>


/**
* Defines an enumerator, which supports an iteration over the properties of the specified object.
* @param obj A regular Object.
*/
declare function mx<T>(obj: Object): IEnumerable<KeyValuePair<string, T>>