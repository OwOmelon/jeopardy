<script setup lang="ts">
import { ref } from "vue";
import { useTemplateStore } from "@/stores/template";

import HeaderPoints from "./HeaderPoints.vue";
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
		:disabled="!template.editing"
		class="col-start-1 row-start-2 mr-5 w-20 flex-col justify-around gap-3 justify-self-end"
	>
		<template #item="{ element, index }">
			<HeaderPoints
				:row-index="index"
				:points="template.points[index]"
				@update-points="updatePoints"
			/>
		</template>
	</draggable>
</template>
