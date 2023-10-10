<script setup lang="ts">
import { computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import THCategory from "./THCategory.vue";
import draggable from "vuedraggable";

import type { Category } from "@/stores/template";

const template = useTemplateStore();

function changeCategoryName(newName: string, id: Category["id"]): void {
	const categoryIndex = template.columns.findIndex(
		(column) => column.id === id,
	);
	const category = template.columns[categoryIndex];

	if (category.name === newName) return;

	category.name = newName;
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
		:class="[
			template.editing ? 'col-start-2' : 'col-start-1',
			'row-start-1 items-end gap-3',
		]"
	>
		<template #item="{ element }">
			<THCategory
				:category="element"
				@change-category-name="changeCategoryName"
			/>
		</template>
	</draggable>
</template>
