<script setup lang="ts">
import { computed } from "vue";
import { useTemplateStore } from "@/stores/template";

import type { RowID, ColumnID } from "@/stores/template";

const template = useTemplateStore();

const hrColors = computed<{ id: ColumnID; color: string; text: string }[]>(
	() => {
		const rowIDs = Object.keys(template.rows) as RowID[];
		const columnIDs = Object.keys(template.columns) as ColumnID[];

		return columnIDs.map((column) => {
			const columnDataValues = rowIDs.map((row) =>
				template.checkTableDataProperties(row, column),
			);

			let color = "border-red-400";
			let text = "this column is empty";

			if (columnDataValues.some((check1) => check1 !== "empty")) {
				if (columnDataValues.every((check2) => check2 === "complete")) {
					color = "border-green-400";
					text = "this column is complete";
				} else {
					color = "border-yellow-400";
					text = "this column is incomplete";
				}
			}

			return { id: column, color, text };
		});
	},
);
</script>

<template>
	<TransitionGroup tag="tr" name="list-slide-left" class="tr-flex my-2">
		<div
			v-for="hr in hrColors"
			:key="hr.id"
			class="cell-width group relative flex justify-center"
		>
			<hr :class="[hr.color, 'my-1 grow rounded-full border-t-2']" />

			<div
				class="pointer-events-none absolute -top-9 rounded bg-stone-300 p-1 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<span class="text-[0.6rem] font-semibold text-stone-600">
					{{ hr.text }}
				</span>

				<div
					class="absolute left-1/2 top-6 z-[-5] aspect-square w-3 -translate-x-1/2 rotate-45 rounded-sm bg-[inherit]"
				/>
			</div>
		</div>
	</TransitionGroup>
</template>
