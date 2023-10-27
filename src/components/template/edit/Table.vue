<script setup lang="ts">
import { ref, computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import RowPoints from "./RowPoints.vue";
import RowCategories from "./RowCategories.vue";
import TableData from "./TableData.vue";
import TableDataEditor from "./TableDataEditor.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";

import type { RowID, Column } from "@/stores/template";

const template = useTemplateStore();

const TDHovered = ref<{
	row: RowID | null;
	column: Column["id"] | null;
}>({
	row: null,
	column: null,
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
	<table class="grid">
		<RowPoints />
		<RowCategories />

		<div class="col-start-2 row-start-2 flex flex-col gap-3">
			<TransitionGroup
				tag="tr"
				:name="template.editing ? 'slide' : 'disabled'"
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
						:hovered="rowKey === TDHovered.row && cellKey === TDHovered.column"
						@on-mouse-enter="TDMouseEnter"
						@on-mouse-leave="TDMouseLeave"
						@edit="template.activeCell = cellValue"
					/>
				</template>
			</TransitionGroup>
		</div>

		<ModalWrapper :show="template.activeCell ? true : false">
			<TableDataEditor />
		</ModalWrapper>
	</table>
</template>

<style scoped lang="postcss">
:deep(.th-bg) {
	@apply bg-white;
}
</style>
