<script setup lang="ts">
import { ref, watch } from "vue";
import { useTemplateStore } from "@/stores/template";
import DragHandle from "@/components/DragHandle.vue";
import type { Category } from "@/stores/template";

const props = defineProps<{
	category: Category;
}>();

const emit = defineEmits<{
	"change-category-name": [string, Category["id"]];
}>();

const template = useTemplateStore();

const textBox = ref<HTMLSpanElement | null>(null);
const textInput = ref(props.category.name);

watch(
	() => props.category,
	(val) => {
		textInput.value = val.name;
	},
);
</script>

<template>
	<th>
		<div class="group relative">
			<span
				ref="textBox"
				:contenteditable="template.editing"
				class="p-2 outline-none block"
				@input="textInput = ($event.target as HTMLSpanElement).innerText"
				@keydown.enter="textBox?.blur()"
				@blur="emit('change-category-name', textInput, props.category.id)"
				>{{ props.category.name }}</span
			>

			<p
				v-if="!textInput.length"
				class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"
			>
				{{ props.category.id }}
			</p>

			<DragHandle v-if="template.editing" />
		</div>
	</th>
</template>
