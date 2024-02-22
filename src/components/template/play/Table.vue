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
				v-for="(columns, row, rowIndex) in filteredTableDataRows"
				:key="row"
				class="tr-flex"
			>
				<TableData
					v-for="(cell, column, cellIndex) in columns"
					v-bind="cell"
					:is-empty="template.checkTableDataProperties(row, column) === 'empty'"
					:key="column"
					@reveal="template.setActiveDataCell({ row, column })"
				/>
			</tr>
		</table>
	</div>
</template>
