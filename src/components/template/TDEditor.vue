\
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useModalStore } from "@/stores/modals";
import { vOnClickOutside } from "@vueuse/components";

const template = useTemplateStore();
const modals = useModalStore();

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
	if (e.code === "Escape") {
		template.resetActiveCell();
	}
}

onMounted(() => {
	modals.disableMainMenuToggle = true;

	window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
	modals.disableMainMenuToggle = false;

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
			class="flex items-center justify-between rounded-t border-b-2 border-stone-600 bg-stone-500 p-3 text-sm text-white"
		>
			<p class="w-[35%]">
				Editing
				<span class="font-bold">{{ template.activeCellData?.category }}</span>
				for
				<span class="font-bold">{{ template.activeCellData?.points }}</span>
			</p>

			<div class="flex flex-wrap justify-end gap-3">
				<button type="button" class="hover:bg-green-200" @click="saveChanges()">
					Save
				</button>
				<button
					type="button"
					class="hover:bg-red-200"
					@click="template.resetActiveCell"
				>
					Close <span class="hidden lg:inline">[Esc]</span>
				</button>
			</div>
		</div>

		<div class="flex flex-col gap-5 rounded-b bg-stone-300 p-5 md:flex-row">
			<div class="w-full">
				<label>Question:</label>
				<textarea v-model="questionModelValue"></textarea>
			</div>

			<div class="w-full">
				<label>Answer:</label>
				<textarea v-model="answerModelValue"></textarea>
			</div>
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

textarea {
	@apply mt-3 h-[10.3ex] w-full resize-none rounded border-b-2 border-transparent bg-stone-50 p-[0.5em] shadow shadow-black/30 outline-none transition-colors focus:border-red-400 md:h-[18.2ex];
}
</style>
