<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useTemplateStore } from "@/stores/template";
import { v4 as uuidv4 } from "uuid";
import type { RawTemplateData } from "@/stores/template";

const template = useTemplateStore();

const show = ref<boolean>(false);

const history = ref<RawTemplateData[]>([]);

const rawTemplateDataNoID = computed(() => {
	const { id, ...rest } = template.rawTemplateData;
	return rest;
});

watch(
	rawTemplateDataNoID,
	() => {
		template.id = uuidv4();

		history.value.push(template.rawTemplateData);
	},
	{ deep: true, immediate: true },
);
</script>

<template>
	<ul class="fixed right-0 top-0 rounded bg-black/50 p-2 text-xs text-white">
		<li v-for="template in history" :key="template.id">{{ template }}</li>

		<button
			type="button"
			class="absolute right-full top-0 mr-2 grid aspect-square h-full place-items-center rounded-[inherit] bg-[inherit]"
		>
			|||
		</button>
	</ul>
</template>
