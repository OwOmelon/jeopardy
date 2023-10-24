<script setup lang="ts">
import { ref, watch } from "vue";
import { useTemplateStore } from "@/stores/template";

import DragHandle from "@/components/DragHandle.vue";
import TextBox from "@/components/TextBox.vue";

import type { Column } from "@/stores/template";

const props = defineProps<{
	column: Column;
}>();

const emit = defineEmits<{
	"change-column-category": [string, Column["id"]];
}>();

const template = useTemplateStore();

const textInput = ref(props.column.category);

watch(
	() => props.column,
	(val) => {
		textInput.value = val.category;
	},
);
</script>

<template>
	<th class="group relative">
		<TextBox
			v-model="textInput"
			:placeholder="props.column.id"
			:disabled="!template.editing"
			focus-classes="!border-b-red-400"
			blur-on-keydown-enter
			:class="[
				{ '!bg-red-400 !text-white': !template.editing },
				'cell cell-padding',
			]"
			@blur="emit('change-column-category', textInput, props.column.id)"
		/>

		<DragHandle v-if="template.editing" />
	</th>
</template>
