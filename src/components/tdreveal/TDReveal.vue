<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useGuestsStore } from "@/stores/guests";
import { useModalStore } from "@/stores/modals";
import { vOnClickOutside } from "@vueuse/components";

import type { Guest } from "@/stores/guests";

import { Icon } from "@iconify/vue";
import QuestionAnswer from "./QuestionAnswer.vue";
import GiveGuestPoints from "./GiveGuestPoints.vue";

const template = useTemplateStore();
const guests = useGuestsStore();
const modals = useModalStore();

// 	1 = "show_question"
// 	2 = "reveal_answer"
// 	3 = "give_points"
const progress = ref<number>(template.activeCellData?.answeredBy ? 2 : 1);

function advanceProgress(): void {
	if (progress.value === 3) return;

	const closeTDReveal: boolean = template.activeCellData!.answeredBy
		? true
		: (progress.value === 2 && !guests.list.length) || progress.value === 3;

	if (closeTDReveal) {
		template.resetActiveCell();

		return;
	}

	progress.value++;
}

function revertProgress(): void {
	if (progress.value === 1 || template.activeCellData!.answeredBy) {
		template.resetActiveCell();

		return;
	}

	progress.value--;
}

function givePoints(guestID: Guest["id"] | null) {
	const guestIndex = guestID
		? guests.list.findIndex((guest) => guest.id === guestID)
		: -1;
	const guest: Guest | null = guests.list?.[guestIndex] ?? null;

	template.playProgressTracker[template.activeCellIndeces.row!] = {
		[template.activeCellIndeces.column!]: guest?.name ?? "no one",
	};

	console.log(template.playProgressTracker);

	template.resetActiveCell();
}

function onKeyDown(e: KeyboardEvent) {
	switch (e.code) {
		case "Escape":
			revertProgress();
			break;

		case "Space":
			advanceProgress();
			break;
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
		class="component w-[80vw] max-w-[900px] overflow-hidden rounded shadow-[0_10px_40px] shadow-black/40"
		v-on-click-outside="
			() => {
				template.resetActiveCell();
			}
		"
	>
		<div
			class="relative flex justify-center border-b-4 border-red-300 bg-red-400 p-2 text-sm text-white"
		>
			<p class="text-center">
				<span class="font-bold">{{ template.activeCellData?.category }}</span>
				for
				<span class="font-bold">{{ template.activeCellData?.points }}</span>
			</p>
		</div>

		<!-- -------- -->

		<div
			class="relative grid min-h-[350px] grid-cols-[3rem,_auto,_3rem] items-center gap-5 bg-white p-5 text-center text-red-400"
		>
			<button type="button" @click="revertProgress">
				<Icon icon="material-symbols:arrow-left-rounded" />
			</button>

			<div class="grow">
				<Transition name="fade" mode="out-in">
					<QuestionAnswer
						v-if="progress !== 3"
						:question="template.activeCellData!.question"
						:answer="template.activeCellData!.answer"
						:show-answer="progress > 1"
					/>

					<GiveGuestPoints
						v-else
						:guest-list="guests.list"
						:cell-points="template.activeCellData!.points"
						@give-points="givePoints"
					/>
				</Transition>

				<span
					v-if="template.activeCellData?.answeredBy"
					class="font-xl mt-10 font-bold"
				>
					answered by: {{ template.activeCellData!.answeredBy }}
				</span>
			</div>

			<button
				type="button"
				:disabled="progress === 3"
				:class="{
					'opacity-0': progress === 3,
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
	@apply text-red-400 transition-transform hover:scale-110;
}

button svg {
	@apply h-full w-full;
}
</style>
