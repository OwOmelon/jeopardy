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

const focused = ref<boolean>(false);

watch(
	() => props.category,
	(val) => {
		textInput.value = val.name;
	},
);
</script>

<template>
	<th
		:class="[
			{ '!bg-red-400 !text-white': !template.editing },
			{ '!border-b-red-400': focused },
		]"
	>
		<div class="group relative">
			<span
				ref="textBox"
				:contenteditable="template.editing"
				:class="['block overflow-hidden text-ellipsis outline-none']"
				@focus="focused = true"
				@input="textInput = ($event.target as HTMLSpanElement).innerText"
				@keydown.enter="textBox?.blur()"
				@blur="
					() => {
						focused = false;
						emit('change-category-name', textInput, props.category.id);
					}
				"
				>{{
					template.editing
						? props.category.name
						: props.category.name || props.category.id
				}}</span
			>

			<span
				v-if="template.editing && !textInput.length"
				class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"
			>
				{{ props.category.id }}
			</span>

			<DragHandle v-if="template.editing" />
		</div>
	</th>
</template>
