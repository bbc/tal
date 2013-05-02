---
layout: default
title: Coding Guidelines
---

# TV Application Layer Coding Standards & Guidelines

TAL JavaScript development uses the following coding standards. Some of these are mandatory, some are not. For some of these issues there are arguments for and against. The most value to a team is not, particularly, from the individual guidelines themselves but more from the fact they encourage consistency. Which, in turn, improves readability. As ever the best reference for the TAL coding standards is the source code itself and anything not covered here can be deduced from a quick read of the source code.

This document was written with reference to the following

[Google JavaScript Coding Standards](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)

[Mozilla Developer Network Coding Standards](https://developer.mozilla.org/en-US/docs/Developer_Guide/Coding_Style)

## Syntactic Issues

Syntactic issues are generally a subjective choice but are, never the less, important as they impose a consistent style and therefore aid readability.

### Indentation - 4 spaces

4 spaces should always be used over tabs. Some of our source files use tabs and it is acceptable to reformat those files if a developer find themselves working on such a file. However care should be taken and the scheduled work should be completed first, committed then reformatted - this will make it clearer which parts of the code have actually had changes over and above the tabs/space reformatting.

### Maximum Line Length - *80 chars*

The length of Comments and Documentation should be limited to 80 characters. In general, lines of code should have no limit on their length unless there is a clear case where splitting the line would improve readability. 

### Code Comments - *Encouraged*

Use comments of the "this was done because" type...

```js
  //This is to allow the data to bind before the interface is shown.
```

Do not use "this does" type of comments...

```js 
  //Loop around the widgets to find the widget with the given ID
```
 If the code is written correctly and appropriate variable names chosen then a quick scan of the code should reveal what it does. If code is being written with reference to an article or web page then a comment including the URL to that resource is helpful. If a particular algorithm is being used then make reference to the common name of the algorithm.

### JSDoc - *Required*

Always use [JSDoc](http://en.wikipedia.org/wiki/JSDoc) style comments to annotate Classes and APIs. Including all parameters, return values, accessibility, types, exceptions thrown and any edges cases.

### Braces - *Line End*

Braces should appear at the end of a line and after a single space. The closing brace should be indented to match the indentation of the line of code that holds the starting brace.

    if (importantVariable === true) {
        importantFunction();
    } 


For ```if``` Statements with an ```else``` case the ```else``` should be on the same line as the closing brace


    if (importantVariable === true) {
         importantFunction();
    } else {
         notSoImportantFunction();
    }


These rules apply for all compound statements. ```while```, ```for```, ```switch```, etc. The same conventions apply for any text representing JSON data.

Prefer single quotes over double quotes - though in JavaScript there is no difference. Single quotes are considered better due to HTML using double quotes, which would need to be escaped if the single quotes were not used.

### Naming - *camelCase*

Functions and Variables should use lower camelCase. Constructor functions should use PascalCase. Choose descriptive names which are not overly long. Single letter names like ```i``` and ```j``` are acceptable for iterators and loops. Constants should be all UPPERCASE with underscores separating words. 

    //When naming constants use all uppercase with words separated by _
    HorizontalCarousel.ALIGNMENT_CENTER = 0;

### Conditional Statements - *Braced*

Always use braced code blocks when writing control statements ( ```if```, ```for```, ```switch```, etc )

    if (goodIf === true) {
         safeAndReadable();
    }


```If```'s without a braced code block are more easily broken when extra statements are added...


    if (badIf == true)
         notSafe();
         easilyMissThatThisFunctionIsNotExecuted()



### Comma Operator - *No*

Do not use the comma operator to place multiple statements on a single line. It does not aid readability and can complicate debugging.

### Non Function Blocks - *No*

Non-function code blocks should not be used. JavaScript does not support block scope and using non-function code blocks harms readability.

## Semantic

Semantic issues are less subjective, though not completely so. However, most of the items listed below are accepted industry practice, arrived at due to valid reasoning in regards to readability, security and performance. 

Keep in mind that TAL runs on a wide variety of devices and some of the guidelines detailed here may need to be deviated from, or completely rethought to accommodate known device issues.

### Var Declarations - *Use ```var```*

Always use the ```var``` keyword when declaring variables. Declaring variables without the ```var``` keyword is legal but will add the name to the global namespace. This is rarely what is intended and is often said to pollute the global name space.

### Comparison Operator - *Use Strict Versions*

JavaScript supports strict ( ```===/!==``` ) and type-converting ( ```==/!=``` ) comparisons. See [Mozilla Comparison Operators]( https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/Comparison_Operators ) for a good overview. The type conversion rules are complicated and therefore the strict comparison operator is preferred unless a particular type conversion effect is required...

### Iteration - *Arrays, ```for i```*. *Objects, ```for in```*

When iterating over Arrays always use a standard ```for``` loop - never the ```for``` ```in``` style of loop. Doing so will iterate over all members even those inherited from the prototype. For Example...


    Array.prototype.foo = "Boom!"
    myArray = [ 1,2,3 ]
    for (var x in myArray) {
         console.log( myArray[ x ] );
    }


This produces the following output:


    1
    2
    3
    Boom!


When Iterating over Objects the only way *is* to use the ```for``` ```in``` construct. This will iterate over all members even those inherited from the object's prototype. If this is not the required functionality then hasOwnProperty should be used to filter out any unwanted members. Like so...

    for (var prop in obj) { 
        if(obj.hasOwnProperty(prop)){    
            // prop is not inherited  
        } 
    }



### Object and Array Literals - *Use Literals*

When declaring new instance of an Object or an Array prefer using the Object and Array literal notation. 

    var myObject = {};
    var myArray = {};


This form is more readable and is also shorter. In JavaScript it possible to override the Object class. This means that calling ```new Object()``` would return an instance of the overridden object - using an Object literal guarantees that the object returned is a vanilla JavaScript Object.

### Associative Arrays - *No*

Never use arrays as a map, hash or an associative array. Always use a plain object. Arrays only work as an associative construct because they inherit from ```Object``` - the associative functionality comes from the ```Object``` class not the ```Array``` class.

### Triadic Operator (?) - *Sparingly*

JavaScript supports a triadic If. 

    var a = (something === true) ? thisvalue : thatvalue;

It can help readability but should be used sparingly and never used in a compound/nested way.

### Function Declaration In Blocks - *No*

This construct...


      if (x) {  
          function foo() {} 
    }


is support by most JavaScript engines but it is not defined in the ECMAScript spec. This alternative should be used instead...


      if (x) { 
          var foo = function() {} 
    }


### Wrapper Objects - *No*

JavaScript has several wrapper types, classes that wrap primitive types. These classes are ```Boolean```, ```String```, and ```Number```. Never use these directly to create primitives...


      var x = new Boolean(false);
      if (x) { 
          alert('hi');  // Shows 'hi'. 
    }

There is no reason to use them and as the code example shows they give unexpected results.

### Methods On Objects - *Use Prototype*

When adding methods to objects the preference is to add the method to the constructor's prototype.


    Function MyConstructor(){
    }
    MyConstructor.myMethod = function() {}

To add the method inside the constructor via the this reference would cause the method to be duplicated for each instance of the object created. Increasing the memory overhead for each object instantiated.

### Members On Objects - *In Constructor*
Adding members to an object should be done in the Constructor.

### Delete - *No, Except For Hashes*

Normally the only time ```delete``` should be needed is to remove items from a hash. Use ```null``` when a reference to an object is no longer needed...


    this.mediaPlayer = null


Delete can be slow as it has to manipulate the underlying object.

### Eval - *No*

```eval``` should only be required for RPC like systems and then only use with care. Using ```eval``` can lead to injection attacks. It can make debugging harder and ```eval```uated code is often *not* optimized by the JavaScript engine.

### With Keyword - *No*

Do not use ```with```. It reduces readability considerable and makes code harder to debug.


    myObject = { x: 10 }
    with (MyObject) {
         var x = 3;
        console.log( x );
    }


In this case ```var x``` looks like a local variable but has actually modified ```myObject.x```

### Modifying Built-In Types - *No*

Modifying Built-In types is considered bad. A built-in type may have already been altered by another library or library code might be using ```for...in``` style iteration over arrays and adding to the ```Array``` class could have side effects.


### This Vs Self Vs That - *Use Self*

When using the ```this``` reference the programmer needs to be very aware of the calling context. As this example shows...


    function MyObject(){
         this.x = 10;
         this.callback = function() { return this.x }
    }
    var x = 0;
    var myObject = new MyObject();
    var callback = myObject.callback()
    callback()



At this point the ```this``` reference points to the ```Window``` object and will return a value of **0** instead of the expected **10**

Re-writing the constructor to use...


    function MyObject(){
      var self = this;
      this.x = 10;
      this.callback = function() { 
                          return self.x;
                       }
    }


causes the ```self``` variable to be *closed-over* by the ```callback``` function. Now ```self``` always references ```this``` in the expected context.

The TAL code base generally uses ```self``` rather than ```that``` - some care should be taken because ```self``` is used as a pseudonym for the ```Window``` instance.


In some cases it may be beneficial to use ```bind``` to ensure the expected context for a function...


   function MyObject(){
           this.x = 10;
           function callback(){
                return this.x
           }
           this.callback = callback.bind( this );
    }
    var x = 0;
    var myObject = new MyObject();
    var callback = myObject.callback()

Because ```callback``` has been *bound* to a specific object this example returns the expected value of 10. 

Summary - only use 'this' in constructors and to setup 'self' closures.

### Unary Increment - *Rarely*

Use in simple cases. In general it does not aid readability when used in non trivial expressions.

### JSHint - *Yes*

Use of JSHint is highly encouraged. Many of the worst JavaScript offences can be detected way before the code is deployed. Nearly every IDE will have support, or a plugin to add JSHint functionality.

[JSHint For Eclipse](http://github.eclipsesource.com/jshint-eclipse/)

[JSHint For Sublime](https://github.com/uipoet/sublime-jshint)

These are the current setting used for developing in the TAL code base...

```
browser: true,
onevar: false,
smarttabs: true,
curly: true,
eqeqeq: true,
forin: true,
immed: true,
newcap: true,
noarg: true,
nonew: true,
plusplus: true,
undef: true, 
unused: true
```

And these define the most common global variables found in the TAL codebase and TAL unit tests.

```
require: true,
antie: true,
sinon: true,
assert: true,
expectAsserts: true,
assertEquals: true,
queuedRequire: true,
queuedApplicationInit: true,
queuedComponentInit: true,
assertClassName: true,
assertSame: true,
assertNotEquals: true,
assertException: true,
assertFalse: true,
assertTrue: true,
assertNull: true,
assertInstanceOf: true,
assertNoException: true,
assertMatch: true,
assertNotNull: true,
assertNotSame: true,
assertUndefined: true,
assertNotUndefined: true,
AsyncTestCase: true,
jstestdriver: true
```









