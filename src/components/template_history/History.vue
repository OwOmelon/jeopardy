<script setup lang="ts">
import { ref, watch } from "vue";
import { useTemplateStore } from "@/stores/template";

import HistoryItem from "./HistoryItem.vue";

const template = useTemplateStore();

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
</script>

<template>
	<ul
		:class="[
			{ '-translate-x-full': hide },
			'fixed left-0 top-0 z-10 w-[calc(100%_-_(50.48px_+_8px))] max-w-[450px] rounded bg-black/50 p-2 text-xs text-white backdrop-blur transition-transform duration-300',
		]"
	>
		<HistoryItem
			v-for="(historyTemplate, index) in template.history"
			v-bind="historyTemplate"
			:index="index"
			:is-current-template="index === template.historyIndexOfCurrentTemplate"
			:is-active="index === activeHistoryItem"
			:key="historyTemplate.id"
			@set-active-item="setActiveItem(index)"
			@load-save="template.loadTemplate(historyTemplate)"
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
