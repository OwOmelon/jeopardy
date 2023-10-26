import { ref, computed, watch, watchEffect, onBeforeMount } from "vue";
import { defineStore } from "pinia";
import { useGuestsStore } from "./guests";
import { v4 as uuidv4 } from "uuid";

import type { Guest } from "./guests";

//  ----

export type RowID = `row${number}`; /* row1 - row-5 */

export type Column = {
	id: `column${number}` /* column1 - column-5 */;
	category: string;
};

export type RawTableCell = {
	question: string;
	answer: string;
};

export type RawTable = {
	[key: RowID]: { [key: Column["id"]]: RawTableCell };
};

export type CompleteTableCell = {
	row: RowID;
	points: number;
	column: Column["id"];
	category: Column["category"];
	answeredBy: Guest["name"] | null | undefined;
} & RawTableCell;

export type CompleteTable = {
	[key: RowID]: { [key: Column["id"]]: CompleteTableCell };
};

//  ----

export type TemplateData = {
	id: string;
	name: string;
	points: number[];
	rows: RowID[];
	columns: Column[];
	rawTable: RawTable;
};

//  ----

export type PlayProgressTracker = {
	[key: RowID]: { [key: Column["id"]]: Guest["name"] | null };
};

// ------------------------------

export const useTemplateStore = defineStore("template", () => {
	const guests = useGuestsStore();
	const editing = ref<boolean>(true);

	const id = ref<string>(uuidv4());
	const name = ref<string>("");
	const points = ref<number[]>([]);
	const rows = ref<RowID[]>([]);
	const columns = ref<Column[]>([]);
	const rawTable = ref<RawTable>({});

	const rawTemplateData = computed<TemplateData>({
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

	function cellHasMissingData(row: RowID, column: Column["id"]): boolean {
		return !rawTable.value[row][column].question ||
			!rawTable.value[row][column].answer
			? true
			: false;
	}

	function columnIsEmpty(column: Column["id"]): boolean {
		const arr: boolean[] = [];

		for (let i = 0; i < rows.value.length; i++) {
			arr.push(cellHasMissingData(`row${i + 1}`, column));
		}

		return arr.every((a) => a === true);
	}

	function createTemplate(): TemplateData {
		console.log("create template");

		const points: number[] = [];
		const rows: RowID[] = [];
		const columns: Column[] = [];

		for (let i = 0; i < 5; i++) {
			points.push((i + 1) * 100);
			rows.push(`row${i + 1}`);
			columns.push({ id: `column${i + 1}`, category: `` });
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

	function fetchTemplateFromLocalStorage(): TemplateData | null {
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

	const activeCell = ref<CompleteTableCell | null>(null);
	const playProgressTracker = ref<PlayProgressTracker>({});

	function setPlayProgressTracker(name: Guest["name"] | null) {
		const row = playProgressTracker.value?.[activeCell.value!.row] ?? {};

		row[activeCell.value!.column!] = name;
		playProgressTracker.value[activeCell.value!.row] = row;
	}

	const categoriesDisplay = computed<Column[]>({
		get() {
			return editing.value
				? columns.value
				: columns.value.filter(
						(column) => column.category || !columnIsEmpty(column.id),
				  );
		},

		set(newValue) {
			columns.value = newValue;
		},
	});

	const isEmpty = computed<boolean>(() => {
		return categoriesDisplay.value.length ? false : true;
	});

	const tableDisplay = computed<CompleteTable>(() => {
		return rows.value.reduce((rows, row, rowIndex) => {
			return {
				...rows,
				[row]: categoriesDisplay.value.reduce((columns, column) => {
					return {
						...columns,
						[column.id]: {
							...rawTable.value[row][column.id],
							row,
							points: points.value[rowIndex],
							column: column.id,
							category: column.category || column.id,
							answeredBy: playProgressTracker.value?.[row]?.[column.id],
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
		activeCell,
		setPlayProgressTracker,
	};
});
