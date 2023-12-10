<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useMainMenuStore } from "@/stores/mainmenu";
import { vOnClickOutside } from "@vueuse/components";

export type ImageModelValue = ReturnType<typeof template.fetchImageTableImage>;

import InputArea from "./InputArea.vue";

const template = useTemplateStore();
const mainmenu = useMainMenuStore();

const questionText = ref<string>(template.activeCell!.question.text);
const questionImage = ref<ImageModelValue>(
	template.fetchImageTableImage(
		template.activeCell!.row,
		template.activeCell!.column,
		"question",
	),
);

const answerText = ref<string>(template.activeCell!.answer.text);
const answerImage = ref<ImageModelValue>(
	template.fetchImageTableImage(
		template.activeCell!.row,
		template.activeCell!.column,
		"answer",
	),
);

function saveChanges(): void {
	[
		{ text: questionText.value, image: questionImage.value },
		{ text: answerText.value, image: answerImage.value },
	].forEach((property, index) => {
		const key: "question" | "answer" = index === 0 ? "question" : "answer";

		template.updateTextTable(
			template.activeCell!.row,
			template.activeCell!.column,
			property.text.trim(),
			key,
		);

		if (property.image) {
			template.updateImageTable(
				template.activeCell!.row,
				template.activeCell!.column,
				property.image.src,
				property.image.type,
				key,
			);
		} else {
			["link", "upload"].forEach((type) => {
				template.updateImageTable(
					template.activeCell!.row,
					template.activeCell!.column,
					"",
					type as "link" | "upload",
					key,
				);
			});
		}
	});

	closeTableDataEditor();
}

function onKeyDown(e: KeyboardEvent) {
	if (e.key === "Escape") {
		closeTableDataEditor();
	}
}

function closeTableDataEditor(): void {
	template.activeCell = null;
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
		class="component modal"
		v-on-click-outside="
			() => {
				closeTableDataEditor();
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
				class="btn hover:bg-rose-700"
				@click="closeTableDataEditor()"
			>
				CLOSE <span class="hidden lg:inline">[ESC]</span>
			</button>
		</div>

		<form
			class="rounded-b bg-stone-700 p-3 text-stone-300"
			@submit.prevent="saveChanges()"
		>
			<div
				class="grid grid-cols-1 items-start gap-3 md:grid-cols-[minmax(0,_1fr)_min-content_minmax(0,_1fr)]"
			>
				<InputArea
					v-model:text="questionText"
					:image="questionImage?.src || ''"
					label="Question:"
					text-box-placeholder="enter a question"
					@on-image-upload="questionImage = $event"
				/>

				<div
					class="flex flex-row items-center justify-center gap-2 md:h-full md:flex-col"
				>
					<div
						class="h-1 w-[30%] rounded-full bg-stone-500 md:h-[30%] md:w-1"
					/>
					<div class="aspect-square h-2 rounded-full bg-stone-500" />
					<div
						class="h-1 w-[30%] rounded-full bg-stone-500 md:h-[30%] md:w-1"
					/>
				</div>

				<InputArea
					v-model:text="answerText"
					:image="answerImage?.src || ''"
					label="Answer:"
					text-box-placeholder="enter an answer"
					@on-image-upload="answerImage = $event"
				/>
			</div>

			<button type="submit" class="btn mt-3 block w-full hover:bg-emerald-700">
				SAVE
			</button>
		</form>
	</div>
</template>

<style scoped lang="postcss">
:deep(.btn) {
	@apply rounded bg-stone-300 px-2 py-1 font-semibold text-stone-100 text-stone-600 shadow shadow-black/30 transition-colors hover:bg-stone-400;
}

.text-box {
	@apply mt-3 min-h-[10.3ex] resize-none rounded border-2 border-transparent bg-stone-500 p-[0.5em] text-stone-100 shadow shadow-black/30 outline-none transition-colors md:min-h-[18.2ex];
}

.text-box-focus {
	@apply !border-stone-100;
}
</style>
