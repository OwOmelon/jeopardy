<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useTemplateStore } from "@/stores/template";
import {
	type AnswerResult,
	useGameProgressStore,
} from "@/stores/game_progress";
import { type Guest, useGuestsStore } from "@/stores/guests";

import IconArrowRight from "~icons/material-symbols/arrow-right-rounded";
import HeightAuto from "@/components/HeightAutoTransitionWrapper.vue";

const props = defineProps<{
	revealProgress: number;
}>();

const emit = defineEmits<{
	done: [];
}>();

const { activeTableDataCell } = storeToRefs(useTemplateStore());
const { getAnswerResults, updateGameProgress } = useGameProgressStore();
const { list: guestList } = storeToRefs(useGuestsStore());

// --------------------

const answerResults = ref<AnswerResult>(
	getAnswerResults(
		activeTableDataCell.value!.row,
		activeTableDataCell.value!.column,
	),
);

function getGuestAnswerResult(guestID: Guest["id"]): "success" | "fail" | "" {
	return answerResults.value.success === guestID
		? "success"
		: answerResults.value.fail.indexOf(guestID) !== -1
			? "fail"
			: "";
}

function onGuestBtnClick(guestID: Guest["id"]): void {
	const guestAnswerResult = getGuestAnswerResult(guestID);

	if (props.revealProgress < 4) {
		if (guestAnswerResult === "success") answerResults.value.success = null;
		if (guestAnswerResult === "fail") {
			answerResults.value.fail.splice(
				answerResults.value.fail.indexOf(guestID),
				1,
			);
		} else {
			answerResults.value.fail.push(guestID);
		}
	} else {
		answerResults.value.success =
			guestAnswerResult === "success" ? null : guestID;
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
		<span>who got it {{ props.revealProgress < 4 ? "wrong" : "right" }} ?</span>

		<div
			v-if="guestList.length > 1"
			class="my-10 flex flex-wrap justify-center gap-3"
		>
			<button
				v-for="guest in guestList"
				:key="guest.id"
				type="button"
				:disabled="
					getGuestAnswerResult(guest.id) === 'fail' &&
					props.revealProgress === 4
				"
				:class="[`guest_${getGuestAnswerResult(guest.id)}`]"
				@click="onGuestBtnClick(guest.id)"
			>
				{{ guest.name }}
			</button>
		</div>

		<HeightAuto :show="revealProgress === 4">
			<button
				type="button"
				class="group m-1 flex items-center bg-red-400 text-white"
				@click="confirm"
			>
				confirm

				<IconArrowRight
					class="ml-3 scale-[3] transition-transform group-hover:translate-x-2"
				/>
			</button>
		</HeightAuto>
	</div>
</template>

<style scoped lang="postcss">
button {
	@apply shadow-subtle rounded-[0.15em] p-[0.4em] transition-[background-color,_color,_opacity,_transform] hover:-translate-y-1;
}

/* ----- */

.guest_ {
	@apply bg-stone-300 text-stone-600;
}

.guest_fail {
	animation: lose-points 0.5s;
	@apply bg-stone-600 text-stone-300 disabled:pointer-events-none disabled:opacity-50;
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
