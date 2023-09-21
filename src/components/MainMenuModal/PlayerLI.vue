<script setup lang="ts">
import { computed } from "vue";
import { usePlayersStore } from "../../stores/players";
import { Icon } from "@iconify/vue";

import type { Player } from "../../stores/players";

const props = defineProps<{
	player: Player;
}>();

const emit = defineEmits<{
	"set-text-input-to-player-name": [];
	"reset-text-box": [];
}>();

const players = usePlayersStore();

const currentlyEditing = computed<boolean | "active">(() => {
	return players.activePlayerID
		? players.activePlayerID === props.player.id
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
				? 'bg-neutral-400'
				: 'hover:bg-neutral-200',
			'transition-color group flex items-center justify-between rounded px-2 duration-150',
		]"
	>
		<span>{{ player.name }}</span>

		<div
			:class="[
				currentlyEditing === 'active'
					? '!opacity-100'
					: currentlyEditing === true
					? 'pointer-events-none'
					: 'group-hover:opacity-100',
				'flex items-center gap-2 opacity-0 transition-opacity',
			]"
		>
			<button
				type="button"
				@click="
					() => {
						if (players.activePlayerID === props.player.id) {
							players.activePlayerID = '';
							emit('reset-text-box');
						} else {
							players.activePlayerID = props.player.id;
							emit('set-text-input-to-player-name');
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
			<button type="button" @click="players.deletePlayer(props.player.id)">
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
