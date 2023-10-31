<script setup lang="ts">
import { computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import type { Column } from "@/stores/template";

const template = useTemplateStore();

const hrColors = computed<{ id: Column["id"]; color: string; text: string }[]>(
	() => {
		return template.columns.map((column) => {
			const columnDataValues = template.rows.map((row) =>
				template.checkTableDataValues(row, column.id),
			);

			let color = "border-red-400";
			let text = "this column empty";

			if (columnDataValues.some((check1) => check1 !== "empty")) {
				if (columnDataValues.every((check2) => check2 === "complete")) {
					color = "border-green-400";
					text = "this column is complete";
				} else {
					color = "border-yellow-400";
					text = "this column is incomplete";
				}
			}

			return { id: column.id, color, text };
		});
	},
);
</script>

<template>
	<TransitionGroup tag="tr" name="list-slide-left" class="my-2">
		<div
			v-for="hr in hrColors"
			:key="hr.id"
			class="cell-width group relative flex justify-center"
		>
			<hr :class="[hr.color, 'my-1 grow rounded-full border-t-2']" />

			<div
				class="pointer-events-none absolute -top-9 rounded bg-stone-700 p-1 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<span class="text-[0.6rem] text-stone-50">{{ hr.text }}</span>

				<div
					class="absolute left-1/2 top-6 z-[-5] aspect-square w-3 -translate-x-1/2 rotate-45 rounded-sm bg-[inherit]"
				/>
			</div>
		</div>
	</TransitionGroup>
</template>
