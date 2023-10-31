<script setup lang="ts">
import { ref } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useGuestsStore } from "@/stores/guests";

import type { Guest } from "@/stores/guests";

import { Icon } from "@iconify/vue";

const props = defineProps<{
	progress: number;
}>();

const emit = defineEmits<{
	done: [];
}>();

const template = useTemplateStore();
const guests = useGuestsStore();

const guestsPtsDeduct = ref<Guest[]>([]);
const guestPtsAdd = ref<Guest | null>(null);

function guestsPtsDeductIncludesGuest(guest: Guest): boolean {
	return (
		guestsPtsDeduct.value.findIndex(
			(guestDeduct) => guestDeduct.id === guest.id,
		) > -1
	);
}

function onGuestBtnClick(guest: Guest): void {
	if (props.progress < 4) {
		if (guestsPtsDeduct.value.includes(guest)) {
			guestsPtsDeduct.value = guestsPtsDeduct.value.filter(
				(guestDeduct) => guestDeduct.id !== guest.id,
			);
		} else {
			if (guest.id === guestPtsAdd.value?.id) {
				guestPtsAdd.value = null;
			}

			guestsPtsDeduct.value.push(guest);
		}
	} else {
		guestPtsAdd.value = guestPtsAdd.value === guest ? null : guest;
	}
}

function confirm(): void {
	if (guestPtsAdd.value) {
		guests.editGuestPoints(
			guestPtsAdd.value.id,
			template.activeCell!.points,
			true,
		);
	}

	guestsPtsDeduct.value.forEach((guestDeduct) => {
		guests.editGuestPoints(guestDeduct.id, -template.activeCell!.points, true);
	});

	template.setPlayProgressTracker(guestPtsAdd.value?.name ?? null);
	emit("done");
}
</script>

<template>
	<div class="flex flex-col items-center justify-center text-xl font-bold">
		<span>who got it {{ props.progress < 4 ? "wrong" : "right" }} ?</span>

		<div
			v-if="guests.list.length > 1"
			class="my-5 flex flex-wrap justify-center gap-3"
		>
			<button
				v-for="(guest, index) in guests.list"
				:key="index"
				type="button"
				:disabled="guestsPtsDeductIncludesGuest(guest) && props.progress === 4"
				:class="[
					guestsPtsDeductIncludesGuest(guest)
						? `lose-points ${
								props.progress === 4 ? 'pointer-events-none opacity-50' : ''
						  }`
						: guestPtsAdd?.id === guest.id
						? 'gain-points'
						: 'bg-stone-300 text-stone-500',
					'rounded p-2 shadow shadow-black/30 transition-[background-color,_color,_opacity,_transform] hover:-translate-y-1',
				]"
				@click="onGuestBtnClick(guest)"
			>
				{{ guest.name }}
			</button>
		</div>

		<Transition name="height-auto">
			<div v-if="props.progress === 4" class="grid">
				<div class="overflow-hidden">
					<button
						v-if="props.progress === 4"
						type="button"
						class="group flex items-center text-3xl"
						@click="confirm"
					>
						confirm

						<Icon
							icon="material-symbols:arrow-right-rounded"
							class="h-16 w-16 transition-transform group-hover:translate-x-2"
						/>
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped lang="postcss">
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
