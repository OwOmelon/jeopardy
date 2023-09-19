import { ref, computed, watch, watchEffect, onBeforeMount } from "vue";
import { defineStore } from "pinia";

import type { Player } from "./players";

export type Row = `row${number}`;

export type Category = {
	id: `column${number}`;
	name: string;
};

export type RawTableCell = {
	question: string;
	answer: string;
};

//  ----

export type RawTable = {
	[key: Row]: { [key: Category["name"]]: RawTableCell };
};

export type TableCell = {
	points: number;
	category: Category["name"];
	answeredBy: null | Player["id"];
} & RawTableCell;

export type Table = {
	[key: Category["name"]]: { [key: string]: TableCell };
};

//  ----

export type RawTemplateData = {
	id: string;
	templateName: string;
	points: number[];
	rows: Row[];
	columns: Category[];
	rawTable: RawTable;
};

// ------------------------------

export const useTemplateStore = defineStore("template", () => {
	const currentTemplateID = ref<string>("");

	const templateName = ref<string>("");
	const points = ref<number[]>([]);
	const rows = ref<Row[]>([]);
	const columns = ref<Category[]>([]);
	const rawTable = ref<RawTable>({});

	const rawTemplateData = computed<RawTemplateData>({
		get() {
			return {
				id: currentTemplateID.value,
				templateName: templateName.value,
				rows: rows.value,
				points: points.value,
				columns: columns.value,
				rawTable: rawTable.value,
			};
		},

		set(newValue) {
			currentTemplateID.value = newValue.id;
			templateName.value = newValue.templateName;
			rows.value = newValue.rows;
			points.value = newValue.points;
			columns.value = newValue.columns;
			rawTable.value = newValue.rawTable;
		},
	});

	function saveRawTemplateDataToLocalStorage(): void {
		console.log("save");
		localStorage.setItem("template", JSON.stringify(rawTemplateData.value));
	}

	function createTemplate(): void {
		const newRows: Row[] = [];
		const newPoints: number[] = [];
		const newColumns: Category[] = [];

		for (let i = 0; i < 5; i++) {
			newPoints.push((i + 1) * 100);
			newRows.push(`row${i + 1}`);
			newColumns.push({ id: `column${i + 1}`, name: `` });
		}

		const newRawTable: RawTable = newRows.reduce((rows, row) => {
			return {
				...rows,
				[row]: newColumns.reduce((columns, column) => {
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

		templateName.value = "";
		rows.value = newRows;
		points.value = newPoints;
		columns.value = newColumns;
		rawTable.value = newRawTable;
	}

	watchEffect(() => {
		saveRawTemplateDataToLocalStorage();
	});

	return {
		currentTemplateID,
		templateName,
		points,
		rows,
		columns,
		rawTable,
		rawTemplateData,
		createTemplate,
	};
});
