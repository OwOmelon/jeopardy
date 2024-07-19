<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useTemplateStore } from "@/stores/template";

import IconHamburger from "~icons/ci/hamburger-lg";
import HistoryItem from "./HistoryItem.vue";

const template = useTemplateStore();

const hide = ref<boolean>(true);
const activeHistoryItem = ref<number>(-1);

const showAnswers = ref<boolean>(false);
const showImages = ref<boolean>(false);

const disableUndoRedo = computed(() => {
	return template.history.length === 1
		? "both"
		: template.historyIndexOfCurrentTemplate - 1 < 0
			? "redo"
			: template.historyIndexOfCurrentTemplate >= template.history.length - 1
				? "undo"
				: null;
});

function setActiveItem(index: number) {
	if (index === activeHistoryItem.value) {
		activeHistoryItem.value = -1;
	} else {
		activeHistoryItem.value = index;
	}
}

function undoRedo(dir: -1 | 1): void {
	const templateToLoad =
		template.history?.[template.historyIndexOfCurrentTemplate + dir];

	if (!templateToLoad) return;

	template.loadTemplate(templateToLoad);
}

watch(hide, () => {
	activeHistoryItem.value = -1;
	showAnswers.value = false;
	showImages.value = false;
});
</script>

<template>
	<div
		:class="[
			{ '-translate-x-full': hide },
			'fixed left-0 top-0 z-10 w-[calc(100%_-_(50.48px_+_8px))] max-w-[450px] transition-transform duration-300 z-30',
		]"
	>
		<ul
			:class="[
				'max-h-screen overflow-y-auto rounded-br border-b-2 border-r-2 border-stone-500 bg-stone-900/75 p-2 text-xs text-stone-50 backdrop-blur ',
			]"
		>
			<HistoryItem
				v-for="(historyTemplate, index) in template.history"
				v-bind="historyTemplate"
				:index="index"
				:is-current-template="index === template.historyIndexOfCurrentTemplate"
				:is-active="index === activeHistoryItem"
				:show-answers="showAnswers"
				:show-images="showImages"
				:key="historyTemplate.id"
				@set-active-item="setActiveItem(index)"
				@load-save="template.loadTemplate(historyTemplate)"
				@toggle-show-answers="showAnswers = !showAnswers"
				@toggle-show-images="showImages = !showImages"
			/>
		</ul>

		<div class="absolute left-full top-0 ml-2 flex items-start gap-3 text-sm">
			<button
				type="button"
				class="grid aspect-square place-items-center rounded bg-black/50 !p-3 !text-xl backdrop-blur"
				@click="hide = !hide"
			>
				<IconHamburger />
			</button>

			<button
				type="button"
				:disabled="disableUndoRedo === 'undo' || disableUndoRedo === 'both'"
				@click="undoRedo(1)"
			>
				undo
			</button>
			<button
				type="button"
				:disabled="disableUndoRedo === 'redo' || disableUndoRedo === 'both'"
				@click="undoRedo(-1)"
			>
				redo
			</button>
		</div>
	</div>
</template>

<style scoped lang="postcss">
ul {
	scrollbar-color: rgb(255, 255, 255, 0.35) #0000;
}

button {
	@apply shadow-subtle rounded bg-stone-600 px-2 py-1 text-stone-200 transition-[background-color,_color,_transform] hover:bg-stone-200 hover:text-stone-600 active:scale-90 disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-600;
}
</style>
