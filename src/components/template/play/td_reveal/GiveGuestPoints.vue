<script setup lang="ts">
import { ref, inject } from "vue";
import { storeToRefs } from "pinia";
import { useTemplateStore } from "@/stores/template";
import {
	type AnswerResults,
	useGameProgressStore,
} from "@/stores/game_progress";
import { type Guest, useGuestsStore } from "@/stores/guests";
import { revealProgressInjectionKey } from "./reveal-progress-injection-key";

import ConfirmBtn_ProgressNav from "./ConfirmBtn_ProgressNav.vue";

type AnswerResult = keyof AnswerResults;

const emit = defineEmits<{
	done: [];
}>();

const { activeTableDataCell } = storeToRefs(useTemplateStore());
const { getAnswerResults, updateGameProgress } = useGameProgressStore();
const { list: guestList } = storeToRefs(useGuestsStore());

// --------------------

const { revealProgress } = inject(revealProgressInjectionKey)!;
const answerResults = ref<AnswerResults>(
	getAnswerResults(
		activeTableDataCell.value!.row,
		activeTableDataCell.value!.column,
	),
);

function getGuestAnswerResult(guestID: Guest["id"]): AnswerResult | "" {
	return answerResults.value.success === guestID
		? "success"
		: answerResults.value.fail.indexOf(guestID) !== -1
			? "fail"
			: "";
}

function removeGuestFromFailAnswerResults(guestID: Guest["id"]): void {
	answerResults.value.fail.splice(answerResults.value.fail.indexOf(guestID), 1);
}

function onGuestBtnClick(guestID: Guest["id"]): void {
	const guestAnswerResult = getGuestAnswerResult(guestID);

	if (revealProgress.value < 4) {
		switch (guestAnswerResult) {
			case "success":
				answerResults.value.success = null;
				answerResults.value.fail.push(guestID);
				break;

			case "fail":
				removeGuestFromFailAnswerResults(guestID);
				break;

			case "":
				answerResults.value.fail.push(guestID);
				break;
		}

		return;
	}

	answerResults.value.success =
		guestAnswerResult === "success" ? null : guestID;
}

function onSingleGuestBtnClick(result: AnswerResult): void {
	const guestID = guestList.value[0].id;
	const guestAnswerResult = getGuestAnswerResult(guestList.value[0].id);

	switch (result) {
		case "fail":
			answerResults.value.success = null;

			if (guestAnswerResult !== "fail") {
				answerResults.value.fail.push(guestID);
			} else {
				removeGuestFromFailAnswerResults(guestID);
			}

			break;
		case "success":
			removeGuestFromFailAnswerResults(guestID);

			answerResults.value.success =
				guestAnswerResult !== "success" ? guestID : null;
	}
}

function confirm(): void {
	updateGameProgress(
		activeTableDataCell.value!.row,
		activeTableDataCell.value!.column,
		answerResults.value,
	);

	emit("done");
}
</script>

<template>
	<div class="flex flex-col items-center justify-center text-4xl font-bold">
		<template v-if="guestList.length > 1">
			<span> who got it {{ revealProgress < 4 ? "wrong" : "right" }} ? </span>

			<div class="buttons">
				<button
					v-for="guest in guestList"
					:key="guest.id"
					type="button"
					:disabled="
						getGuestAnswerResult(guest.id) === 'fail' && revealProgress === 4
					"
					:class="[`guest_${getGuestAnswerResult(guest.id)}`, 'rect-btn']"
					@click="onGuestBtnClick(guest.id)"
				>
					{{ guest.name }}
				</button>
			</div>

			<ConfirmBtn_ProgressNav @confirm="confirm" />
		</template>

		<template v-else>
			<span>did {{ guestList[0].name }} get it right?</span>

			<div class="buttons">
				<button
					v-for="{ text, answerResultType } in [
						{ text: 'no', answerResultType: 'fail' },
						{ text: 'yes', answerResultType: 'success' },
					]"
					type="button"
					:class="[
						`guest_${getGuestAnswerResult(guestList[0].id) === answerResultType ? answerResultType : ''}`,
						'rect-btn',
					]"
					@click="onSingleGuestBtnClick(answerResultType as AnswerResult)"
				>
					{{ text }}
				</button>
			</div>

			<ConfirmBtn_ProgressNav @confirm="confirm" />
		</template>
	</div>
</template>

<style scoped lang="postcss">
.buttons {
	@apply my-10 flex flex-wrap justify-center gap-3;
}

:deep(button):disabled {
	@apply opacity-50;
}

:deep(.rect-btn) {
	@apply shadow-subtle rounded-[0.15em] p-[0.4em] transition-[background-color,_color,_opacity,_transform] hover:-translate-y-1;
}

/* ----- */

.guest_ {
	@apply bg-stone-300 text-stone-600;
}

.guest_fail {
	animation: lose-points 0.5s;
	@apply bg-stone-600 text-stone-300 disabled:pointer-events-none;
}

.guest_success {
	animation: gain-points 0.75s;
	@apply bg-red-400 text-white;
}

/* ----- */

@keyframes lose-points {
	0%,
	25%,
	50%,
	75%,
	100% {
		rotate: -3deg;
	}

	12.5%,
	37.5%,
	62.5%,
	87.5% {
		rotate: 3deg;
	}

	25%,
	75% {
		translate: 0 -0.5rem;
	}
}

@keyframes gain-points {
	0% {
		@apply bg-stone-300 text-stone-500;
	}

	25%,
	50% {
		scale: 1.1;
		@apply bg-white text-amber-300 shadow-[0_0_50px] shadow-amber-300;
	}
}
</style>
