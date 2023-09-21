<script setup lang="ts">
import { ref } from "vue";
import { useTemplateStore } from "@/stores/template";

import TemplateNameTextBox from './TemplateNameTextBox.vue'
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
		
		<table class="m-auto grid max-w-[1000px] gap-5">
		<TRPoints />
		<TRCategories />

		<div class="flex w-[90vw] max-w-[900px] flex-col gap-3">
			<TransitionGroup
				tag="tr"
				move-class="duration-300 ease-out"
				v-for="(rowValue, rowKey, rowIndex) in template.tableDisplay"
				:key="rowKey"
				class="relative grid w-full grid-cols-5 gap-3"
			>
				<template
					v-for="(cellValue, cellKey, columnIndex) in rowValue"
					:key="cellKey"
				>
					<TD
						:row-i-d="rowKey"
						:column-i-d="cellKey"
						:data="cellValue"
						:hovered="rowKey === TDHovered.row && cellKey === TDHovered.column"
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
	@apply relative rounded border-b-2 border-transparent bg-stone-50 shadow !shadow-black/30 transition-[border-color,_box-shadow,_transform];
}

:deep(th > div:has(input:focus, span:focus)) {
	@apply -translate-y-2 scale-110 border-stone-600 shadow-lg;
}
</style>
