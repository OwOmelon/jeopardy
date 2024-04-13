<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useGuestsStore } from "@/stores/guests";
import { useTemplateStore } from "@/stores/template";
import { useMainMenuStore } from "@/stores/mainmenu";
import { vOnClickOutside } from "@vueuse/components";

import IconClose from "~icons/material-symbols/close-rounded";
import IconArrowLeft from "~icons/material-symbols/arrow-left-rounded";
import IconArrowRight from "~icons/material-symbols/arrow-right-rounded";

import QuestionAnswer from "./QuestionAnswer.vue";
import GiveGuestPoints from "./GiveGuestPoints.vue";

const { list: guestList } = storeToRefs(useGuestsStore());
const { activeTableDataCell } = storeToRefs(useTemplateStore());
const { setActiveDataCell } = useTemplateStore();
const { disableToggle: disableMainMenuToggle } =
	storeToRefs(useMainMenuStore());

// ------------------------------

// 	1 = "show_question"
// 	2 = "reveal_answer"
// 	3 = "deduct_points"
// 	4 = "add_points"

const revealProgress = ref<number>(
	activeTableDataCell.value!.answeredBy ? 2 : 1,
);
const revealContentTransition = ref<"fade-slide-left" | "fade-slide-right">(
	"fade-slide-left",
);

const cancelRevertProgress = computed<boolean>(() => {
	return activeTableDataCell.value!.answeredBy &&
		revealProgress.value !== 2 &&
		revealProgress.value !== 4
		? true
		: false;
});

function revertProgress(): void {
	if (
		revealProgress.value === 1 ||
		(activeTableDataCell.value!.answeredBy && revealProgress.value === 2)
	) {
		setActiveDataCell(null);

		return;
	}

	revealContentTransition.value = "fade-slide-right";
	revealProgress.value--;
}

const cancelAdvanceProgress = computed<boolean>(() => {
	return revealProgress.value === 4 ||
		(!guestList.value.length && revealProgress.value === 2) ||
		activeTableDataCell.value!.answeredBy
		? revealProgress.value !== 3
		: false;
});

function advanceProgress(): void {
	if (cancelAdvanceProgress.value) {
		setActiveDataCell(null);

		return;
	}

	revealContentTransition.value = "fade-slide-left";
	revealProgress.value++;
}

function onKeyDown(e: KeyboardEvent) {
	switch (e.code) {
		case "Escape":
			setActiveDataCell(null);
			break;
	}
}

// ------------------------------

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
		class="fixed right-0 top-0 flex h-screen w-screen flex-col"
		v-on-click-outside="
			() => {
				setActiveDataCell(null);
			}
		"
	>
		<div
			class="relative flex justify-center border-b-4 border-red-300 bg-red-400 p-2 text-xl text-white"
		>
			<p class="text-center">
				<span class="font-bold">{{
					activeTableDataCell!.category || activeTableDataCell?.column
				}}</span>
				for
				<span class="font-bold">{{ activeTableDataCell!.points }}</span>
			</p>

			<button
				type="button"
				class="absolute right-2 top-1/2 -translate-y-1/2 rounded border-2 border-white bg-white p-0.5 text-red-400 transition-colors hover:bg-red-400 hover:text-white"
				@click="setActiveDataCell(null)"
			>
				<IconClose class="h-6 w-6" />
			</button>
		</div>

		<!-- -------- -->

		<div
			class="content relative grid grow grid-rows-[auto,_1px] items-center gap-5 gap-y-0 overflow-y-auto overflow-x-hidden bg-stone-50 p-14 text-center text-6xl"
		>
			<div>
				<Transition :name="revealContentTransition" mode="out-in">
					<QuestionAnswer
						v-if="revealProgress < 3"
						:active-table-data-cell="activeTableDataCell!"
						:show-answer="revealProgress > 1"
						@change-answeree="revealProgress = 3"
					/>

					<GiveGuestPoints
						v-else
						:reveal-progress="revealProgress"
						@done="setActiveDataCell(null)"
					/>
				</Transition>
			</div>

			<div class="anchor" />
		</div>

		<!-- -------- -->

		<div
			class="grid grid-cols-[1fr,max-content,_1fr] place-items-center border-t-4 border-stone-400 bg-stone-300 text-sm"
		>
			<button
				type="button"
				:disabled="cancelRevertProgress"
				:class="[
					{
						'opacity-0': cancelRevertProgress,
					},
					'prog-btn',
				]"
				@click="revertProgress"
			>
				<IconArrowLeft />
			</button>

			<span class="text-center">{{ revealProgress }} / 4</span>

			<button
				type="button"
				:disabled="cancelAdvanceProgress"
				:class="[
					{
						'opacity-0': cancelAdvanceProgress,
					},
					'prog-btn',
				]"
				@click="advanceProgress"
			>
				<IconArrowRight />
			</button>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.content {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
.content::-webkit-scrollbar {
	display: none;
}

.prog-btn {
	@apply grid place-items-center p-2 transition-opacity;
}

.prog-btn svg {
	@apply pointer-events-none scale-[3] transition-transform;
}

.prog-btn:hover svg {
	@apply scale-[5];
}

.anchor {
	height: 1px;
	overflow-anchor: auto;
}
</style>
