<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useTemplateStore } from "@/stores/template";
import { v4 as uuidv4 } from "uuid";

import HistoryItem from "./HistoryItem.vue";

import type { TemplateData } from "@/stores/template";

export type HistoryTemplate = TemplateData & {
	iteration: number;
	dateModified: Date;
};

const template = useTemplateStore();

// ---------------

const hide = ref<boolean>(true);
const activeHistoryItem = ref<number>(-1);

function setActiveItem(index: number) {
	if (index === activeHistoryItem.value) {
		activeHistoryItem.value = -1;
	} else {
		activeHistoryItem.value = index;
	}
}

watch(hide, () => {
	activeHistoryItem.value = -1;
});

// ---------------

const history = ref<HistoryTemplate[]>([]);
const historyPushIteration = ref<number>(0);
const allowHistoryLog = ref<boolean>(true);

const historyIndexOfCurrentTemplate = computed<number>(() => {
	return history.value.findIndex((temp) => temp.id === template.id);
});

function loadTemplate(save: TemplateData) {
	allowHistoryLog.value = false;

	template.templateData = save;
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
				...template.templateData,
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
			{ '-translate-x-full': hide },
			'fixed left-0 top-0 z-10 w-[calc(100%_-_(50.48px_+_8px))] max-w-[450px] rounded bg-black/50 p-2 text-xs text-white backdrop-blur transition-transform duration-300',
		]"
	>
		<HistoryItem
			v-for="(template, index) in history"
			v-bind="template"
			:index="index"
			:is-current-template="index === historyIndexOfCurrentTemplate"
			:is-active="index === activeHistoryItem"
			:key="template.id"
			@set-active-item="setActiveItem(index)"
			@load-save="loadTemplate(template)"
		/>

		<button
			type="button"
			class="absolute left-full top-0 ml-2 grid aspect-square place-items-center rounded-[inherit] bg-[inherit] p-5 backdrop-blur"
			@click="hide = !hide"
		>
			|||
		</button>
	</ul>
</template>
