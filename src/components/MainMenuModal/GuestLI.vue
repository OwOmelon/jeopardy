<script setup lang="ts">
import { computed } from "vue";
import { useGuestsStore } from "../../stores/guests";
import { Icon } from "@iconify/vue";

import type { Guest } from "../../stores/guests";

const props = defineProps<{
	guest: Guest;
}>();

const emit = defineEmits<{
	"set-text-input-to-guest-name": [];
	"reset-text-box": [];
}>();

const guests = useGuestsStore();

const currentlyEditing = computed<boolean | "active">(() => {
	return guests.activeGuestID
		? guests.activeGuestID === props.guest.id
			? "active"
			: true
		: false;
});
</script>

<template>
	<li
		:class="[
			currentlyEditing === 'active'
				? 'bg-red-400 text-white'
				: currentlyEditing === true
				? 'bg-stone-400'
				: 'hover:bg-stone-200',
			'transition-color group flex items-center justify-between rounded px-2 duration-150',
		]"
	>
		<span>{{ guest.name }}</span>

		<div
			:class="[
				currentlyEditing === 'active'
					? '!opacity-100'
					: currentlyEditing === true
					? 'pointer-events-none !opacity-0'
					: 'group-hover:opacity-100',
				'flex items-center gap-2 transition-opacity lg:opacity-0',
			]"
		>
			<button
				type="button"
				:disabled="currentlyEditing === true"
				@click="
					() => {
						if (guests.activeGuestID === props.guest.id) {
							guests.activeGuestID = '';
							emit('reset-text-box');
						} else {
							guests.activeGuestID = props.guest.id;
							emit('set-text-input-to-guest-name');
						}
					}
				"
			>
				<Icon
					:icon="
						currentlyEditing === 'active'
							? 'material-symbols:cancel-rounded'
							: 'material-symbols:edit-rounded'
					"
				/>
			</button>
			<button
				type="button"
				:disabled="currentlyEditing === true"
				@click="
					() => {
						emit('reset-text-box');
						guests.deleteGuest(props.guest.id);
					}
				"
			>
				<Icon icon="material-symbols:delete-rounded" />
			</button>
		</div>
	</li>
</template>

<style scoped lang="postcss">
button {
	@apply transition-transform hover:scale-150 active:scale-100;
}
</style>
