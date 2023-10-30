<script setup lang="ts">
import { computed } from "vue";
import { useTemplateStore } from "@/stores/template";

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
</script>

<template>
	<TransitionGroup tag="tr" name="list-slide-left" class="my-3">
		<hr
			v-for="hr in hrColors"
			:key="hr.id"
			:class="[hr.color, 'cell-width rounded-full border-t-2']"
		/>
	</TransitionGroup>
</template>
