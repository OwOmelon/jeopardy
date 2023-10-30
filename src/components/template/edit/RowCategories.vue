<script setup lang="ts">
import { computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import HeaderCategory from "./HeaderCategory.vue";
import draggable from "vuedraggable";

import type { Column } from "@/stores/template";

const template = useTemplateStore();

function changeColumnCategory(newName: string, id: Column["id"]): void {
	const columnIndex = template.columns.findIndex((column) => column.id === id);
	const column = template.columns[columnIndex];

	if (column.category === newName) return;

	column.category = newName;
}
</script>

<template>
	<draggable
		v-model="template.columns"
		item-key="element"
		tag="tr"
		handle=".handle"
		:animation="200"
		:disabled="!template.editing"
		class="items-end"
	>
		<template #item="{ element }">
			<HeaderCategory
				:column="element"
				@change-column-category="changeColumnCategory"
			/>
		</template>
	</draggable>
</template>
