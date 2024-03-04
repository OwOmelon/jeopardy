<script setup lang="ts">
import { ref, watch } from "vue";
import { useTemplateStore } from "@/stores/template";

import HistoryItem from "./HistoryItem.vue";

const template = useTemplateStore();

const hide = ref<boolean>(true);
const activeHistoryItem = ref<number>(-1);

const showAnswers = ref<boolean>(false);
const showImages = ref<boolean>(false);

function setActiveItem(index: number) {
	if (index === activeHistoryItem.value) {
		activeHistoryItem.value = -1;
	} else {
		activeHistoryItem.value = index;
	}
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
			'fixed left-0 top-0 z-10 w-[calc(100%_-_(50.48px_+_8px))] max-w-[450px] transition-transform duration-300',
		]"
	>
		<ul
			:class="[
				'max-h-screen overflow-y-scroll rounded bg-stone-900/75 p-2 text-xs text-stone-50 backdrop-blur ',
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

		<button
			type="button"
			class="absolute left-full top-0 ml-2 grid aspect-square place-items-center rounded bg-black/50 p-5 text-white backdrop-blur"
			@click="hide = !hide"
		>
			|||
		</button>
	</div>
</template>
