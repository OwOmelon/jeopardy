<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useMainMenuStore } from "@/stores/mainmenu";
import { vOnClickOutside } from "@vueuse/components";

import TextBox from "@/components/TextBox.vue";

const template = useTemplateStore();
const mainmenu = useMainMenuStore();

const questionModelValue = ref(template.activeCell!.question);
const answerModelValue = ref(template.activeCell!.answer);

function saveChanges(): void {
	const td =
		template.rawTable[template.activeCell!.row][template.activeCell!.column];

	td.question = questionModelValue.value;
	td.answer = answerModelValue.value;

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
			class="rounded-b bg-stone-700 p-5 text-stone-300"
			@submit.prevent="saveChanges()"
		>
			<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
				<div>
					<label>Question:</label>
					<TextBox
						v-model="questionModelValue"
						placeholder="enter a question"
						focus-classes="text-box-focus"
						class="text-box"
					/>
				</div>

				<div>
					<label>Answer:</label>
					<TextBox
						v-model="answerModelValue"
						placeholder="enter an answer"
						focus-classes="text-box-focus"
						class="text-box"
					/>
				</div>
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
