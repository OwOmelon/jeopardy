<script setup lang="ts">
import { computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import type { Column, CompleteTable } from "@/stores/template";

import RowCategories from "./RowCategories.vue";
import TableData from "./TableData.vue";
import TableDataReveal from "./td_reveal/TableDataReveal.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";

const template = useTemplateStore();

const filteredColumns = computed<Column[]>(() => {
	return template.columns.filter(
		(column) => column.category || !template.columnIsEmpty(column.id),
	);
});

const filteredCompleteTable = computed<CompleteTable>(() => {
	return template.rows.reduce((rows, row) => {
		return {
			...rows,
			[row]: filteredColumns.value.reduce((columns, column) => {
				return {
					...columns,
					[column.id]: template.completeTable[row][column.id],
				};
			}, {}),
		};
	}, {});
});
</script>

<template>
	<table class="grid gap-3">
		<RowCategories :columns="filteredColumns" />

		<tr
			v-for="(rowValue, rowKey, rowIndex) in filteredCompleteTable"
			:key="rowKey"
		>
			<TableData
				v-for="(cellValue, cellKey, cellIndex) in rowValue"
				:key="cellKey"
				v-bind="cellValue"
				class="cell cell-width cell-padding td-rise"
				@reveal="template.activeCell = cellValue"
			/>
		</tr>
	</table>

	<ModalWrapper :show="template.activeCell ? true : false">
		<TableDataReveal />
	</ModalWrapper>
</template>
