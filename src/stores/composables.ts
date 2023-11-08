export function randomNumber(max: number, min: number = 0): number {
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random() * (max - min) + min);
}

export function shuffleArray(array: any[]) {
	let currentIndex = array.length;
	let randomIndex;

	while (currentIndex > 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}

export function numToPerc(min: number, max: number) {
	return (min / max) * 100;
}

type TileStyle = "top" | "left" | "width" | "height";
type TileStylesObject = { [Style in TileStyle]: number };

export function getElBoundingClientRect(id: string): TileStylesObject {
	const el = document.getElementById(id);

	const styles: TileStyle[] = ["top", "left", "width", "height"];
	const tileStyles: TileStylesObject = {
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	};

	if (el) {
		styles.forEach((style) => {
			tileStyles[style] = el.getBoundingClientRect()[style];
		});
	}

	return tileStyles;
}
