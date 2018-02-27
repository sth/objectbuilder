
// The examples from the README file. Make sure they actually work.

import * as B from '../src';
import assert from 'assert';

describe("Examples from Readme file", function() {
	describe("Use case", function() {
		it("builds the correct debugconfig", function() {
			const someconfig = {
				 name: "sampleproject",
				 compiler: {
					 input: './source',
					 output: './build'
				 },
				 plugins: ['errorlog']
			};

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

			it("removes properties with `remove`", function() {
				const r = B.build(
					{a: 1, b: 2},
					{b: B.remove}
				);
				assert.deepEqual(r,
					{a: 1}
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
			});
			
			it("converts to uppercase", function() {
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
			});
		});
	});
});

