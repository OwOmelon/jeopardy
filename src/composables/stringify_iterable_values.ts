export function stringifyValues(iterable: any) {
	for (const prop in iterable) {
		const value = iterable[prop];
		const valueIsIterable =
			Array.isArray(value) ||
			(value !== null && !Array.isArray(value) && typeof value === "object");

		if (valueIsIterable) {
			stringifyValues(value);
		} else {
			iterable[prop] = JSON.stringify(value);
		}
	}
}
