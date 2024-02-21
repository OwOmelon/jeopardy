<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useTemplateStore } from "@/stores/template";

import HeaderCategory from "./HeaderCategory.vue";
import Draggable from "./draggable//DraggableHeaderWrapper.vue";

import type { ColumnID } from "@/stores/template";

const { columns } = storeToRefs(useTemplateStore());
const { updateColumnCategory } = useTemplateStore()

const draggingContents = ref<boolean>(false);
</script>

<template>
	<Draggable
		v-model="columns"
		tag="tr"
		group="categories"
		handle="handle"
		transition-name="list-slide-left"
		v-slot="{ value, property, dragging, dropTo }"
		class="tr-flex items-end"
		@dragstart="draggingContents = true"
		@dragend="draggingContents = false"
	>
		<HeaderCategory
			:column="property as ColumnID"
			:category="value as string"
			:class="[
				{ 'bounce-y': draggingContents },
				{ dragging: dragging },
				{ 'drop-to': dropTo },
			]"
			@change-column-category="updateColumnCategory"
		/>
	</Draggable>
</template>
