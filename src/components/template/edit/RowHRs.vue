<script setup lang="ts">
import { computed } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useCustomStylesheet } from "@/composables/custom_stylesheet";

import type { RowID, ColumnID } from "@/stores/template";

const template = useTemplateStore();
const stylesheet = useCustomStylesheet("table-data-status-bar-indicator");

const hrColors = computed<{ id: ColumnID; color: string; text: string }[]>(
	() => {
		const rowIDs = Object.keys(template.rows) as RowID[];
		const columnIDs = Object.keys(template.columns) as ColumnID[];

		return columnIDs.map((column) => {
			let color = "#f87171";
			let text = "this column is empty";

			const cdv = {
				empty: 0,
				partial: 0,
				complete: 0,
			};

			rowIDs.forEach((row) => {
				cdv[template.checkTableDataProperties(row, column)]++;
			});

			if (cdv.empty !== 5) {
				if (cdv.complete === columnIDs.length) {
					color = "#4ade80";
					text = "this column is complete";
				} else {
					color = "#facc15";
					text = "this column is incomplete";
				}
			}

			return { id: column, color, text };
		});
	},
);

function writeCustomeStylesheet(column: ColumnID | null): void {
	stylesheet.write(
		column === null
			? ""
			: `.${column} .data-values-status-bar { opacity: 1 !important };`,
	);
}
</script>

<template>
	<TransitionGroup tag="tr" name="list-slide-left" class="tr-flex my-2">
		<div
			v-for="hr in hrColors"
			:key="hr.id"
			class="cell-width group relative flex justify-center"
			@mouseenter="writeCustomeStylesheet(hr.id)"
			@mouseleave="writeCustomeStylesheet(null)"
		>
			<hr
				:style="{ borderColor: hr.color }"
				class="my-1 grow rounded-full border-t-2"
			/>

			<div
				:style="{ backgroundColor: hr.color }"
				class="pointer-events-none absolute -top-10 isolate rounded bg-stone-300 p-1 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<span class="text-[0.6rem] font-semibold text-[black]">
					{{ hr.text }}
				</span>

				<div
					class="absolute -bottom-1 left-1/2 z-[-5] aspect-square w-3 -translate-x-1/2 rotate-45 rounded-sm bg-[inherit]"
				/>
			</div>
		</div>
	</TransitionGroup>
</template>
