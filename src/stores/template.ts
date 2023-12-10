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

export type Column = {
	id: `column${number}` /* column1 - column-5 */;
	category: string;
};

//  ----

export type TableCell = {
	question: string;
	answer: string;
};

export type Table = {
	[key: RowID]: { [key: Column["id"]]: TableCell };
};

export type ImageTable = {
	uploads: Table;
	links: Table;
};

//  ----

export type CompleteTableCell = {
	row: RowID;
	column: Column["id"];
	points: number;
	category: Column["category"];
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

export type CompleteTable = {
	[key: RowID]: { [key: Column["id"]]: CompleteTableCell };
};

//  ----

export type TemplateData = {
	name: string;
	rows: RowID[];
	columns: Column[];
	points: number[];
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
	const rows = ref<RowID[]>([]);
	const columns = ref<Column[]>([]);
	const points = ref<number[]>([]);

	watch(
		() => ({
			name: name.value,
			rows: rows.value,
			columns: columns.value,
			points: points.value,
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
		column: Column["id"],
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
		column: Column["id"],
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
		column: Column["id"],
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
		column: Column["id"],
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

	const templateData = computed<TemplateData>({
		get() {
			return {
				name: name.value,
				rows: rows.value,
				columns: columns.value,
				points: points.value,
				textTable: textTable.value,
				imageTable: imageTable.value,
			};
		},

		set(newValue) {
			name.value = newValue.name;
			rows.value = newValue.rows;
			columns.value = newValue.columns;
			points.value = newValue.points;
			textTable.value = newValue.textTable;
			imageTable.value = newValue.imageTable;
		},
	});

	function createTemplate(): TemplateData {
		const rows: RowID[] = [];
		const columns: Column[] = [];
		const points: number[] = [];

		for (let i = 0; i < 5; i++) {
			points.push((i + 1) * 100);
			rows.push(`row${i + 1}`);
			columns.push({ id: `column${i + 1}`, category: `` });
		}

		return {
			name: "",
			rows,
			columns,
			points,
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
			templateData.value = createTemplate();

			return;
		}

		try {
			await checkTemplateForErrors(localStorageTemplate);

			templateData.value = localStorageTemplate;
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

	const activeCell = ref<CompleteTableCell | null>(null);

	const completeTable = computed<CompleteTable>(() => {
		return rows.value.reduce((rows, row, rowIndex) => {
			return {
				...rows,
				[row]: columns.value.reduce((columns, column) => {
					const successfullyAnswered =
						gameProgress.progress?.[row]?.[column.id]?.successfullyAnswered;

					const completeCell: CompleteTableCell = {
						row,
						column: column.id,
						points: points.value[rowIndex],
						category: column.category,
						question: {
							text: fetchTextTableText(row, column.id, "question"),
							image:
								fetchImageTableImage(row, column.id, "question")?.src || "",
						},
						answer: {
							text: fetchTextTableText(row, column.id, "answer"),
							image: fetchImageTableImage(row, column.id, "answer")?.src || "",
						},
						answeredBy:
							successfullyAnswered === undefined
								? ""
								: guests.getGuest(successfullyAnswered ?? "guest_")?.name ??
								  "no one",
					};

					return {
						...columns,
						[column.id]: completeCell,
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

	function checkTableDataProperties(
		row: RowID,
		column: Column["id"],
	): "complete" | "empty" | "partial" {
		const td = completeTable.value[row][column];

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
		currentID.value = `template_${uuidv4()}`;

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
		{ deep: true, immediate: true },
	);

	// ------------------------------

	return {
		editing,

		name,
		points,
		rows,
		columns,

		textTable,
		updateTextTable,
		fetchTextTableText,

		imageTable,
		updateImageTable,
		fetchImageTableImage,

		templateData,
		createTemplate,

		localStorageTemplateErrors,

		fetchTemplateFromLocalStorage,

		//  ----

		activeCell,
		completeTable,
		filteredColumns,
		filteredCompleteTable,
		checkTableDataProperties,
		columnIsEmpty,

		//  ----

		history,
		historyPushIteration,
		historyIndexOfCurrentTemplate,
		loadTemplate,
	};
});
