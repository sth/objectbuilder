
export class Modifier {
	constructor(fun) {
		this.exec = fun;
	}
}

export function modify(action) {
	return new Modifier(action);
}

export function isModifier(value) {
	return (value instanceof Modifier);
}

export const remove = {};


export function assign(target, ...objs) {
	objs.forEach(function(obj) {
		Object.keys(obj).forEach(function(key) {
			const value = obj[key];
			if (isModifier(value)) {
				// Modify existing value
				target[key] = value.exec(target[key]);
			}
			else if (value === remove) {
				delete target[key];
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
	return assign({}, ...objs);
}


export function setdefault(default_value) {
	return modify(value => {
		if (value === undefined) {
			return default_value;
		}
		else {
			return value;
		}
	});
}

export const required = modify(value => {
	if (value === undefined) {
		throw new Error("expected value missing");
	}
	return value;
});


export function object(...objs) {
	return modify(obj => {
		if (obj === undefined)
			obj = {};
		return build(obj, ...objs);
	});
}
object.extend = object;

export function array_append(...arrays) {
	return modify(arr => {
		if (arr === undefined)
			arr = [];
		arrays.forEach(values => {
			arr = arr.concat(values);
		});
		return arr;
	});
}

export function array_prepend(...arrays) {
	return new Modifier(function(arr) {
		if (arr === undefined)
			arr = [];
		arrays.forEach(values => {
			arr = values.concat(arr);
		});
		return arr;
	});
}


export const array = array_append;
array.append = array_append;
array.prepend = array_prepend;

