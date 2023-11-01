<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useGuestsStore } from "../../stores/guests";

const props = defineProps<{
	editing: boolean;
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
			editing ? 'dark' : 'light',
			'mt-2 flex items-center justify-center gap-2 rounded px-2 text-xl shadow shadow-black/30 transition-colors',
		]"
		@click="emit('save-changes')"
	>
		<span>{{ guests.activeGuestID ? "edit" : "add" }}</span>
		<Icon
			:icon="guests.activeGuestID ? 'ion:checkmark-round' : 'ion:plus-round'"
		/>
	</button>
</template>

<style scoped lang="postcss">
.light {
	@apply bg-red-400 text-white hover:bg-red-300;
}

.light:disabled {
	@apply cursor-not-allowed bg-stone-400 text-stone-500;
}

.dark {
	@apply bg-stone-300 text-stone-600 hover:bg-stone-400;
}

.dark:disabled {
	@apply cursor-not-allowed bg-stone-700 text-stone-500;
}
</style>
