<script setup lang="ts">
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
	<div class="col-start-2">
		<hr class="opacity-0" />

		<draggable
			v-model="template.columns"
			item-key="element"
			tag="tr"
			handle=".handle"
			:animation="200"
			class="grid grid-cols-5 items-end gap-3"
		>
			<template #item="{ element }">
				<THCategory
					:category="element"
					@change-category-name="changeCategoryName"
				/>
			</template>
		</draggable>
	</div>
</template>
