<script setup lang="ts">
import { ref } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useGameProgressStore } from "@/stores/game_progress";
import { useGuestsStore } from "@/stores/guests";

import type { Guest } from "@/stores/guests";
type MappedGuestList = (Guest & { answered: "no" | "failed" | "succeeded" })[];

import IconArrowRight from "~icons/material-symbols/arrow-right-rounded";
import HeightAuto from "@/components/HeightAutoTransitionWrapper.vue";

const props = defineProps<{
	revealProgress: number;
}>();

const emit = defineEmits<{
	done: [];
}>();

const template = useTemplateStore();
const gameProgress = useGameProgressStore();
const guests = useGuestsStore();

// !!! rename this variable
const mappedGuestList = ref<MappedGuestList>(getMappedGuestList());

function onGuestBtnClick(guest: (typeof mappedGuestList.value)[number]): void {
	if (guest.answered !== "no") {
		guest.answered = "no";

		return;
	}

	if (props.revealProgress < 4) {
		guest.answered = "failed";
	} else {
		mappedGuestList.value.forEach((guest) => {
			if (guest.answered === "succeeded") {
				guest.answered = "no";
			}
		});

		guest.answered = "succeeded";
	}
}

function confirm(): void {
	const failedToAnswer: Guest["id"][] = [];
	let successfulyAnswered: Guest["id"] | null = null;

	mappedGuestList.value.forEach((guest) => {
		switch (guest.answered) {
			case "failed":
				failedToAnswer.push(guest.id);
				break;

			case "succeeded":
				successfulyAnswered = guest.id;
				break;
		}
	});

	gameProgress.updateGameProgress(
		template.activeTableDataCell!.row,
		template.activeTableDataCell!.column,
		failedToAnswer,
		successfulyAnswered,
	);

	emit("done");
}

function getMappedGuestList(): MappedGuestList {
	const gameProgressValue =
		gameProgress.progress?.[template.activeTableDataCell!.row]?.[
			template.activeTableDataCell!.column
		];

	return guests.list.map((guest) => {
		return {
			...guest,
			answered: gameProgressValue?.failedToAnswer?.includes(guest.id)
				? "failed"
				: guest.id === gameProgressValue?.successfullyAnswered
					? "succeeded"
					: "no",
		};
	});
}
</script>

<template>
	<div class="flex flex-col items-center justify-center text-4xl font-bold">
		<span>who got it {{ props.revealProgress < 4 ? "wrong" : "right" }} ?</span>

		<div
			v-if="mappedGuestList.length > 1"
			class="my-10 flex flex-wrap justify-center gap-3"
		>
			<button
				v-for="guest in mappedGuestList"
				:key="guest.id"
				type="button"
				:disabled="guest.answered === 'failed' && props.revealProgress === 4"
				:class="[
					guest.answered === 'failed'
						? `lose-points ${
								props.revealProgress === 4
									? 'pointer-events-none opacity-50'
									: ''
							}`
						: guest.answered === 'succeeded'
							? 'gain-points'
							: 'bg-stone-300 text-stone-500',
				]"
				@click="onGuestBtnClick(guest)"
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
	@apply shadow-subtle rounded-[0.1em] p-[0.4em] transition-[background-color,_color,_opacity,_transform] hover:-translate-y-1;
}

.lose-points {
	animation: lose-points 0.5s;
	@apply bg-stone-500 text-stone-300;
}

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

.gain-points {
	animation: gain-points 0.75s;
	@apply bg-red-400 text-white;
}

@keyframes gain-points {
	0% {
		@apply bg-stone-300 text-stone-500;
	}

	25%,
	75% {
		scale: 1.1;
		@apply bg-white text-amber-300 shadow-[0_0_50px] shadow-amber-300;
	}
}
</style>
