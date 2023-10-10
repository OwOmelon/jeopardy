<script setup lang="ts">
import { ref, computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import TemplateNameTextBox from "./TemplateNameTextBox.vue";
import TRPoints from "./TRPoints.vue";
import TRCategories from "./TRCategories.vue";
import TD from "./TD.vue";

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
	return `repeat(${template.categoriesDisplay.length}, 140px)`;
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
	<div class="mt-10 w-full">
		<TemplateNameTextBox />

		<table
			:class="[
				{ 'gap-x-0': !template.editing },
				'grid gap-5 w-full overflow-auto p-8',
			]"
		>
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
</template>

<style scoped lang="postcss">
:deep(tr) {
	@apply grid;
	grid-template-columns: v-bind(horizontalTrTemplateColumns);
}

:deep(th) {
	@apply rounded border-y-2 border-transparent bg-white shadow !shadow-black/30 transition-colors;
}

:deep(th, td) {
	@apply p-[0.5em];
}

th,
td {
	@apply p-[0.5em];
}
</style>

<style scoped lang="scss">
.slide {
	&-move,
	&-enter-active,
	&-leave-active {
		transition: all 0.25s cubic-bezier(0.55, 0, 0.1, 1);
	}
}

.disabled {
	&-move,
	&-enter-active,
	&-leave-active {
		transition: all 0s;
	}
}
</style>
