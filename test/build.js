
import * as B from '../src'

import assert from 'assert';

describe('helper function assign()', function() {
	it("should assign properties", function() {
		var o = {};
		B.assign(o, {a: 1, b: 2});
		assert.deepEqual(o, {a: 1, b: 2});
	});

	it("should still have original properties", function() {
		var o = {a: 1};
		B.assign(o, {b: 2});
		assert.deepEqual(o, {a: 1, b: 2});
	});

	it("should override original properties", function() {
		var o = {a: 1};
		var r = B.assign(o, {a: 2});
		assert.deepEqual(o, {a: 2});
	});

	it("should combine properties of all arguments", function() {
		var o = {};
		B.assign(o, {a: 1}, {b: 2}, {c: 3});
		assert.deepEqual(o, {a: 1, b: 2, c: 3});
	});

	it("should override earlier arguments with later ones", function() {
		var o = {a: 1};
		var r = B.assign(o, {a: 2}, {a: 3});
		assert.deepEqual(o, {a: 3});
	});

	it("should keep subobjects", function() {
		var o = {};
		var so = {x: 1};
		B.assign(o, {a: so});
		assert.strictEqual(o.a, so);
	});

	it("should work without any extension objects", function() {
		var o = {a: 1};
		B.assign(o);
		assert.deepEqual(o, {a: 1});
	});
});


describe('build()', function() {
	it("should return combined argument", function() {
		var r = B.build({a: 1}, {b: 2}, {c: 3});
		assert.deepEqual(r, {a: 1, b: 2, c: 3});
	});

	if("should not return first argument", function() {
		var o = {a: 1};
		var r = B.build(o);
		assert.notStrictEqual(o, r);
	});

	it("should not modify first argument", function() {
		var o = {a: 1};
		var r = B.build(o, {b: 2}, {c: 3});
		assert.deepEqual(o, {a: 1});
	});

	it("should handle an empty argument list", function() {
		var r = B.build();
		assert.deepEqual(r, {});
	});

	it("should copy objects and arrays as references", function() {
		var obj = {a: 1};
		var arr = [1];
		var o = { A: obj, B: arr };
		var r = B.build(o);
		assert.strictEqual(r.A, obj);
		assert.strictEqual(r.B, arr);
	});

	it("should keep overwriten objects and arrays unchanged", function() {
		var obj1 = {a: 1}, obj2 = { b: 2 };
		var arr1 = [1], arr2 = [2];
		var o = { A: obj1, B: arr1 };
		var r = B.build(o, {A: obj2, B: arr2});
		assert.strictEqual(r.A, obj2);
		assert.strictEqual(r.B, arr2);
		assert.deepEqual(r, {A: {b: 2}, B: [2]});
		assert.deepEqual(obj1, {a: 1});
		assert.deepEqual(obj2, {b: 2});
		assert.deepEqual(arr1, [1]);
		assert.deepEqual(arr2, [2]);
	});
});


describe('object()', function() {
	it("should create subobjects", function() {
		var r = B.build({
			a: B.object({ as: 1 })
		});
		assert.deepEqual(r, {a: {as: 1}});
	});

	it("should extend existing subobjects", function() {
		var r = B.build({a: {as: 1}}, {a: B.object({ bs: 2 })});
		assert.deepEqual(r, {a: {as: 1, bs: 2}});
	});

	it("should not modify original subobjects", function() {
		var o = {as: 1};
		var r = B.build({a: o}, {a: B.object({ bs: 2 })});
		assert.deepEqual(o, {as: 1});
	});

	it("should extend existing subobjects multiple times", function() {
		var r = B.build(
			{a: {as: 1}},
			{a: B.object({ bs: 2 })},
			{a: B.object({ cs: 3 })}
		);
		assert.deepEqual(r, {a: {as: 1, bs: 2, cs: 3}});
	});

	it("should be overwritable by later arguments", function() {
		var r = B.build(
			{a: {as: 1}},
			{a: B.object({ bs: 2 })},
			{a: { cs: 3 }}
		);
		assert.deepEqual(r, {a: {cs: 3}});
	});

	it("should create empty object without arguments", function() {
		var r = B.build(
			{},
			{ a: B.object() }
		);
		assert.deepEqual(r, {a: {}});
	});

	it("should append nothing without arguments", function() {
		var r = B.build(
			{ a: {as: 1} },
			{ a: B.object() }
		);
		assert.deepEqual(r, {a: {as: 1}});
	});

	it("should combine multiple arguments", function() {
		var r = B.build(
			{},
			{ a: B.object({as: 1}, {bs: 2}, {cs: 3}) }
		);
		assert.deepEqual(r, {a: {as: 1, bs: 2, cs: 3}});
	});

	it("should append multiple arguments", function() {
		var r = B.build(
			{ a: {as: 0} },
			{ a: B.object({bs: 1}, {cs: 2}, {ds: 3}) }
		);
		assert.deepEqual(r, {a: {as: 0, bs: 1, cs: 2, ds: 3}});
	});

	it("should remove `remove` properties", function() {
		var r = B.build(
			{a: 1, b: 2},
			{b: B.remove}
		);
		assert.deepEqual(r, {a: 1});
	});
});


describe('object.extend()', function() {
	it("should be equal to main object() function", function() {
		assert.strictEqual(B.object, B.object.extend);
	});
});


describe('array()', function() {
	it("should create array properties", function() {
		var r = B.build({
			a: B.array([1])
		});
		assert.deepEqual(r, {a: [1]});
	});

	it("should append to existing arrays", function() {
		var r = B.build(
			{ a: [1,2] },
			{ a: B.array([3,4]) }
		);
		assert.deepEqual(r, {a: [1,2,3,4]});
	});

	it("should not modify original array objects", function() {
		var o = [1,2];
		var r = B.build(
			{ a: o },
			{ a: B.array([3,4]) }
		);
		assert.deepEqual(o, [1,2]);
	});

	it("should append to existing multiple times", function() {
		var r = B.build(
			{ a: [1,2] },
			{ a: B.array([3,4]) },
			{ a: B.array([5,6]) }
		);
		assert.deepEqual(r, {a: [1,2,3,4,5,6]});
	});

	it("should be overwritable by later arguments", function() {
		var r = B.build(
			{ a: [1,2] },
			{ a: B.array([3,4]) },
			{ a: [5,6] }
		);
		assert.deepEqual(r, {a: [5,6]});
	});

	it("should create empty array without arguments", function() {
		var r = B.build(
			{},
			{ a: B.array() }
		);
		assert.deepEqual(r, {a: []});
	});

	it("should append nothing without arguments", function() {
		var r = B.build(
			{ a: [1] },
			{ a: B.array() }
		);
		assert.deepEqual(r, {a: [1]});
	});

	it("should combine multiple arguments", function() {
		var r = B.build(
			{},
			{ a: B.array([1], [2], [3]) }
		);
		assert.deepEqual(r, {a: [1, 2, 3]});
	});

	it("should append multiple arguments", function() {
		var r = B.build(
			{ a: [0] },
			{ a: B.array([1], [2], [3]) }
		);
		assert.deepEqual(r, {a: [0, 1, 2, 3]});
	});
});


describe('array.append()', function() {
	it("should be identical to main array() function", function() {
		assert.strictEqual(B.array.append, B.array);
	});
});


describe('array.prepend()', function() {
	it("should create array properties", function() {
		var r = B.build({
			a: B.array.prepend([1])
		});
		assert.deepEqual(r, {a: [1]});
	});

	it("should append to existing arrays", function() {
		var r = B.build(
			{ a: [1,2] },
			{ a: B.array.prepend([3,4]) }
		);
		assert.deepEqual(r, {a: [3,4,1,2]});
	});

	it("should not modify original array objects", function() {
		var o = [1,2];
		var r = B.build(
			{ a: o },
			{ a: B.array.prepend([3,4]) }
		);
		assert.deepEqual(o, [1,2]);
	});

	it("should append to existing multiple times", function() {
		var r = B.build(
			{ a: [1,2] },
			{ a: B.array.prepend([3,4]) },
			{ a: B.array.prepend([5,6]) }
		);
		assert.deepEqual(r, {a: [5,6,3,4,1,2]});
	});

	it("should be overwritable by later arguments", function() {
		var r = B.build(
			{ a: [1,2] },
			{ a: B.array.prepend([3,4]) },
			{ a: [5,6] }
		);
		assert.deepEqual(r, {a: [5,6]});
	});

	it("should create empty array without arguments", function() {
		var r = B.build(
			{},
			{ a: B.array.prepend() }
		);
		assert.deepEqual(r, {a: []});
	});

	it("should append nothing without arguments", function() {
		var r = B.build(
			{ a: [1] },
			{ a: B.array.prepend() }
		);
		assert.deepEqual(r, {a: [1]});
	});

	it("should combine multiple arguments", function() {
		var r = B.build(
			{},
			{ a: B.array.prepend([1], [2], [3]) }
		);
		assert.deepEqual(r, {a: [3, 2, 1]});
	});

	it("should append multiple arguments", function() {
		var r = B.build(
			{ a: [0] },
			{ a: B.array.prepend([1], [2], [3]) }
		);
		assert.deepEqual(r, {a: [3, 2, 1, 0]});
	});
});

