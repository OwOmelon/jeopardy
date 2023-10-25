<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";

import CellCategory from "./CellCategory.vue";
import draggable from "vuedraggable";

import type { Column } from "@/stores/template";

const template = useTemplateStore();

function changeColumnCategory(newName: string, id: Column["id"]): void {
	const columnIndex = template.columns.findIndex(
		(column) => column.id === id,
	);
	const column = template.columns[columnIndex];

	if (column.category === newName) return;

	column.category = newName;
}
</script>

<template>
	<draggable
		v-model="template.categoriesDisplay"
		item-key="element"
		tag="tr"
		handle=".handle"
		:animation="200"
		:disabled="!template.editing"
		class="row-start-1 items-end gap-3 col-start-2"
	>
		<template #item="{ element }">
			<CellCategory
				:column="element"
				@change-column-category="changeColumnCategory"
			/>
		</template>
	</draggable>
</template>
