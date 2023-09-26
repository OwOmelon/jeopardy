<script setup lang="ts">
import { ref } from "vue";
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
			<TRPoints />
			<TRCategories />

			<div class="flex flex-col gap-3">
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

	<ModalWrapper :show="template.activeCellData ? true : false">
		<TDEditor />
	</ModalWrapper>
</template>

<style scoped lang="postcss">
:deep(th > div) {
	@apply relative rounded border-y-2 border-transparent border-white bg-white shadow !shadow-black/30 transition-[border-color,_box-shadow,_transform];
}

:deep(th > div:has(input:focus, span:focus)) {
	@apply -translate-y-2 scale-110 border-b-stone-600 shadow-lg;
}

td {
	@apply h-20 cursor-pointer rounded bg-stone-300 p-2 text-stone-800 shadow !shadow-black/30 transition-[background-color,_color,_box-shadow,_transform] hover:-translate-y-2 hover:scale-105 hover:shadow-lg active:scale-100;
}

.td-missing-data {
	@apply !bg-stone-500 !text-stone-50;
}
</style>
