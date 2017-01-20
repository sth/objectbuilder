
export class Modifier {
	constructor(fun) {
		this.exec = fun;
	}
}

export function assign(target, ...objs) {
	objs.forEach(function(obj) {
		Object.keys(obj).forEach(function(key) {
			const value = obj[key];
			if (value instanceof Modifier) {
				// Assign subproperties
				target[key] = value.exec(target[key]);
			}
			else {
				// Assign value itself
				target[key] = value;
			}
		});
	});
	return target;
}

export function build(...objs) {
	return assign({}, ...objs)
}

function extendObj(...objs) {
	return new Modifier(function(obj) {
		if (obj === undefined)
			obj = {};
		return build(obj, ...objs);
	});
}
export const object = extendObj;
object.extend = extendObj;

function extendArr(...arrays) {
	return new Modifier(function(arr) {
		if (arr === undefined)
			arr = [];
		arrays.forEach(values => {
			arr = arr.concat(...values);
		});
		return arr;
	});
}
export const array = extendArr;
array.extend = extendArr;

