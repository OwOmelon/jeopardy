<script setup lang="ts">
import { useGuestsStore } from "../../stores/guests";

import IconCheckmarkRound from "~icons/ion/checkmark-round";
import IconPlusRound from "~icons/ion/plus-round";

const props = defineProps<{
	textInputLength: number;
}>();

const emit = defineEmits<{
	"save-changes": [];
}>();

const guests = useGuestsStore();
</script>

<template>
	<button
		type="button"
		:disabled="!props.textInputLength"
		:class="[
			'shadow-subtle mt-2 flex items-center justify-center gap-2 rounded px-2 text-xl transition-colors',
		]"
		@click="emit('save-changes')"
	>
		<span>{{ guests.activeGuestID ? "edit" : "add" }}</span>

		<IconCheckmarkRound v-if="guests.activeGuestID" />
		<IconPlusRound v-else />
	</button>
</template>

<style scoped lang="postcss">
.light button {
	@apply bg-red-400 text-white hover:bg-red-300;
}

.light button:disabled {
	@apply cursor-not-allowed bg-stone-400 text-stone-500;
}

.dark button {
	@apply bg-stone-300 text-stone-600 hover:bg-stone-400;
}

.dark button:disabled {
	@apply cursor-not-allowed bg-stone-700 text-stone-500;
}
</style>
