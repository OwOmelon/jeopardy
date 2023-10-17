<script setup lang="ts">
import { ref, watch } from "vue";
import { useTemplateStore } from "@/stores/template";

import TextBox from "@/components/TextBox.vue";

const template = useTemplateStore();

const textInput = ref<string>(template.name);

watch(
	() => template.name,
	(name) => {
		textInput.value = name;
	},
);

watch(
	() => template.editing,
	(value) => {
		if (value) {
			textInput.value = template.name;
		} else {
			textInput.value = template.isEmpty
				? "your jeopardy template is empty D:"
				: "template name";
		}
	},
);
</script>

<template>
	<TextBox
		v-model="textInput"
		placeholder="insert template name"
		focus-classes="!border-b-red-400"
		:disabled="!template.editing"
		blur-on-keydown-enter
		:class="[
			{ 'border-y-2 border-transparent border-b-stone-600': template.editing },
			'mx-auto w-fit min-w-[12em] p-2 text-center text-3xl font-bold transition-colors',
		]"
		@blur="template.name = textInput"
	/>
</template>
