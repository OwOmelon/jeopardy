import { ref, computed, watch, watchEffect, onBeforeMount } from "vue";
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { useGuestsStore } from "./guests";
import { useGameProgressStore } from "./game_progress";
import { v4 as uuidv4 } from "uuid";
import { checkTemplateForErrors } from "@/composables/check_template_for_errors";

import type { Guest } from "./guests";
import type { TemplateErrors } from "@/composables/check_template_for_errors";

//  ----

export type RowID = `row${number}`; /* row1 - row-5 */
export type Rows = { [key: RowID]: number };

export type ColumnID = `column${number}`; /* column1 - column-5 */
export type Columns = { [key: ColumnID]: string };

//  ----

export type TableCell = {
	question: string;
	answer: string;
};

export type Table = {
	[key: RowID]: { [key: ColumnID]: TableCell };
};

export type ImageTable = {
	uploads: Table;
	links: Table;
};

//  ----

export type TableDataCell = {
	row: RowID;
	column: ColumnID;
	points: number;
	category: string;
	question: {
		text: string;
		image: string;
	};
	answer: {
		text: string;
		image: string;
	};
	answeredBy: Guest["name"] | "no one";
};

export type TableDataRows = {
	[key: RowID]: { [key: ColumnID]: TableDataCell };
};

//  ----

export type TemplateData = {
	name: string;
	rows: Rows;
	columns: Columns;
	textTable: Table;
	imageTable: ImageTable;
};

//  ----

export type HistoryTemplateID = `template_${string}`;

export type HistoryTemplate = TemplateData & {
	id: HistoryTemplateID;
	iteration: number;
	dateModified: Date;
};

// ------------------------------

export const useTemplateStore = defineStore("template", () => {
	const guests = useGuestsStore();
	const gameProgress = useGameProgressStore();

	// ---------- INITIALIZATION ----------

	const editing = ref<boolean>(true);

	const name = ref<string>("");
	const rows = ref<Rows>({});
	const columns = ref<Columns>({});

	function updateRowPoints(row: RowID, points: number): void {
		rows.value[row] = points;
	}

	function updateColumnCategory(column: ColumnID, category: string): void {
		columns.value[column] = category;
	}

	function sortRows(deep: boolean = false): void {
		const points = Object.values(rows.value);
		const sortedPoints = points.toSorted((a, b) => (a > b ? 1 : -1));

		const rowKeys = Object.keys(rows.value) as RowID[];
		const orderedRowKeys = deep
			? sortedPoints.map((num) => rowKeys[points.indexOf(num)])
			: [];

		const sortedRows: typeof rows.value = {};

		for (let i = 0; i < 5; i++) {
			const property = deep ? orderedRowKeys[i] : rowKeys[i];

			sortedRows[property] = sortedPoints[i];
		}

		rows.value = sortedRows;
	}

	watch(
		() => ({
			name: name.value,
			rows: rows.value,
			columns: columns.value,
		}),
		(templateStructure) => {
			localStorage.setItem(
				"template-structure",
				JSON.stringify(templateStructure),
			);
		},
		{ deep: true },
	);

	// ---------------

	const textTable = ref<Table>(useLocalStorage("text-table", {}));

	function updateTextTable(
		row: RowID,
		column: ColumnID,
		text: string,
		property: "question" | "answer",
	): void {
		const textRow = textTable.value[row] ?? {};
		const textCell = textRow?.[column] ?? { question: "", answer: "" };

		textCell[property] = text;
		textRow[column] = textCell;
		textTable.value[row] = textRow;
	}

	function fetchTextTableText(
		row: RowID,
		column: ColumnID,
		property: "question" | "answer",
	): string {
		return textTable.value?.[row]?.[column]?.[property] ?? "";
	}

	// ---------------

	const imageTable = ref<ImageTable>({
		uploads: {},
		links: {},
	});

	function updateImageTable(
		row: RowID,
		column: ColumnID,
		src: string,
		branch: "upload" | "link",
		property: "question" | "answer",
	) {
		const imageRow = imageTable.value[`${branch}s`][row] ?? {};
		const imageCell = imageRow?.[column] ?? { question: "", answer: "" };

		imageCell[property] = src;
		imageRow[column] = imageCell;
		imageTable.value[`${branch}s`][row] = imageRow;
	}

	function fetchImageTableImage(
		row: RowID,
		column: ColumnID,
		property: "question" | "answer",
	): { src: string; type: "upload" | "link" } | null {
		const uploadedImage = imageTable.value.uploads?.[row]?.[column]?.[property];
		const imageLink = imageTable.value.links?.[row]?.[column]?.[property];

		let obj: ReturnType<typeof fetchImageTableImage> = null;

		if (uploadedImage) {
			obj = { src: uploadedImage, type: "upload" };
		}

		if (imageLink) {
			obj = { src: imageLink, type: "link" };
		}

		return obj;
	}

	watch(
		() => imageTable.value.links,
		(branch) => {
			localStorage.setItem("image-table-links", JSON.stringify(branch));
		},
		{ deep: true },
	);

	// ---------------

	function setTemplateData(newTemplate: TemplateData): void {
		name.value = newTemplate.name;
		rows.value = newTemplate.rows;
		columns.value = newTemplate.columns;
		textTable.value = newTemplate.textTable;
		imageTable.value = newTemplate.imageTable;
	}

	function getTemplateData(): TemplateData {
		return {
			name: name.value,
			rows: rows.value,
			columns: columns.value,
			textTable: textTable.value,
			imageTable: imageTable.value,
		};
	}

	function createTemplateData(): TemplateData {
		const rows: Rows = {};
		const columns: Columns = {};

		for (let i = 0; i < 5; i++) {
			rows[`row${i + 1}`] = (i + 1) * 100;
			columns[`column${i + 1}`] = "";
		}

		return {
			name: "",
			rows,
			columns,
			textTable: {},
			imageTable: { uploads: {}, links: {} },
		};
	}

	// ---------------

	const localStorageTemplateErrors = ref<TemplateErrors | null>(null);

	loadJeopardyTemplate();

	async function loadJeopardyTemplate(): Promise<void> {
		const localStorageTemplate = fetchTemplateFromLocalStorage();

		if (!localStorageTemplate) {
			setTemplateData(createTemplateData());

			return;
		}

		try {
			await checkTemplateForErrors(localStorageTemplate);

			setTemplateData(localStorageTemplate);
		} catch (err) {
			localStorageTemplateErrors.value = err as TemplateErrors;
		}
	}

	function fetchTemplateFromLocalStorage(): TemplateData | null {
		const templateStructure = localStorage.getItem("template-structure");
		const textTable = localStorage.getItem("text-table");
		const imageTableLinks = localStorage.getItem("image-table-links");

		if (!(templateStructure && textTable && imageTableLinks)) return null;

		return {
			...JSON.parse(templateStructure),
			textTable: JSON.parse(textTable),
			imageTable: { uploads: {}, links: JSON.parse(imageTableLinks) },
		};
	}

	// ---------- DISPLAY ----------

	const tableDataRows = computed<TableDataRows>(() => {
		const rowEntries = Object.entries(rows.value) as [RowID, number][];
		const columnEntries = Object.entries(columns.value) as [ColumnID, string][];

		return rowEntries.reduce((allRows, [row, points]) => {
			return {
				...allRows,
				[row]: columnEntries.reduce((allColumns, [column, category]) => {
					const successfullyAnswered =
						gameProgress.progress?.[row]?.[column]?.successfullyAnswered;

					const completeTableCell: TableDataCell = {
						row,
						column,
						points,
						category,
						question: {
							text: fetchTextTableText(row, column, "question"),
							image: fetchImageTableImage(row, column, "question")?.src || "",
						},
						answer: {
							text: fetchTextTableText(row, column, "answer"),
							image: fetchImageTableImage(row, column, "answer")?.src || "",
						},
						answeredBy:
							successfullyAnswered === undefined
								? ""
								: guests.getGuest(successfullyAnswered ?? "guest_")?.name ??
									"no one",
					};

					return {
						...allColumns,
						[column]: completeTableCell,
					};
				}, {}),
			};
		}, {});
	});

	const activeTableDataCellIndeces = ref<{
		row: RowID;
		column: ColumnID;
	} | null>(null);

	const activeTableDataCell = computed<TableDataCell | null>(() => {
		return activeTableDataCellIndeces.value === null
			? null
			: tableDataRows.value[activeTableDataCellIndeces.value.row][
					activeTableDataCellIndeces.value.column
				];
	});

	function setActiveDataCell(
		keys: typeof activeTableDataCellIndeces.value | null,
	) {
		activeTableDataCellIndeces.value = keys;
	}

	function checkTableDataProperties(
		row: RowID,
		column: ColumnID,
	): "complete" | "empty" | "partial" {
		const td = tableDataRows.value[row][column];

		return (td.question.text || td.question.image) &&
			(td.answer.text || td.answer.image)
			? "complete"
			: !(td.question.text || td.question.image) &&
				  !(td.answer.text || td.answer.image)
				? "empty"
				: "partial";
	}

	function columnIsEmpty(column: ColumnID): boolean {
		const columnProps = (Object.keys(rows.value) as RowID[]).map((row) => {
			return checkTableDataProperties(row, column);
		});

		return columnProps.every((prop) => prop === "empty");
	}

	// ---------- HISTORY ----------

	const currentID = ref<HistoryTemplateID>("template_");

	const history = ref<HistoryTemplate[]>([]);
	const historyPushIteration = ref<number>(0);
	const forceDisableHistoryLog = ref<boolean>(false);

	const historyIndexOfCurrentTemplate = computed<number>(() => {
		return history.value.findIndex((temp) => temp.id === currentID.value);
	});

	function loadTemplate(save: HistoryTemplate) {
		forceDisableHistoryLog.value = true;

		currentID.value = save.id;
		setTemplateData(save);
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
		currentID.value = `template_${uuidv4()}`;

		history.value.push({
			...JSON.parse(JSON.stringify(template)),
			id: currentID.value,
			iteration: historyPushIteration.value,
			dateModified: new Date(),
		});
	}

	watch(
		() => getTemplateData(),
		(template) => {
			logHistory(template);
		},
		{ deep: true, immediate: true },
	);

	// ------------------------------

	return {
		editing,

		name,
		rows,
		columns,

		updateRowPoints,
		updateColumnCategory,
		sortRows,

		textTable,
		updateTextTable,
		fetchTextTableText,

		imageTable,
		updateImageTable,
		fetchImageTableImage,

		setTemplateData,
		getTemplateData,
		createTemplateData,

		localStorageTemplateErrors,

		fetchTemplateFromLocalStorage,

		//  ----

		tableDataRows,
		activeTableDataCell,
		setActiveDataCell,
		checkTableDataProperties,
		columnIsEmpty,

		//  ----

		history,
		historyPushIteration,
		historyIndexOfCurrentTemplate,
		loadTemplate,
	};
});
