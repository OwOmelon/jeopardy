<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useGuestsStore } from "@/stores/guests";
import { useMainMenuStore } from "@/stores/mainmenu";
import { vOnClickOutside } from "@vueuse/components";

import { Icon } from "@iconify/vue";
import QuestionAnswer from "./QuestionAnswer.vue";
import GiveGuestPoints from "./GiveGuestPoints.vue";

const template = useTemplateStore();
const guests = useGuestsStore();
const mainmenu = useMainMenuStore();

// 	1 = "show_question"
// 	2 = "reveal_answer"
// 	3 = "deduct_points"
// 	4 = "add_points"
const progress = ref<number>(
	template.activeCell?.answeredBy !== undefined ? 2 : 1,
);

const hideAdvanceProgressBtn = computed<boolean>(() => {
	return template.activeCell!.answeredBy !== undefined
		? true
		: (progress.value === 2 && !guests.list.length) || progress.value === 4;
});

function advanceProgress(): void {
	if (progress.value === 4) return;

	if (hideAdvanceProgressBtn.value) {
		template.activeCell = null;

		return;
	}

	progress.value++;
}

function revertProgress(): void {
	if (progress.value === 1 || template.activeCell!.answeredBy !== undefined) {
		template.activeCell = null;

		return;
	}

	progress.value--;
}

function onKeyDown(e: KeyboardEvent) {
	switch (e.code) {
		case "Escape":
			template.activeCell = null;
			break;
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
		class="component w-[80vw] max-w-[900px] rounded shadow-[0_10px_40px] shadow-black/40"
		v-on-click-outside="
			() => {
				template.activeCell = null;
			}
		"
	>
		<div
			class="relative flex justify-center rounded-t border-b-4 border-red-300 bg-red-400 p-2 text-sm text-white"
		>
			<p class="text-center">
				<span class="font-bold">{{
					template.activeCell!.category || template.activeCell?.column
				}}</span>
				for
				<span class="font-bold">{{ template.activeCell!.points }}</span>
			</p>
		</div>

		<!-- -------- -->

		<div
			class="relative grid min-h-[350px] grid-cols-[2rem,_auto,_2rem] items-center gap-5 rounded-b bg-stone-100 p-5 text-center text-red-400"
		>
			<button type="button" @click="revertProgress">
				<Icon icon="material-symbols:arrow-left-rounded" />
			</button>

			<div class="grow">
				<Transition
					name="height-auto"
					enter-active-class="duration-500"
					leave-active-class="duration-500"
					mode="out-in"
				>
					<QuestionAnswer v-if="progress < 3" :show-answer="progress > 1" />

					<GiveGuestPoints
						v-else
						:progress="progress"
						@done="template.activeCell = null"
					/>
				</Transition>
			</div>

			<button
				type="button"
				:disabled="hideAdvanceProgressBtn"
				:class="{
					'opacity-0': hideAdvanceProgressBtn,
				}"
				@click="advanceProgress"
			>
				<Icon icon="material-symbols:arrow-right-rounded" />
			</button>
		</div>
	</div>
</template>

<style scoped lang="postcss">
button {
	@apply relative aspect-square text-red-400 transition-transform hover:scale-150;
}

button svg {
	@apply absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2;
}
</style>
