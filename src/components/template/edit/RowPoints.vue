<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useTemplateStore } from "@/stores/template";

import HeaderPoints from "./HeaderPoints.vue";
import Draggable from "./DraggableHeaderWrapper.vue";

import type { RowID } from "@/stores/template";

const { rows } = storeToRefs(useTemplateStore());
const draggingContents = ref<boolean>(false);

function updatePoints(id: RowID, newPoints: number) {
	rows.value[id] = newPoints;

	const ids = Object.keys(rows.value) as RowID[];
	const sortedPoints = Object.values(rows.value).sort((a, b) => (a > b ? 1 : -1));
	const sortedRows: typeof rows.value = {};

	for (let i = 0; i < 5; i++) {
		sortedRows[ids[i]] = sortedPoints[i];
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
		class="tr-flex col-start-1 row-start-2 mr-5 w-20 flex-col justify-around justify-self-end"
		@dragstart="draggingContents = true"
		@dragend="draggingContents = false"
	>
		<HeaderPoints
			:row="property as RowID"
			:points="value as number"
			:class="[
				{ 'bounce-x': draggingContents },
				{ dragging: dragging },
				{ 'drop-to': dropTo },
			]"
			@update-points="updatePoints"
		/>
	</Draggable>
</template>
