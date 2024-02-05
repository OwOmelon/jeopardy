<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";

import RowCategories from "./RowCategories.vue";
import TableData from "./TableData.vue";

const template = useTemplateStore();
</script>

<template>
	<div class="table-wrapper">
		<table class="grid gap-3">
			<RowCategories />

			<tr
				v-for="(rowValue, rowKey, rowIndex) in template.getCompleteTable(true)"
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
