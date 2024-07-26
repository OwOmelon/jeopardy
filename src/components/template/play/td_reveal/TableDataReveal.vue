<script setup lang="ts">
import { readonly, ref, computed, provide, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useGuestsStore } from "@/stores/guests";
import { useTemplateStore } from "@/stores/template";
import { useMainMenuStore } from "@/stores/mainmenu";
import {
	revealProgressInjectionKey,
	updateRevealProgressInjectionKey,
} from "./reveal-progress-injection-key";

import IconClose from "~icons/material-symbols/close-rounded";

import OpeningTransition from "./OpeningTransition.vue";
import QuestionAnswer from "./QuestionAnswer.vue";
import GiveGuestPoints from "./GiveGuestPoints.vue";

const { list: guestList } = storeToRefs(useGuestsStore());
const { activeTableDataCell } = storeToRefs(useTemplateStore());
const { setActiveDataCell } = useTemplateStore();
const { disableToggle: disableMainMenuToggle } =
	storeToRefs(useMainMenuStore());

// ------------------------------

const openingTransitionElement = ref<HTMLElement | null>(null);

function removeOpeningTransitionElement(): void {
	if (!openingTransitionElement.value) return;

	openingTransitionElement.value.remove();
}

// ---------------

const content = ref<HTMLElement | null>(null);
const revealContentTransition = ref<"fade-slide-left" | "fade-slide-right">(
	"fade-slide-left",
);

// 	1 = "show_question"
// 	2 = "reveal_answer"
// 	3 = "deduct_points"
// 	4 = "add_points"

const revealProgress = ref<number>(
	activeTableDataCell.value!.answeredBy ? 2 : 1,
);

const revealProgressLimit = computed<number>(() => {
	const guestCount = guestList.value.length;

	return !guestCount ? 2 : guestCount === 1 ? 3 : 4;
});

const leaveOnRevertProgress = computed<boolean>(() => {
	return (
		revealProgress.value === 1 ||
		(revealProgress.value === 2 && activeTableDataCell.value!.answeredBy !== "")
	);
});

function revertProgress(): void {
	if (leaveOnRevertProgress.value) {
		setActiveDataCell(null);

		return;
	}

	revealContentTransition.value = "fade-slide-right";
	revealProgress.value--;
}

function advanceProgress(): void {
	if (revealProgress.value === revealProgressLimit.value) {
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

function onContentClick(e: MouseEvent): void {
	if (revealProgress.value > 2) return;

	const contentWidth = content.value?.getBoundingClientRect()?.width;

	if (!contentWidth) return;

	if ((e.clientX / contentWidth) * 100 < 100 / 3) {
		revertProgress();
	} else {
		advanceProgress();
	}
}

// ---------------

provide(revealProgressInjectionKey, {
	revealProgress: readonly(revealProgress),
	revealProgressLimit: readonly(revealProgressLimit),
});
provide(updateRevealProgressInjectionKey, { revertProgress, advanceProgress });

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
		class="fixed right-0 top-0 z-30 flex h-screen w-screen flex-col backdrop-blur"
	>
		<div ref="openingTransitionElement">
			<OpeningTransition
				:category="activeTableDataCell!.category"
				:points="activeTableDataCell!.points"
				@finish="removeOpeningTransitionElement"
			/>
		</div>

		<i
			class="bg-entry-anim absolute left-0 top-0 h-full w-full bg-stone-50 opacity-0"
		/>

		<div
			style="animation-delay: 1.15s"
			class="animate-slide-right relative flex justify-center border-b-4 border-red-300 bg-red-400 p-2 text-xl text-white opacity-0"
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

		<div
			ref="content"
			style="animation-delay: 1.3s"
			class="content animate-slide-right relative grid grow grid-rows-[auto,_1px] items-center gap-5 gap-y-0 overflow-y-auto overflow-x-hidden p-14 text-center text-5xl text-stone-600 opacity-0"
			@click="onContentClick"
		>
			<div>
				<Transition :name="revealContentTransition" mode="out-in">
					<QuestionAnswer
						v-if="revealProgress < 3"
						@change-answer-results="revealProgress = 3"
					/>

					<GiveGuestPoints v-else @done="setActiveDataCell(null)" />
				</Transition>
			</div>

			<div class="anchor" />
		</div>
	</div>
</template>

<style scoped lang="postcss">
.bg-entry-anim {
	animation: bg-entry-anim 1.5s 150ms ease-in forwards;
}

@keyframes bg-entry-anim {
	from,
	50% {
		opacity: 0;
		transform: translateX(-100%);
	}

	to {
		opacity: 1;
		transform: translateX(0);
	}
}

.content {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
.content::-webkit-scrollbar {
	display: none;
}

.prog-btn {
	@apply grid place-items-center p-2 transition-opacity disabled:opacity-0;
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

.animate-slide-right {
	animation: slide-right 1s forwards;
}

@keyframes slide-right {
	0%,
	30% {
		opacity: 0;
		transform: translateX(-4rem);
	}

	100% {
		opacity: 1;
		transform: translateX(0);
	}
}
</style>
