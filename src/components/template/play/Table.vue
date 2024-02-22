<script setup lang="ts">
import { inject } from "vue";
import { useTemplateStore } from "@/stores/template";

import type { TableDataRows } from "@/stores/template";

import RowCategories from "./RowCategories.vue";
import TableData from "./TableData.vue";

const template = useTemplateStore();

const filteredTableDataRows = inject(
	"filtered-table-data-rows",
) as TableDataRows;
</script>

<template>
	<div class="table-wrapper">
		<table class="grid gap-3">
			<RowCategories />

			<tr
				v-for="(rowValue, rowKey, rowIndex) in filteredTableDataRows"
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
					@reveal="template.activeTableDataCell = cellValue"
				/>
			</tr>
		</table>
	</div>
</template>
