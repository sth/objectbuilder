# objectbuilder

`objectbuilder` provides a simple and flexible interface to create
modified copies of nested javascript objects.

## Use case

Configuration of npm modules is often done by creating fairly complicated
nested JavaScript object literals:

```javascript
const someconfig = {
   name: "sampleproject",
   compiler: {
      input: './source',
      output: './build'
   },
   plugins: ['errorlog']
};
```
It is useful to have a flexible way to create modified versions of such
objects. For example we could create specialized configurations for
production and debugging. This package provides a flexible way to do so:

```javascript
import * as B from 'objectbuilder';

const debugconfig = B.build(someconfig, {
   // By default, new properties overwrite existing ones
   name: "sampleproject-debug",

   // If we want to extend an object instead of overwriting,
   // we can declare it with the `object()` function
   compiler: B.object({
      debugging: true
   }),

   // To append to arrays there is an equivalent `array()` function
   plugins: B.array(['linter'])
});
```

The resulting `debugconfig` looks like this:

```javascript
{
   name: "sampleproject-debug",
   compiler: {
      input: './source',
      output: './build',
      debugging: true
   },
   plugins: ['errorlog', 'linter']
}
```

## Installation

With `npm`:

```shell
npm install --save objectbuilder
```

Or `yarn`:

```shell
yarn add objectbuilder
```


## Main API

### Combining objects: `build(obj1, obj2, ...)`

`build()` is the main function, and it simply combines objects by copying
all the properties to a new object:

```javascript
const r = B.build(
   {a: 1},
   {b: 2},
   {c: 3}
);
assert.deepEqual(r,
   {a: 1, b: 2, c: 3}
);
```

`build()` always creates a new object and doesn't modify the input objects.

By default, `build()` does a simple "shallow" assignment, where property values on
later objects overwrite those on earlier objects, even if they are themselves
objects:

```javascript
const r = B.build(
   {a: {x: 1}},
   {a: {y: 2}}
);
assert.deepEqual(r,
   {a: {y: 2}}
);
```

The result object contains the `a` property from the second parameter given to
`build()`. The `a` property for the first parameter got copied to the result
but then was overwritten by the `a` property of the second parameter.

### Combining subobjects: `object(props, ...)`

If a subobject shouldn't overwrite existing properties, but instead extend them,
this can be declared with the `object()` function. It tells `build()` to
combine the new properties with existing ones (if any):

```javascript
const r = B.build(
   {a: {x: 1}},
   {a: B.object({y: 2})}
);
assert.deepEqual(r,
   {a: {x: 1, y: 2}}
);
```

You can nest `object()` declarations and specify exactly which properties
should overwrite or extend existing properties.

#### Removing properties

`objectbuilder` exports a special constant `remove`, which can be used to
mark properties that should be removed from the combined result.

```javascript
const r = B.build(
   {a: 1, b: 2},
   {b: B.remove}
);
assert.deepEqual(r,
   {a: 1}
);
```


#### `object.extend(props, ...)`

This is just a different name for the `object()` function that describes
its functionality better.

### Combining arrays: `array(items, ...)`

The same situation can also occur when properties are arrays. By default
`build()` overwrites existing arrays, but you can mark a property with
`array()` to declare that it should extend existing arrays
instead of overwriting:

```javascript
const r = B.build(
   {a: [1,2]},
   {a: B.array([3,4])}
);
assert.deepEqual(r,
   {a: [1,2,3,4]}
);
```

#### `array_append(items, ...)`

This is just a different name for the `array()` function that describes
its functionality better.

#### `array_prepend(items, ...)`

Extends existing arrays like `array()` or `array.append()`, but inserts
the new elements at the beginning instead of the end.


## Customization

`objectbuilder` can easily be customized if you want to modify you objects in
different ways.

### Custom handling of properties: `modify()`

The modules exports a `modify()` function that can be used to adjust the handling
of properties by `build()` to your liking. For example, lets say you want
to have a string that gets appended to an existing string:

```javascript
function string_append(tail) {
   return B.modify(function(orig) {
      if (orig === undefined)
         orig = "";
      return orig + tail;
   });
}

const someconfig = {name: "someproject"};
const debugconfig = B.build(
   someconfig,
   {name: string_append("-debug")}
);
assert.deepEqual(debugconfig, {name: "someproject-debug"});
```

The function given to `modify()` is called whenever `build()`
needs to apply the new property to an object it is building. It gets the old
value of the property as an parameter and is expected to return the new
value.

### Modifying existing properties

Instead of *combining* existing properties with new values, `objectbuilder`'s
customization can also be used create modifications of the existing values.

For example, you can create a modifier that converts existing property values
to upper case:

```javascript
function uppercase() {
   return B.modify(function(orig) {
      if (orig === undefined)
         return undefined;
      return orig.toUpperCase();
   });
}

const original = {name: "someproject"};
const modified = B.build(
   original,
   {name: uppercase()}
);
assert.deepEqual(modified, {name: "SOMEPROJECT"});
```

