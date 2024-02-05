<script setup lang="ts">
import { computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import type {
	RowID,
	ColumnID,
	Columns,
	CompleteTable,
} from "@/stores/template";

import RowCategories from "./RowCategories.vue";
import TableData from "./TableData.vue";

const template = useTemplateStore();

const filteredColumns = computed<Columns>(() => {
	const columnEntries = Object.entries(template.columns) as [
		ColumnID,
		string,
	][];
	const filteredColumnEntries = columnEntries.filter(([column, category]) => {
		return category || !template.columnIsEmpty(column);
	});

	return Object.fromEntries(filteredColumnEntries);
});

const filteredCompleteTable = computed<CompleteTable>(() => {
	const rowEntries = Object.entries(template.rows) as [RowID, number][];
	const filteredColumnEntries = Object.entries(filteredColumns.value) as [
		ColumnID,
		string,
	][];

	return rowEntries.reduce((allRowEntries, [row, points]) => {
		return {
			...allRowEntries,
			[row]: filteredColumnEntries.reduce(
				(allColumnEntries, [column, category]) => {
					return {
						...allColumnEntries,
						[column]: template.completeTable[row][column],
					};
				},
				{},
			),
		};
	}, {});
});
</script>

<template>
	<div class="table-wrapper">
		<table class="grid gap-3">
			<RowCategories :columns="filteredColumns" />

			<tr
				v-for="(rowValue, rowKey, rowIndex) in filteredCompleteTable"
				:key="rowKey"
				class="tr-flex"
			>
				<TableData
					v-for="(cellValue, cellKey, cellIndex) in rowValue"
					v-bind="cellValue"
					:is-empty="
						template.checkTableDataProperties(rowKey, cellKey) === 'empty'
					"
					:key="cellKey"
					@reveal="template.activeCell = cellValue"
				/>
			</tr>
		</table>
	</div>
</template>
