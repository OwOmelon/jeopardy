<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";

import RowPoints from "./RowPoints.vue";
import RowCategories from "./RowCategories.vue";
import RowHRs from "./RowHRs.vue";
import TableData from "./TableData.vue";

const template = useTemplateStore();
</script>

<template>
	<div class="table-wrapper">
		<table class="grid">
			<th class="col-start-2 row-start-1">
				<RowCategories />
				<RowHRs />
			</th>
			<RowPoints />

			<div class="col-start-2 row-start-2 flex flex-col gap-3">
				<TransitionGroup
					tag="tr"
					name="list-slide-left"
					v-for="(rowValue, rowKey, rowIndex) in template.completeTable"
					:key="rowKey"
					class="relative"
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
