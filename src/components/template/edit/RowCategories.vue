<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTemplateStore } from "@/stores/template";

import HeaderCategory from "./HeaderCategory.vue";
import Draggable from "./DraggableHeaderWrapper.vue";

import type { ColumnID } from "@/stores/template";

const { columns } = storeToRefs(useTemplateStore());

function changeColumnCategory(id: ColumnID, newCategory: string): void {
	// const columnIndex = template.columns.findIndex((column) => column.id === id);
	// const column = template.columns[columnIndex];

	// if (columns.value[id] === newName) return;

	columns.value[id] = newCategory;
}
</script>

<template>
	<Draggable
		v-model="columns"
		tag="tr"
		group="categories"
		handle="handle"
		transition-name="list-slide-left"
		class="tr-flex items-end"
		v-slot="{ value, property, dragging, dropTo }"
	>
			<HeaderCategory
				:column="property as ColumnID"
				:category="value as string"
				@change-column-category="changeColumnCategory"
			/>
	</Draggable>
</template>
