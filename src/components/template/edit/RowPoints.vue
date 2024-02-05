<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTemplateStore } from "@/stores/template";

import HeaderPoints from "./HeaderPoints.vue";
import Draggable from "./DraggableHeaderWrapper.vue";

import type { RowID } from "@/stores/template";

const { rows } = storeToRefs(useTemplateStore());

function updatePoints(id: RowID, newPoints: number) {
	rows.value[id] = newPoints;

	const ids = Object.keys(rows.value) as RowID[];
	const points = Object.values(rows.value).sort((a, b) => (a > b ? 1 : -1));

	const sortedRows: typeof rows.value = {};

	for (let i = 0; i < 5; i++) {
		sortedRows[ids[i]] = points[i];
	}

	rows.value = sortedRows;
}
</script>

<template>
	<Draggable
		v-model="rows"
		tag="tr"
		group="points"
		handle="handle"
		transition-name="list-slide-left"
		v-slot="{ value, property, dragging, dropTo }"
		class="col-start-1 row-start-2 mr-5 w-20 flex-col justify-around gap-3 justify-self-end"
	>
		<HeaderPoints
			:row="property as RowID"
			:points="value as number"
			@update-points="updatePoints"
		/>
	</Draggable>
</template>
