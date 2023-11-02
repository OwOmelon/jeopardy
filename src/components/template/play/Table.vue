<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";

import { Icon } from "@iconify/vue";
import RowCategories from "./RowCategories.vue";
import TableData from "./TableData.vue";
import TableDataReveal from "./td_reveal/TableDataReveal.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";

const template = useTemplateStore();
</script>

<template>
	<table class="grid gap-3" v-if="template.filteredColumns.length">
		<RowCategories />

		<tr
			v-for="(rowValue, rowKey, rowIndex) in template.filteredCompleteTable"
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
			class="mx-auto mt-5 flex items-center gap-2 rounded bg-red-400 p-2 text-sm text-white shadow transition-transform hover:-translate-y-1"
			@click="template.editing = true"
		>
			go work on it
			<Icon icon="material-symbols:edit-rounded" class="h-6 w-6" />
		</button>
	</div>
</template>
