<script setup lang="ts">
import { ref } from "vue";
import { useTemplateStore } from "@/stores/template";

import THPoints from "./THPoints.vue";
import draggable from "vuedraggable";

const template = useTemplateStore();

const dragging = ref<boolean>(false);

function updatePoints(newPoints: number, rowIndex: number) {
	template.points[rowIndex] = newPoints;

	template.points.sort((a, b) => (a > b ? 1 : -1));
}
</script>

<template>
	<draggable
		v-model="template.rows"
		item-key="element"
		tag="tr"
		handle=".handle"
		:animation="200"
		class="col-start-1 row-start-2 grid items-center gap-3"
	>
		<template #item="{ element, index }">
			<THPoints
				:row-index="index"
				:points="template.points[index]"
				@update-points="updatePoints"
			/>
		</template>
	</draggable>
</template>
