<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useTemplateStore } from "@/stores/template";
import { v4 as uuidv4 } from "uuid";

import HistoryItem from "./HistoryItem.vue";

import type { RawTemplateData } from "@/stores/template";

export type HistoryTemplate = RawTemplateData & {
	iteration: number;
	dateModified: Date;
};

const template = useTemplateStore();

// ---------------

const show = ref<boolean>(false);
const activeHistoryItem = ref<number>(-1);

function setActiveItem(index: number) {
	if (index === activeHistoryItem.value) {
		activeHistoryItem.value = -1;
	} else {
		activeHistoryItem.value = index;
	}
}

watch(show, () => {
	activeHistoryItem.value = -1;
});

// ---------------

const history = ref<HistoryTemplate[]>([]);
const historyPushIteration = ref<number>(0);
const allowHistoryLog = ref<boolean>(true);

const historyIndexOfCurrentTemplate = computed<number>(() => {
	return history.value.findIndex((temp) => temp.id === template.id);
});

function loadTemplate(save: RawTemplateData) {
	allowHistoryLog.value = false;

	template.rawTemplateData = save;
}

function pushTemplateToHistory(): void {
	if (!allowHistoryLog.value) {
		allowHistoryLog.value = true;

		return;
	}

	const historyLengthLimit = 15;

	if (historyIndexOfCurrentTemplate.value !== history.value.length - 1) {
		history.value.splice(historyIndexOfCurrentTemplate.value + 1);
	}

	if (history.value.length >= historyLengthLimit) {
		history.value.splice(0, 1);
	}

	historyPushIteration.value++;
	template.id = uuidv4();

	history.value.push(
		JSON.parse(
			JSON.stringify({
				...template.rawTemplateData,
				iteration: historyPushIteration.value,
				dateModified: new Date(),
			}),
		),
	);
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
		pushTemplateToHistory();
	},
	{ deep: true, immediate: true },
);
</script>

<template>
	<ul
		:class="[
			{ 'translate-x-full': !show },
			'fixed right-0 top-0 z-10 w-[80vw] max-w-[450px] rounded bg-black/50 p-2 text-xs text-white backdrop-blur transition-transform duration-300',
		]"
	>
		<HistoryItem
			v-for="(template, index) in history"
			:key="template.id"
			:template="template"
			:index="index"
			:is-current-template="index === historyIndexOfCurrentTemplate"
			:is-active="index === activeHistoryItem"
			@set-active-item="setActiveItem"
			@load-save="loadTemplate"
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
