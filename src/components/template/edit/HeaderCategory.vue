<script setup lang="ts">
import { ref, watch } from "vue";
import { useTemplateStore } from "@/stores/template";

import DragHandle from "@/components/DragHandle.vue";
import TextBox from "@/components/TextBox.vue";

import type { ColumnID } from "@/stores/template";

const props = defineProps<{
	column: ColumnID;
	category: string
}>();

const emit = defineEmits<{
	"change-column-category": [string, ColumnID];
}>();

const template = useTemplateStore();

const textInput = ref(props.category);

watch(
	() => props.category,
	(val) => {
		textInput.value = val;
	},
);
</script>

<template>
	<th class="cell-width group relative">
		<TextBox
			v-model="textInput"
			:placeholder="props.column"
			:disabled="!template.editing"
			focus-classes="!border-stone-100"
			blur-on-keydown-enter
			:class="[
				{ '!bg-red-400 !text-white': !template.editing },
				'cell cell-padding th-bg',
			]"
			@blur="emit('change-column-category', textInput, props.column)"
		/>

		<DragHandle v-if="template.editing" />
	</th>
</template>
