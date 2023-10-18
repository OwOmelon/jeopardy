<script setup lang="ts">
import { ref } from "vue";
import { useTemplateStore } from "@/stores/template";
import { useGuestsStore } from "@/stores/guests";

import type { Guest } from "@/stores/guests";

import { Icon } from "@iconify/vue";

const props = defineProps<{
	progress: number;
	guestList: Guest[];
	cellPoints: number;
}>();

const emit = defineEmits<{
	"advance-progress": [];
	done: [];
}>();

const template = useTemplateStore();
const guests = useGuestsStore();

const guestsPtsDeduct = ref<Guest["id"][]>([]);
const guestPtsAdd = ref<Guest["id"] | null>(null);

function onGuestBtnClick(id: Guest["id"]): void {
	if (props.progress < 4) {
		if (guestsPtsDeduct.value.includes(id)) {
			guestsPtsDeduct.value = guestsPtsDeduct.value.filter(
				(guestID) => guestID !== id,
			);
		} else {
			guestsPtsDeduct.value.push(id);
		}
	} else {
		guestPtsAdd.value = guestPtsAdd.value === id ? null : id;
	}
}

function confirm(): void {
	guestsPtsDeduct.value.forEach((guestID) => {
		guests.editGuestPoints(guestID, -props.cellPoints);
	});

	if (guestPtsAdd.value) {
		guests.editGuestPoints(guestPtsAdd.value, props.cellPoints);

		template.setPlayProgressTracker(guestPtsAdd.value);
	}

	emit('done')
}
</script>

<template>
	<div class="flex flex-col items-center justify-center text-xl font-bold">
		<span>who got it {{ props.progress < 4 ? "wrong" : "right" }} ?</span>

		<div
			v-if="props.guestList.length > 1"
			class="my-5 flex flex-wrap justify-center gap-3"
		>
			<button
				v-for="(guest, index) in props.guestList"
				:key="index"
				type="button"
				:disabled="guestsPtsDeduct.includes(guest.id) && props.progress === 4"
				:class="[
					guestsPtsDeduct.includes(guest.id)
						? `bg-stone-400 text-stone-200 ${
								props.progress === 4 ? 'pointer-events-none opacity-50' : ''
						  }`
						: guestPtsAdd === guest.id
						? 'bg-red-400 text-white'
						: 'bg-stone-200 text-stone-400',
					'rounded p-2 shadow shadow-black/30 transition-[background-color,_color,_opacity,_transform] hover:-translate-y-1',
				]"
				@click="onGuestBtnClick(guest.id)"
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

<!-- <style lang="postcss" scoped>
button {
	@apply rounded p-2 shadow shadow-black/30 transition-[background-color,_color,_transform];
}
</style> -->
