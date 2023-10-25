<script setup lang="ts">
import { ref, computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import TRPoints from "./TRPoints.vue";
import TRCategories from "./TRCategories.vue";
import Cell from "./Cell.vue";
import TDEditor from "./TDEditor.vue";
import ModalWrapper from '@/components/ModalWrapper.vue'

import type { RowID, Column } from "@/stores/template";

const template = useTemplateStore();

const TDHovered = ref<{
	row: RowID | null;
	column: Column["id"] | null;
}>({
	row: null,
	column: null,
});

const horizontalTrTemplateColumns = computed<string>(() => {
	return `repeat(${template.categoriesDisplay.length}, 140px)`;
});

function TDMouseEnter(row: RowID, column: Column["id"]): void {
	TDHovered.value.row = row;
	TDHovered.value.column = column;
}

function TDMouseLeave(): void {
	TDHovered.value.row = null;
	TDHovered.value.column = null;
}
</script>

<template>
	<table class="grid w-full overflow-auto p-8">
		<TRPoints v-if="template.editing" />
		<TRCategories />

		<div class="col-start-2 row-start-2 flex flex-col gap-3">
			<TransitionGroup
				tag="tr"
				:name="template.editing ? 'slide' : 'disabled'"
				v-for="(rowValue, rowKey, rowIndex) in template.tableDisplay"
				:key="rowKey"
				class="relative grid gap-3"
			>
				<template
					v-for="(cellValue, cellKey, columnIndex) in rowValue"
					:key="cellKey"
				>
					<Cell
						:cell="cellValue"
						:hovered="rowKey === TDHovered.row && cellKey === TDHovered.column"
						@on-mouse-enter="TDMouseEnter"
						@on-mouse-leave="TDMouseLeave"
					/>
				</template>
			</TransitionGroup>
		</div>
	</table>

	<ModalWrapper :show="template.activeCell ? true : false">
		<TDEditor />
	</ModalWrapper>
</template>

<style scoped lang="postcss">
:deep(tr) {
	@apply grid;
	grid-template-columns: v-bind(horizontalTrTemplateColumns);
}

:deep(.cell) {
	@apply rounded border-y-2 border-transparent bg-white shadow !shadow-black/30 transition-colors;
}
</style>
