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
</script>

<template>
	<caption
		class="mx-auto block w-fit min-w-[12em] text-center text-3xl font-bold"
	>
		<TextBox
			v-model="textInput"
			placeholder="insert template name"
			focus-classes="!border-b-stone-300"
			:disabled="!template.editing"
			blur-on-keydown-enter
			:class="[
				template.editing ? 'text-stone-400' : '',
				{
					'border-b-stone-600': template.editing,
				},
				'border-y-2 border-transparent p-2 transition-colors',
			]"
			@blur="template.name = textInput"
		/>
	</caption>
</template>
