<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useTemplateStore } from "@/stores/template";
import { useMainMenuStore } from "@/stores/mainmenu";
import { vOnClickOutside } from "@vueuse/components";

import { Icon } from "@iconify/vue";
import QuestionAnswer from "./QuestionAnswer.vue";
import GiveGuestPoints from "./GiveGuestPoints.vue";

const { activeCell: activeTemplateCell } = storeToRefs(useTemplateStore());
const { disableToggle: disableMainMenuToggle } = storeToRefs(
	useMainMenuStore(),
);

// 	1 = "show_question"
// 	2 = "reveal_answer"
// 	3 = "deduct_points"
// 	4 = "add_points"
const revealProgress = ref<number>(
	activeTemplateCell.value!.answeredBy ? 2 : 1,
);

const cancelRevertProgress = computed<boolean>(() => {
	return activeTemplateCell.value!.answeredBy &&
		revealProgress.value !== 2 &&
		revealProgress.value !== 4
		? true
		: false;
});

function revertProgress(): void {
	if (
		revealProgress.value === 1 ||
		(activeTemplateCell.value!.answeredBy && revealProgress.value === 2)
	) {
		activeTemplateCell.value = null;

		return;
	}

	revealProgress.value--;
}

const cancelAdvanceProgress = computed<boolean>(() => {
	if (revealProgress.value === 4) return true;

	return activeTemplateCell.value!.answeredBy
		? revealProgress.value !== 3
		: false;
});

function advanceProgress(): void {
	if (cancelAdvanceProgress.value) {
		activeTemplateCell.value = null;

		return;
	}

	revealProgress.value++;
}

function onKeyDown(e: KeyboardEvent) {
	switch (e.code) {
		case "Escape":
			activeTemplateCell.value = null;
			break;
	}
}

onMounted(() => {
	disableMainMenuToggle.value = true;

	window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
	disableMainMenuToggle.value = false;

	window.removeEventListener("keydown", onKeyDown);
});
</script>

<template>
	<div
		class="component modal"
		v-on-click-outside="
			() => {
				activeTemplateCell = null;
			}
		"
	>
		<div
			class="relative flex justify-center rounded-t border-b-4 border-red-300 bg-red-400 p-2 text-sm text-white"
		>
			<p class="text-center">
				<span class="font-bold">{{
					activeTemplateCell!.category || activeTemplateCell?.column
				}}</span>
				for
				<span class="font-bold">{{ activeTemplateCell!.points }}</span>
			</p>
		</div>

		<!-- -------- -->

		<div
			class="relative grid min-h-[350px] grid-cols-[2rem,_auto,_2rem] items-center gap-3 rounded-b bg-stone-100 p-3 text-center text-red-400"
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
					<QuestionAnswer
						v-if="revealProgress < 3"
						:show-answer="revealProgress > 1"
					/>

					<GiveGuestPoints
						v-else
						:progress="revealProgress"
						@done="activeTemplateCell = null"
					/>
				</Transition>
			</div>

			<button
				type="button"
				:disabled="cancelAdvanceProgress"
				:class="{
					'opacity-0': cancelAdvanceProgress,
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
	@apply grid aspect-square place-items-center text-red-400 transition-transform hover:scale-150;
}

button svg {
	@apply scale-[5];
}
</style>
