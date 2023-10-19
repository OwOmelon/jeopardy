<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useMainMenuStore } from "@/stores/mainmenu";
import { vOnClickOutside } from "@vueuse/components";

import TextBox from "@/components/TextBox.vue";

const template = useTemplateStore();
const mainmenu = useMainMenuStore();

const questionModelValue = ref(template.activeCellData!.question);
const answerModelValue = ref(template.activeCellData!.answer);

function saveChanges(): void {
	const td =
		template.rawTable[template.activeCellIndeces.row!][
			template.activeCellIndeces.column!
		];

	td.question = questionModelValue.value;
	td.answer = answerModelValue.value;

	template.resetActiveCell();
}

function onKeyDown(e: KeyboardEvent) {
	if (e.key === "Escape") {
		template.resetActiveCell();
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
				template.resetActiveCell();
			}
		"
	>
		<div
			class="flex items-center justify-between gap-3 rounded-t border-b-2 border-stone-600 bg-stone-500 p-3 text-sm text-white"
		>
			<p>
				Editing
				<span class="font-bold">{{ template.activeCellData?.category }}</span>
				for
				<span class="font-bold">{{ template.activeCellData?.points }}</span>
			</p>

			<button
				type="button"
				class="hover:bg-red-200"
				@click="template.resetActiveCell"
			>
				Close <span class="hidden lg:inline">[Esc]</span>
			</button>
		</div>

		<div class="rounded-b bg-stone-300 p-5">
			<div class="flex flex-col gap-5 md:flex-row">
				<div class="w-full">
					<label>Question:</label>
					<TextBox
						v-model="questionModelValue"
						placeholder="enter a question"
						focus-classes="text-box-focus"
						class="text-box"
					/>
				</div>

				<div class="w-full">
					<label>Answer:</label>
					<TextBox
						v-model="answerModelValue"
						placeholder="enter an answer"
						focus-classes="text-box-focus"
						class="text-box"
					/>
				</div>
			</div>

			<button
				type="button"
				class="mx-auto mt-5 block hover:bg-green-200"
				@click="saveChanges()"
			>
				Save
			</button>
		</div>
	</div>
</template>

<style scoped lang="postcss">
button {
	@apply rounded bg-stone-100 px-2 py-1 text-stone-800 shadow shadow-black/30 transition-colors;
}

label {
	@apply text-stone-600;
}

.text-box {
	@apply mt-3 min-h-[10.3ex] w-full resize-none rounded border-b-2 border-transparent bg-stone-50 p-[0.5em] shadow shadow-black/30 outline-none transition-colors md:min-h-[18.2ex];
}

.text-box-focus {
	@apply !border-red-400;
}
</style>
