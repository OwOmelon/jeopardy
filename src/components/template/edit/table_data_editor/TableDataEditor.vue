<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useMainMenuStore } from "@/stores/mainmenu";
import { vOnClickOutside } from "@vueuse/components";

import InputArea from "./InputArea.vue";

const template = useTemplateStore();
const mainmenu = useMainMenuStore();

const questionText = ref<string>(template.activeCell!.question.text);
const questionImage = ref<string>(template.activeCell!.question.image);

const answerText = ref<string>(template.activeCell!.answer.text);
const answerImage = ref<string>(template.activeCell!.answer.image);

function saveChanges(): void {
	const td =
		template.rawTable[template.activeCell!.row][template.activeCell!.column];

	td.question.text = questionText.value;
	td.answer.text = answerText.value;

	template.activeCell = null;
}

function onKeyDown(e: KeyboardEvent) {
	if (e.key === "Escape") {
		template.activeCell = null;
	}
}

onMounted(() => {
	mainmenu.disableToggle = true;

	window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
	mainmenu.disableToggle = false;

	window.removeEventListener("keydown", onKeyDown);
});
</script>

<template>
	<div
		ref="el"
		class="component w-[80vw] max-w-[900px]"
		v-on-click-outside="
			() => {
				template.activeCell = null;
			}
		"
	>
		<div
			class="flex items-center justify-between gap-3 rounded-t border-b-2 border-stone-500 bg-stone-800 p-3 text-sm text-stone-400"
		>
			<p>
				Editing
				<span class="font-bold">{{
					template.activeCell!.category || template.activeCell!.column
				}}</span>
				for
				<span class="font-bold">{{ template.activeCell!.points }}</span>
			</p>

			<button
				type="button"
				class="hover:bg-rose-700"
				@click="template.activeCell = null"
			>
				Close <span class="hidden lg:inline">[Esc]</span>
			</button>
		</div>

		<form
			class="rounded-b bg-stone-700 p-3 text-stone-300"
			@submit.prevent="saveChanges()"
		>
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				<InputArea
					v-model:text="questionText"
					v-model:image="questionImage"
					label="Question:"
					text-box-placeholder="enter a question"
				/>

				<InputArea
					v-model:text="answerText"
					v-model:image="answerImage"
					label="Answer:"
					text-box-placeholder="enter an answer"
				/>
			</div>

			<button type="submit" class="mx-auto mt-5 block hover:bg-emerald-700">
				Save
			</button>
		</form>
	</div>
</template>

<style scoped lang="postcss">
button {
	@apply rounded bg-stone-500 px-2 py-1 text-stone-100 shadow shadow-black/30 transition-colors;
}

.text-box {
	@apply mt-3 min-h-[10.3ex] resize-none rounded border-2 border-transparent bg-stone-500 p-[0.5em] text-stone-100 shadow shadow-black/30 outline-none transition-colors md:min-h-[18.2ex];
}

.text-box-focus {
	@apply !border-stone-100;
}
</style>
