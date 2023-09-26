<script setup lang="ts">
import { ref, computed } from "vue";
import { useTemplateStore } from "@/stores/template";

const template = useTemplateStore();

const textBox = ref<HTMLSpanElement | null>(null);
const textInput = ref<string>(template.name);
</script>

<template>
	<div class="relative mb-5">
		<span
			ref="textBox"
			:contenteditable="template.editing"
			class="outline-none"
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
			class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"
			>template name</span
		>
	</div>
</template>

<style scoped lang="postcss">
span {
	@apply block whitespace-nowrap text-center text-3xl font-bold;
}
</style>
