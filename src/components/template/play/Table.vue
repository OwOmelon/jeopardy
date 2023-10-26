<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";

import RowCategories from "./RowCategories.vue";
import Cell from "./Cell.vue";

const template = useTemplateStore();
</script>

<template>
	<table class="gap-3">
		<RowCategories />

		<tr
			v-for="(rowValue, rowKey, rowIndex) in template.completeTable"
			:key="rowKey"
		>
			<Cell
				v-for="(cellValue, cellKey, cellIndex) in rowValue"
				:key="cellKey"
				v-bind="cellValue"
				class="cell cell-width cell-padding td-rise"
			/>
		</tr>
	</table>
</template>
