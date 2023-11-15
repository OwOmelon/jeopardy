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
	question: {
		text: string;
		image: string;
	};
	answer: {
		text: string;
		image: string;
	};
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

export type HistoryTemplate = TemplateData & {
	id: string;
	iteration: number;
	dateModified: Date;
};

// ------------------------------

export const useTemplateStore = defineStore("template", () => {
	const guests = useGuestsStore();
	const editing = ref<boolean>(true);
	const resetTemplateWarning = ref<boolean>(false);

	const name = ref<string>("");
	const points = ref<number[]>([]);
	const rows = ref<RowID[]>([]);
	const columns = ref<Column[]>([]);
	const rawTable = ref<RawTable>({});

	const templateData = computed<TemplateData>({
		get() {
			return {
				name: name.value,
				rows: rows.value,
				points: points.value,
				columns: columns.value,
				rawTable: rawTable.value,
			};
		},

		set(newValue) {
			name.value = newValue.name;
			rows.value = newValue.rows;
			points.value = newValue.points;
			columns.value = newValue.columns;
			rawTable.value = newValue.rawTable;
		},
	});

	function checkTableDataProperties(
		row: RowID,
		column: Column["id"],
	): "complete" | "empty" | "partial" {
		const td = rawTable.value[row][column];

		return (td.question.text || td.question.image) &&
			(td.answer.text || td.answer.image)
			? "complete"
			: !(td.question.text || td.question.image) &&
			  !(td.answer.text || td.answer.image)
			? "empty"
			: "partial";
	}

	function columnIsEmpty(column: Column["id"]): boolean {
		const arr: string[] = [];

		for (let i = 0; i < rows.value.length; i++) {
			arr.push(checkTableDataProperties(`row${i + 1}`, column));
		}

		return arr.every((a) => a === "empty");
	}

	function createTemplate(): TemplateData {
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
					const cell: RawTableCell = {
						question: {
							text: "",
							image: "",
						},
						answer: {
							text: "",
							image: "",
						},
					};

					return {
						...columns,
						[column.id]: cell,
					};
				}, {}),
			};
		}, {});

		return { name: "", points, rows, columns, rawTable };
	}

	function fetchTemplateFromLocalStorage(): TemplateData | null {
		const template = localStorage.getItem("template");

		return template ? JSON.parse(template) : null;
	}

	watch(
		templateData,
		(template) => {
			localStorage.setItem("template", JSON.stringify(template));
		},
		{ deep: true },
	);

	templateData.value = fetchTemplateFromLocalStorage() ?? createTemplate();

	// ------------------------------

	const activeCell = ref<CompleteTableCell | null>(null);
	const cellsAnswered = ref<CellsAnswered>(
		fetchplayProgressTrackerFromLocalStorage() || {},
	);
	const resetCellsAnsweredWarning = ref<boolean>(false);

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

	const filteredColumns = computed<Column[]>(() => {
		return columns.value.filter(
			(column) => column.category || !columnIsEmpty(column.id),
		);
	});

	const filteredCompleteTable = computed<CompleteTable>(() => {
		return rows.value.reduce((rows, row) => {
			return {
				...rows,
				[row]: filteredColumns.value.reduce((columns, column) => {
					return {
						...columns,
						[column.id]: completeTable.value[row][column.id],
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

	function fetchplayProgressTrackerFromLocalStorage(): CellsAnswered | null {
		const savedProgress = localStorage.getItem("cellsAnswered");

		return savedProgress ? JSON.parse(savedProgress) : null;
	}

	// ---------- HISTORY ----------

	const currentID = ref<string>("");

	const history = ref<HistoryTemplate[]>([]);
	const historyPushIteration = ref<number>(0);
	const forceDisableHistoryLog = ref<boolean>(false);

	const historyIndexOfCurrentTemplate = computed<number>(() => {
		return history.value.findIndex((temp) => temp.id === currentID.value);
	});

	function loadTemplate(save: HistoryTemplate) {
		forceDisableHistoryLog.value = true;

		currentID.value = save.id;
		templateData.value = save;
	}

	function logHistory(template: TemplateData): void {
		if (forceDisableHistoryLog.value) {
			forceDisableHistoryLog.value = false;

			return;
		}

		const historyLengthLimit = 15;

		if (historyIndexOfCurrentTemplate.value !== history.value.length - 1) {
			history.value.splice(historyIndexOfCurrentTemplate.value + 1);
		}

		if (history.value.length >= historyLengthLimit) {
			history.value.splice(0, 1);
		}

		historyPushIteration.value++;
		currentID.value = uuidv4();

		history.value.push({
			...JSON.parse(JSON.stringify(template)),
			id: currentID.value,
			iteration: historyPushIteration.value,
			dateModified: new Date(),
		});
	}

	watch(
		templateData,
		(template) => {
			logHistory(template);
		},
		{ deep: true },
	);

	// ------------------------------

	return {
		editing,
		resetTemplateWarning,
		name,
		points,
		rows,
		columns,
		rawTable,
		templateData,
		cellsAnswered,
		resetCellsAnsweredWarning,
		checkTableDataProperties,
		columnIsEmpty,
		createTemplate,

		//  ----

		completeTable,
		activeCell,
		filteredColumns,
		filteredCompleteTable,
		setPlayProgressTracker,

		//  ----

		history,
		historyPushIteration,
		historyIndexOfCurrentTemplate,
		loadTemplate,
	};
});
