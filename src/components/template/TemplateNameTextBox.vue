<script setup lang="ts">
import { ref } from "vue";
import { useTemplateStore } from "@/stores/template";

const template = useTemplateStore();

const textBox = ref<HTMLSpanElement | null>(null);
const textInput = ref<string>(template.name);
</script>

<template>
	<div class="relative mx-auto w-fit min-w-[9em] text-3xl">
		<span
			ref="textBox"
			:contenteditable="template.editing"
			class="break-words border-y-2 border-transparent p-2 outline-none transition-colors focus:border-b-red-400"
			@keydown.enter="textBox?.blur()"
			@blur="template.name = textInput"
			@input="textInput = ($event.target as HTMLSpanElement).innerText"
		>
			{{
				template.editing
					? template.name
					: template.name ||
					  (template.isEmpty
							? "your jeopardy template is empty D:"
							: "template name")
			}}
		</span>

		<span
			v-if="!textInput.length && template.editing"
			class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap opacity-50"
			>template name</span
		>
	</div>
</template>

<style scoped lang="postcss">
span {
	@apply block text-center font-bold;
}
</style>
