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

export type CellsAnswered = {
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

	const templateData = computed<TemplateData>({
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

	const checkTableDataValues = (
		row: RowID,
		column: Column["id"],
	): "complete" | "empty" | "partial" => {
		const tableData = rawTable.value[row][column];

		return tableData.question && tableData.answer
			? "complete"
			: !tableData.question && !tableData.answer
			? "empty"
			: "partial";
	};

	const columnIsEmpty = (column: Column["id"]): boolean => {
		const arr: string[] = [];

		for (let i = 0; i < rows.value.length; i++) {
			arr.push(checkTableDataValues(`row${i + 1}`, column));
		}

		return arr.every((a) => a === "empty");
	};

	const createTemplate = (): TemplateData => {
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
	};

	const fetchTemplateFromLocalStorage = (): TemplateData | null => {
		const template = localStorage.getItem("template");

		return template ? JSON.parse(template) : null;
	};

	watch(
		templateData,
		(template) => {
			localStorage.setItem("template", JSON.stringify(template));
		},
		{ deep: true },
	);

	onBeforeMount(() => {
		templateData.value = fetchTemplateFromLocalStorage() ?? createTemplate();
	});

	// ------------------------------

	const activeCell = ref<CompleteTableCell | null>(null);
	const cellsAnswered = ref<CellsAnswered>({});

	function setPlayProgressTracker(name: Guest["name"] | null) {
		const row = cellsAnswered.value?.[activeCell.value!.row] ?? {};

		row[activeCell.value!.column!] = name;
		cellsAnswered.value[activeCell.value!.row] = row;
	}

	const completeTable = computed<CompleteTable>(() => {
		return rows.value.reduce((rows, row, rowIndex) => {
			return {
				...rows,
				[row]: columns.value.reduce((columns, column) => {
					return {
						...columns,
						[column.id]: {
							...rawTable.value[row][column.id],
							row,
							points: points.value[rowIndex],
							column: column.id,
							category: column.category,
							answeredBy: cellsAnswered.value?.[row]?.[column.id],
						},
					};
				}, {}),
			};
		}, {});
	});

	watch(
		cellsAnswered,
		(progress) => {
			localStorage.setItem("cellsAnswered", JSON.stringify(progress));
		},
		{ deep: true },
	);

	const fetchplayProgressTrackerFromLocalStorage =
		(): CellsAnswered | null => {
			const savedProgress = localStorage.getItem("cellsAnswered");

			return savedProgress ? JSON.parse(savedProgress) : null;
		};

	cellsAnswered.value = fetchplayProgressTrackerFromLocalStorage() || {};

	// ------------------------------

	return {
		editing,
		id,
		name,
		points,
		rows,
		columns,
		rawTable,
		templateData,
		cellsAnswered,
		checkTableDataValues,
		columnIsEmpty,
		createTemplate,

		//  ----

		completeTable,
		activeCell,
		setPlayProgressTracker,
	};
});
