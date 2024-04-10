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
					v-for="(columns, row, rowIndex) in template.tableDataRows"
					:key="row"
					class="tr-flex relative"
				>
					<template
						v-for="(cell, column, columnIndex) in columns"
						:key="column"
					>
						<TableData
							v-bind="cell"
							:data-values="template.checkTableDataProperties(row, column)"
							@edit="template.setActiveDataCell({ row, column })"
						/>
					</template>
				</TransitionGroup>
			</div>
		</table>
	</div>
</template>

<style scoped lang="postcss">
:deep(.header-colors) {
	@apply bg-stone-300 text-stone-800;
}

:deep(.drop-to .cell) {
	@apply !bg-yellow-400 !text-white;
}

:deep(.dragging-header .cell) {
	@apply opacity-25;
}

/* --- */

:deep(.drop-to-y .cell) {
	@apply -translate-y-1;
}

:deep(.bounce-y .bounce-y-wrapper) {
	animation: bounce-y 2s ease-in-out infinite;
}

@keyframes bounce-y {
	0%,
	100% {
		transform: translateY(0);
	}

	50% {
		transform: translateY(-0.5rem);
	}
}

/* --- */

:deep(.drop-to-x .cell) {
	@apply -translate-x-1;
}

:deep(.bounce-x .bounce-x-wrapper) {
	animation: bounce-x 2s ease-in-out infinite;
}

@keyframes bounce-x {
	0%,
	100% {
		transform: translateX(0);
	}

	50% {
		transform: translateX(-0.5rem);
	}
}
</style>
