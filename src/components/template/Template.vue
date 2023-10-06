<script setup lang="ts">
import { ref, computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import TemplateNameTextBox from "./TemplateNameTextBox.vue";
import TRPoints from "./TRPoints.vue";
import TRCategories from "./TRCategories.vue";
import TD from "./TD.vue";
import TDEditor from "./TDEditor.vue";
import ModalWrapper from "../ModalWrapper.vue";

import type { Row, Category } from "@/stores/template";

const template = useTemplateStore();

const TDHovered = ref<{
	row: Row | null;
	column: Category["id"] | null;
}>({
	row: null,
	column: null,
});

const horizontalTrTemplateColumns = computed<string>(() => {
	return `repeat(${template.categoriesDisplay.length}, minmax(0, 1fr))`;
});

function TDMouseEnter(row: Row, column: Category["id"]): void {
	TDHovered.value.row = row;
	TDHovered.value.column = column;
}

function TDMouseLeave(): void {
	TDHovered.value.row = null;
	TDHovered.value.column = null;
}
</script>

<template>
	<div>
		<TemplateNameTextBox />

		<table class="m-auto grid grid-cols-[auto,_900px] gap-5">
			<TRPoints v-if="template.editing" />
			<TRCategories />

			<div class="col-start-2 row-start-2 flex flex-col gap-3">
				<TransitionGroup
					tag="tr"
					move-class="duration-300 ease-out"
					v-for="(rowValue, rowKey, rowIndex) in template.tableDisplay"
					:key="rowKey"
					class="relative grid grid-cols-5 gap-3"
				>
					<template
						v-for="(cellValue, cellKey, columnIndex) in rowValue"
						:key="cellKey"
					>
						<TD
							:row-i-d="rowKey"
							:column-i-d="cellKey"
							:data="cellValue"
							:hovered="
								rowKey === TDHovered.row && cellKey === TDHovered.column
							"
							@on-mouse-enter="TDMouseEnter"
							@on-mouse-leave="TDMouseLeave"
						/>
					</template>
				</TransitionGroup>
			</div>
		</table>
	</div>

	<ModalWrapper
		:show="template.activeCellData && template.editing ? true : false"
	>
		<TDEditor />
	</ModalWrapper>
</template>

<style scoped lang="postcss">
:deep(tr) {
	@apply grid;
	grid-template-columns: v-bind(horizontalTrTemplateColumns);
}

:deep(.textBox) {
	@apply rounded border-y-2 border-transparent bg-white shadow !shadow-black/30 transition-colors focus:border-b-red-400;
}
</style>
