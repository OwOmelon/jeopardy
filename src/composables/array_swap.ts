export function arrSwap(arr: any[], from: number, to: number): any[] {
	const clone: typeof arr = JSON.parse(JSON.stringify(arr));

	[clone[from], clone[to]] = [clone[to], clone[from]];

	return clone;
}
