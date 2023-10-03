<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { Guest } from "@/stores/guests";

const props = defineProps<{
	guestList: Guest[];
	cellPoints: number;
}>();

const emit = defineEmits<{
	"give-points": [Guest["id"] | null];
}>();
</script>

<template>
	<div class="flex flex-col justify-center gap-3 text-2xl font-bold">
		<span>{{
			props.guestList.length > 1
				? `and the ${props.cellPoints} points go to ?`
				: `does ${props.guestList[0].name} get the ${props.cellPoints} points ?`
		}}</span>

		<div
			v-if="props.guestList.length > 1"
			class="flex flex-wrap justify-center gap-3"
		>
			<button
				v-for="(guest, index) in props.guestList"
				:key="index"
				type="button"
				@click="emit('give-points', guest.id)"
			>
				{{ guest.name }}
			</button>
		</div>

		<div class="mx-auto flex gap-3">
			<button
				v-if="props.guestList.length === 1"
				type="button"
				class="player-btn"
				@click="emit('give-points', props.guestList[0].id)"
			>
				yup
			</button>

			<button
				type="button"
				class="player-btn flex items-center gap-2"
				@click="emit('give-points', null)"
			>
				{{ props.guestList.length > 1 ? "no one" : "nope" }}

				<Icon icon="fa-solid:skull" />
			</button>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
button {
	@apply rounded bg-neutral-200 p-2 text-neutral-400 shadow shadow-black/30 transition-colors hover:bg-red-400 hover:text-white;
}
</style>
