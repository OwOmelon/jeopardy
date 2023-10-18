import { ref, computed, watch, watchEffect, onBeforeMount } from "vue";
import { defineStore } from "pinia";
import { useGuestsStore } from "./guests";
import { v4 as uuidv4 } from "uuid";

import type { Guest } from "./guests";

export type Row = `row${number}`; /* row1 - row-5 */

export type Category = {
	id: `column${number}` /* column1 - column-5 */;
	name: string;
};

export type RawTableCell = {
	question: string;
	answer: string;
};

export type RawTable = {
	[key: Row]: { [key: Category["id"]]: RawTableCell };
};

//  ----

export type TableDisplayCell = {
	points: number;
	category: Category["name"];
	answeredBy: Guest["id"] | null;
} & RawTableCell;

export type TableDisplay = {
	[key: Row]: { [key: Category["id"]]: TableDisplayCell };
};

//  ----

export type RawTemplateData = {
	id: string;
	name: string;
	points: number[];
	rows: Row[];
	columns: Category[];
	rawTable: RawTable;
};

//  ----

export type PlayProgressTracker = {
	[key: Row]: { [key: Category["id"]]: Guest["id"] };
};

// ------------------------------

export const useTemplateStore = defineStore("template", () => {
	const guests = useGuestsStore();
	const editing = ref<boolean>(true);

	const id = ref<string>(uuidv4());
	const name = ref<string>("");
	const points = ref<number[]>([]);
	const rows = ref<Row[]>([]);
	const columns = ref<Category[]>([]);
	const rawTable = ref<RawTable>({});

	const rawTemplateData = computed<RawTemplateData>({
		get() {
			return {
				id: id.value,
				name: name.value,
				rows: rows.value,
				points: points.value,
				columns: columns.value,
				rawTable: rawTable.value,
			};
		},

		set(newValue) {
			id.value = newValue.id;
			name.value = newValue.name;
			rows.value = newValue.rows;
			points.value = newValue.points;
			columns.value = newValue.columns;
			rawTable.value = newValue.rawTable;
		},
	});

	function cellHasMissingData(row: Row, column: Category["id"]): boolean {
		return rawTable.value[row][column].question ||
			rawTable.value[row][column].answer
			? false
			: true;
	}

	function columnIsEmpty(column: Category["id"]): boolean {
		const arr: boolean[] = [];

		for (let i = 0; i < rows.value.length; i++) {
			arr.push(cellHasMissingData(`row${i + 1}`, column));
		}

		return arr.every((a) => a === true);
	}

	function createTemplate(): RawTemplateData {
		console.log("create template");

		const points: number[] = [];
		const rows: Row[] = [];
		const columns: Category[] = [];

		for (let i = 0; i < 5; i++) {
			points.push((i + 1) * 100);
			rows.push(`row${i + 1}`);
			columns.push({ id: `column${i + 1}`, name: `` });
		}

		const rawTable: RawTable = rows.reduce((rows, row) => {
			return {
				...rows,
				[row]: columns.reduce((columns, column) => {
					return {
						...columns,
						[column.id]: {
							question: "",
							answer: "",
						},
					};
				}, {}),
			};
		}, {});

		return { id: "", name: "", points, rows, columns, rawTable };
	}

	function fetchTemplateFromLocalStorage(): RawTemplateData | null {
		const template = localStorage.getItem("template");

		return template ? JSON.parse(template) : null;
	}

	watch(
		rawTemplateData,
		(template) => {
			localStorage.setItem("template", JSON.stringify(template));
		},
		{ deep: true },
	);

	onBeforeMount(() => {
		rawTemplateData.value = fetchTemplateFromLocalStorage() ?? createTemplate();
	});

	// ------------------------------

	const activeCellIndeces = ref<{
		row: Row | null;
		column: Category["id"] | null;
	}>({
		row: null,
		column: null,
	});

	const activeCellData = computed<TableDisplayCell | null>(() => {
		return activeCellIndeces.value.row && activeCellIndeces.value.column
			? JSON.parse(
					JSON.stringify(
						tableDisplay.value[activeCellIndeces.value.row][
							activeCellIndeces.value.column
						],
					),
			  )
			: null;
	});

	function resetActiveCell(): void {
		activeCellIndeces.value.row = null;
		activeCellIndeces.value.column = null;
	}

	const playProgressTracker = ref<PlayProgressTracker>({});

	function setPlayProgressTracker(guestID: Guest["id"] | null) {
		playProgressTracker.value[activeCellIndeces.value.row!] = {
			[activeCellIndeces.value.column!]: guestID ?? "no one",
		};
	}

	// ------------------------------

	const categoriesDisplay = computed<Category[]>({
		get() {
			return editing.value
				? columns.value
				: columns.value.filter(
						(category) => category.name || !columnIsEmpty(category.id),
				  );
		},

		set(newValue) {
			columns.value = newValue;
		},
	});

	const isEmpty = computed<boolean>(() => {
		return categoriesDisplay.value.length ? false : true;
	});

	const tableDisplay = computed<TableDisplay>(() => {
		return rows.value.reduce((rows, row, rowIndex) => {
			return {
				...rows,
				[row]: categoriesDisplay.value.reduce((categories, category) => {
					const answeredBy =
						guests.getGuest(playProgressTracker.value?.[row]?.[category.id])
							?.name ?? null;

					return {
						...categories,
						[category.id]: {
							...rawTable.value[row][category.id],
							points: points.value[rowIndex],
							category: category.name || category.id,
							answeredBy,
						},
					};
				}, {}),
			};
		}, {});
	});

	// ------------------------------

	return {
		editing,
		id,
		name,
		points,
		rows,
		columns,
		rawTable,
		rawTemplateData,
		playProgressTracker,
		cellHasMissingData,
		columnIsEmpty,
		createTemplate,

		//  ----

		tableDisplay,
		isEmpty,
		categoriesDisplay,
		activeCellIndeces,
		activeCellData,
		resetActiveCell,
		setPlayProgressTracker,
	};
});
