<script setup lang="ts">
import { ref, computed, watch } from "vue";
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
	<th class="cell-width group relative">
		<TextBox
			v-model="textInput"
			:placeholder="props.column.id"
			:disabled="!template.editing"
			focus-classes="!border-stone-100"
			blur-on-keydown-enter
			:class="[
				{ '!bg-red-400 !text-white': !template.editing },
				'cell cell-padding th-bg',
			]"
			@blur="emit('change-column-category', textInput, props.column.id)"
		/>

		<DragHandle v-if="template.editing" />
	</th>
</template>
