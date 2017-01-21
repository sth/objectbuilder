
// The examples from the README file. Make sure they actually work.

import * as B from '../src';
import assert from 'assert';

describe("Use case", function() {
   it("build the correct debugconfig", function() {
      const config = {
          name: "sampleproject",
          compiler: {
             input: './source',
             output: './build'
          },
          plugins: ['errorlog']
      };

      const debugconfig = B.build(config, {
         // By default, new properties overwrite existing ones
         name: "sampleproject-debug",
      
         // If we want to extend an object instead of overwriting,
         // we can declare it with the object() function
         compiler: B.object({
            debugging: true
         }),
         
         // To append to arrays there is an äquivalent `array()` function
         plugins: B.array(['linter'])
      });
   
      assert.deepEqual(debugconfig, {
          name: "sampleproject-debug",
          compiler: {
             input: './source',
             output: './build',
             debugging: true
          },
          plugins: ['errorlog', 'linter']
      });
   });
});

describe("API", function() {
   describe("build()", function() {
      it("combines objects", function() {
         const r = B.build(
              {a: 1},
              {b: 2},
              {c: 3}
         );
         assert.deepEqual(r,
              {a: 1, b: 2, c: 3}
         );
      });
      it("overwrites properties", function() {
         const r = B.build(
            {a: {x: 1}},
            {a: {y: 2}}
         );
         assert.deepEqual(r,
            {a: {y: 2}}
         );
      });
   });

   describe("object()", function() {
      it("combines objects", function() {
         const r = B.build(
            {a: {x: 1}},
            {a: B.object({y: 2})}
         );
         assert.deepEqual(r,
            {a: {x: 1, y: 2}}
         );
      });
   });

   describe("array()", function() {
      it("combines array", function() {
         const r = B.build(
            {a: [1,2]},
            {a: B.array([3,4])}
         );
         assert.deepEqual(r,
            {a: [1,2,3,4]}
         );
      });
   });

   describe("customization", function() {
      it("combines strings", function() {
         function appending(tail) {
            return new B.Modifier(function(orig) {
               if (orig === undefined)
                  orig = "";
               return orig + tail;
            });
         }
         
         const config = {name: "someproject"};
         const debugconfig = B.build(
            config,
            {name: appending("-debug")}
         );
         assert.deepEqual(debugconfig, {name: "someproject-debug"});
      });
   });
});

