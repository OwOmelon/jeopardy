<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";

import RowPoints from "./RowPoints.vue";
import RowCategories from "./RowCategories.vue";
import RowHRs from "./RowHRs.vue";
import TableData from "./TableData.vue";

const template = useTemplateStore();
</script>

<template>
	<div class="table-wrapper !pb-0">
		<table class="grid">
			<RowCategories class="col-start-2 row-start-1" />
			<RowHRs class="col-start-2 row-start-2" />

			<RowPoints class="row-start-2 row-end-4" />

			<div class="col-start-2 row-start-3 flex flex-col gap-3">
				<TransitionGroup
					tag="tr"
					name="list-slide-left"
					v-for="(rowValue, rowKey, rowIndex) in template.completeTable"
					:key="rowKey"
					class="tr-flex relative"
				>
					<template
						v-for="(cellValue, cellKey, columnIndex) in rowValue"
						:key="cellKey"
					>
						<TableData
							v-bind="cellValue"
							:data-values="template.checkTableDataProperties(rowKey, cellKey)"
							@edit="template.activeCell = cellValue"
						/>
					</template>
				</TransitionGroup>
			</div>
		</table>
	</div>
</template>

<style scoped lang="postcss">
:deep(.th-bg) {
	@apply bg-stone-500 text-stone-100;
}
</style>
