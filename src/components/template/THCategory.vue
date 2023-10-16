<script setup lang="ts">
import { ref, watch } from "vue";
import { useTemplateStore } from "@/stores/template";

import DragHandle from "@/components/DragHandle.vue";
import TextBox from "@/components/TextBox.vue";

import type { Category } from "@/stores/template";

const props = defineProps<{
	category: Category;
}>();

const emit = defineEmits<{
	"change-category-name": [string, Category["id"]];
}>();

const template = useTemplateStore();

const textInput = ref(props.category.name);

watch(
	() => props.category,
	(val) => {
		textInput.value = val.name;
	},
);
</script>

<template>
	<th class="group relative">
		<TextBox
			v-model="textInput"
			:placeholder="props.category.id"
			:disabled="!template.editing"
			focus-classes="!border-b-red-400"
			blur-on-keydown-enter
			:class="[
				{ '!bg-red-400 !text-white': !template.editing },
				'cell cell-padding',
			]"
			@blur="emit('change-category-name', textInput, props.category.id)"
		/>

		<span v-if="!props.category.name.length && !template.editing">
			{{ props.category.id }}
		</span>

		<DragHandle v-if="template.editing" />
	</th>
</template>
