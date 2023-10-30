<script setup lang="ts">
import { computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import HeaderCategory from "./HeaderCategory.vue";
import draggable from "vuedraggable";

import type { Column } from "@/stores/template";

const template = useTemplateStore();

const hrColors = computed<{ id: Column["id"]; color: string }[]>(() => {
	return template.columns.map((column) => {
		let emptyCells = 0;

		template.rows.forEach((row) => {
			if (template.checkTableDataValues(row, column.id) === "empty") {
				emptyCells++;
			}
		});

		const color =
			emptyCells === 0
				? "border-green-400"
				: emptyCells === 5
				? "border-red-400"
				: "border-yellow-400";

		return { id: column.id, color };
	});
});

function changeColumnCategory(newName: string, id: Column["id"]): void {
	const columnIndex = template.columns.findIndex((column) => column.id === id);
	const column = template.columns[columnIndex];

	if (column.category === newName) return;

	column.category = newName;
}
</script>

<template>
	<thead class="col-start-2 row-start-1 items-end">
		<draggable
			v-model="template.columns"
			item-key="element"
			tag="tr"
			handle=".handle"
			:animation="200"
			:disabled="!template.editing"
		>
			<template #item="{ element }">
				<HeaderCategory
					:column="element"
					@change-column-category="changeColumnCategory"
				/>
			</template>
		</draggable>

		<TransitionGroup tag="tr" name="list-slide-left" class="my-3">
			<hr
				v-for="hr in hrColors"
				:key="hr.id"
				:class="[hr.color, 'cell-width rounded-full border-t-2']"
			/>
		</TransitionGroup>
	</thead>
</template>
