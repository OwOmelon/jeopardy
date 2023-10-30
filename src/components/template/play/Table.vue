<script setup lang="ts">
import { computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import type { Column, CompleteTable } from "@/stores/template";

import { Icon } from "@iconify/vue";
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
	<table class="grid gap-3" v-if="filteredColumns.length">
		<RowCategories :columns="filteredColumns" />

		<tr
			v-for="(rowValue, rowKey, rowIndex) in filteredCompleteTable"
			:key="rowKey"
		>
			<TableData
				v-for="(cellValue, cellKey, cellIndex) in rowValue"
				v-bind="cellValue"
				:is-empty="template.checkTableDataValues(rowKey, cellKey) === 'empty'"
				:key="cellKey"
				@reveal="template.activeCell = cellValue"
			/>
		</tr>

		<ModalWrapper :show="template.activeCell ? true : false">
			<TableDataReveal />
		</ModalWrapper>
	</table>

	<div class="my-10 rounded bg-stone-50 p-3 shadow-md" v-else>
		<p class="text-xl font-bold">your table is empty D:</p>
		<button
			type="button"
			class="mx-auto mt-5 flex items-center gap-2 rounded bg-red-400 p-2 text-sm text-white transition-transform hover:-translate-y-1"
			@click="template.editing = true"
		>
			go work on it
			<Icon icon="material-symbols:edit-rounded" class="h-6 w-6" />
		</button>
	</div>
</template>
