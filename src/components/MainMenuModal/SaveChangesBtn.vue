<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { usePlayersStore } from "../../stores/players";

const props = defineProps<{
	textInputLength: number;
}>();

const emit = defineEmits<{
	"save-changes": [];
}>();

const players = usePlayersStore();
</script>

<template>
	<button
		type="button"
		:disabled="!props.textInputLength"
		:class="[
			props.textInputLength
				? 'bg-red-400 text-white hover:bg-red-300'
				: 'cursor-not-allowed bg-stone-400',
			'mt-2 flex items-center justify-center gap-2 rounded px-2 text-xl shadow shadow-black/30 transition-colors',
		]"
		@click="emit('save-changes')"
	>
		<span>{{ players.activePlayerID ? "edit" : "add" }}</span>
		<Icon
			:icon="players.activePlayerID ? 'ion:checkmark-round' : 'ion:plus-round'"
		/>
	</button>
</template>
