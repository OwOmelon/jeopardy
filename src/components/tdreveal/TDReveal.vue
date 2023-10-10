<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useGuestsStore } from "@/stores/guests";
import { useModalStore } from "@/stores/modals";
import { vOnClickOutside } from "@vueuse/components";

import type { Guest } from "@/stores/guests";

import QuestionAnswer from "./QuestionAnswer.vue";
import GiveGuestPoints from "./GiveGuestPoints.vue";

const template = useTemplateStore();
const guests = useGuestsStore();
const modals = useModalStore();

const procedure: { [key: number]: string } = {
	1: "show_question",
	2: "reveal_answer",
	3: "give_points",
};

const progress = ref<number>(template.activeCellData?.answeredBy ? 2 : 1);

function advanceProgress(): void {
	if (procedure[progress.value] === "give_points") return;

	if (
		(procedure[progress.value] === "reveal_answer" && !guests.list.length) ||
		template.activeCellData?.answeredBy
	) {
		template.resetActiveCell();

		return;
	}

	progress.value++;
}

function revertProgress(): void {
	if (procedure[progress.value] !== "give_points") {
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
			class="relative flex min-h-[350px] flex-col items-center justify-center bg-white p-5 text-center text-red-400"
			@click="advanceProgress"
		>
			<Transition name="fade" mode="out-in">
				<QuestionAnswer
					v-if="procedure[progress] !== 'give_points'"
					:question="template.activeCellData!.question"
					:answer="template.activeCellData!.answer"
					:show-answer="procedure[progress] === 'reveal_answer'"
				/>

				<GiveGuestPoints
					v-else
					:guest-list="guests.list"
					:cell-points="template.activeCellData!.points"
					@give-points="givePoints"
				/>
			</Transition>

			<p
				v-if="template.activeCellData?.answeredBy"
				class="font-xl mt-10 font-bold"
			>
				answered by: {{ template.activeCellData?.answeredBy }}
			</p>
		</div>
	</div>
</template>
