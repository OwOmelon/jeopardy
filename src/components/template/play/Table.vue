<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";

import RowCategories from "./RowCategories.vue";
import TableData from "./TableData.vue";
import TableDataReveal from "./td_reveal/TableDataReveal.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";

const template = useTemplateStore();
</script>

<template>
	<table class="grid gap-3">
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
</template>
