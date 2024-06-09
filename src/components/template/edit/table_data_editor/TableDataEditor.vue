<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useMainMenuStore } from "@/stores/mainmenu";
import { vOnClickOutside } from "@vueuse/components";

export type ImageModelValue = ReturnType<typeof template.fetchImageTableImage>;

import IconClose from "~icons/material-symbols/close-rounded";
import IconEnter from "~icons/ph/arrow-bend-down-right-bold";
import InputArea from "./InputArea.vue";
import ModalWrapper from "@/components/ModalWrapper.vue";
import Edit_Images from "@/components/help/Edit_Images.vue";

const template = useTemplateStore();
const mainmenu = useMainMenuStore();

const showHelp_Image = ref(false);

const questionText = ref<string>(template.activeTableDataCell!.question.text);
const questionImage = ref<ImageModelValue>(
	template.fetchImageTableImage(
		template.activeTableDataCell!.row,
		template.activeTableDataCell!.column,
		"question",
	),
);

const answerText = ref<string>(template.activeTableDataCell!.answer.text);
const answerImage = ref<ImageModelValue>(
	template.fetchImageTableImage(
		template.activeTableDataCell!.row,
		template.activeTableDataCell!.column,
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
			template.activeTableDataCell!.row,
			template.activeTableDataCell!.column,
			property.text.trim(),
			key,
		);

		if (property.image) {
			template.updateImageTable(
				template.activeTableDataCell!.row,
				template.activeTableDataCell!.column,
				property.image.src.trim(),
				property.image.type,
				key,
			);
		} else {
			["link", "upload"].forEach((type) => {
				template.updateImageTable(
					template.activeTableDataCell!.row,
					template.activeTableDataCell!.column,
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
	template.setActiveDataCell(null);
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
		class="modal !max-w-[900px]"
		v-on-click-outside="
			() => {
				if (!showHelp_Image) {
					closeTableDataEditor();
				}
			}
		"
	>
		<div
			class="flex items-center justify-between gap-3 rounded-t border-b-2 border-stone-500 bg-stone-900 p-1 text-sm text-stone-300"
		>
			<span class="ml-2">
				Editing
				<span class="font-bold">{{
					template.activeTableDataCell!.category ||
					template.activeTableDataCell!.column
				}}</span>
				for
				<span class="font-bold">{{
					template.activeTableDataCell!.points
				}}</span>
				points
			</span>

			<button
				type="button"
				class="btn !p-0 transition-colors hover:!bg-red-400 hover:!text-white"
				@click="closeTableDataEditor()"
			>
				<IconClose class="h-7 w-7" />
			</button>
		</div>

		<form
			class="rounded-b bg-stone-800 p-3"
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
					@show-help_image="showHelp_Image = true"
				/>

				<div
					class="flex flex-row items-center justify-center gap-2 md:h-full md:flex-col"
				>
					<i class="h-1 w-[30%] rounded-full bg-stone-500 md:h-[30%] md:w-1" />
					<i class="aspect-square h-2 rounded-full bg-stone-500" />
					<i class="h-1 w-[30%] rounded-full bg-stone-500 md:h-[30%] md:w-1" />
				</div>

				<InputArea
					v-model:text="answerText"
					:image="answerImage?.src || ''"
					label="Answer:"
					text-box-placeholder="enter an answer"
					@on-image-upload="answerImage = $event"
					@show-help_image="showHelp_Image = true"
				/>
			</div>

			<button
				type="submit"
				class="btn mt-3 flex w-full items-center justify-center gap-3 text-xl transition-colors hover:!bg-green-400 hover:!text-white"
			>
				SAVE
				<IconEnter />
			</button>
		</form>

		<ModalWrapper :show="showHelp_Image">
			<Edit_Images @close="showHelp_Image = false" />
		</ModalWrapper>
	</div>
</template>

<style scoped lang="postcss">
:deep(.btn) {
	@apply shadow-subtle rounded bg-stone-300 px-2 py-1 font-semibold text-stone-100 text-stone-800;
}

.text-box {
	@apply shadow-subtle mt-3 min-h-[10.3ex] resize-none rounded border-2 border-transparent bg-stone-500 p-[0.5em] text-stone-100 outline-none transition-colors md:min-h-[18.2ex];
}

.text-box-focus {
	@apply !border-stone-100;
}
</style>
