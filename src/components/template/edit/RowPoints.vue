<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useTemplateStore } from "@/stores/template";

import HeaderPoints from "./HeaderPoints.vue";
import Draggable from "./draggable//DraggableHeaderWrapper.vue";

import type { RowID } from "@/stores/template";

const { rows } = storeToRefs(useTemplateStore());
const { updateRowPoints, sortRows } = useTemplateStore();

const draggingContents = ref<boolean>(false);
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
		@dragend="
			() => {
				draggingContents = false;
				sortRows();
			}
		"
	>
		<HeaderPoints
			:row="property as RowID"
			:points="value as number"
			:class="[
				{ 'bounce-x': draggingContents },
				{ dragging: dragging },
				{ 'drop-to': dropTo },
			]"
			@update-points="
				(row, points) => {
					updateRowPoints(row, points);
					sortRows(true);
				}
			"
		/>
	</Draggable>
</template>
