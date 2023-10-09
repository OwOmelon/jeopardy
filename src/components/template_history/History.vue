<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useTemplateStore } from "@/stores/template";
import { v4 as uuidv4 } from "uuid";

import HistoryItem from "./HistoryItem.vue";

import type { RawTemplateData } from "@/stores/template";

export type HistoryTemplate = RawTemplateData & { dateModified: Date };

const template = useTemplateStore();

const show = ref<boolean>(false);
const activeHistoryItem = ref<number>(-1);

function setActiveItem(index: number) {
	if (index === activeHistoryItem.value) {
		activeHistoryItem.value = -1;
	} else {
		activeHistoryItem.value = index;
	}
}

const history = ref<(RawTemplateData & { dateModified: Date })[]>([]);
const allowHistoryLog = ref<boolean>(true);

const historyIndexOfCurrentTemplate = computed<number>(() => {
	return history.value.findIndex((temp) => temp.id === template.id);
});

function loadSave(save: RawTemplateData) {
	allowHistoryLog.value = false;

	template.rawTemplateData = save;
}

watch(
	() => [
		template.name,
		template.points,
		template.rows,
		template.columns,
		template.rawTable,
	],
	() => {
		if (!allowHistoryLog.value) {
			allowHistoryLog.value = true;

			return;
		}

		template.id = uuidv4();

		console.log(template.rawTemplateData.id);

		history.value.push({
			...template.rawTemplateData,
			dateModified: new Date(),
		});
	},
	{ deep: true, immediate: true },
);
</script>

<template>
	<ul
		:class="[
			{ 'translate-x-full': show },
			'fixed right-0 top-0 z-50 w-[450px] rounded bg-black/50 p-2 text-xs text-white backdrop-blur transition-transform duration-300',
		]"
	>
		<HistoryItem
			v-for="(template, index) in history"
			:key="template.id"
			:template="template"
			:index="index"
			:is-active="index === activeHistoryItem"
			@set-active-item="setActiveItem"
			@load-save="loadSave"
		/>

		<button
			type="button"
			class="absolute right-full top-0 mr-2 grid aspect-square place-items-center rounded-[inherit] bg-[inherit] p-5"
			@click="show = !show"
		>
			|||
		</button>
	</ul>
</template>
