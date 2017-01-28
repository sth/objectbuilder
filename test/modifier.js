
import * as B from '../src'

import assert from 'assert';

describe("Modifier()", function() {
	it("should be constructable with a function", function() {
		const mod = new B.Modifier(a => 2);
		assert(true);
	});

	it("should create new properties", function() {
		const mod = new B.Modifier(a => 2);
		const r = B.build(
			{},
			{a: mod}
		);
		assert.deepEqual(r, {a: 2});
	});

	it("should overwrite existing properties", function() {
		const mod = new B.Modifier(a => 2);
		const r = B.build(
			{a: 1},
			{a: mod}
		);
		assert.deepEqual(r, {a: 2});
	});

	it("should be called with the existing property value", function() {
		const mod = new B.Modifier(a => {
			assert.equal(a, 1);
		});
		const r = B.build(
			{a: 1},
			{a: mod}
		);
	});

	it("should be called without a value on non-existing properties", function() {
		const mod = new B.Modifier(a => {
			assert.strictEqual(a, undefined);
		});
		const r = B.build(
			{},
			{a: mod}
		);
	});
});

