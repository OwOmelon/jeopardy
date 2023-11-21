<script setup lang="ts">
import { ref, computed } from "vue";
import { useGuestsStore } from "../../stores/guests";

const props = defineProps<{
	modelValue: string;
}>();

const emit = defineEmits<{
	"save-changes": [];
	"update:modelValue": [string];
}>();

const guests = useGuestsStore();

const textBox = ref<HTMLInputElement | null>(null);
const writableModalValue = computed<string>({
	get() {
		return props.modelValue;
	},

	set(value) {
		emit("update:modelValue", value);
	},
});

function focus(): void {
	textBox.value?.focus();
}

function blur(): void {
	textBox.value?.blur();
}

defineExpose({ focus, blur });
</script>

<template>
	<input
		ref="textBox"
		v-model="writableModalValue"
		type="text"
		:placeholder="
			guests.activeGuestID
				? 'edit guest name'
				: guests.guestLimitReached
				? 'guest limit reached'
				: 'insert guest name'
		"
		maxlength="15"
		:disabled="
			guests.guestLimitReached ? (guests.activeGuestID ? false : true) : false
		"
		@keydown.enter="emit('save-changes')"
		class="input mt-3 w-full rounded border-y-2 border-transparent px-2 shadow shadow-black/30 outline-none transition-colors"
	/>
</template>

<style scoped lang="postcss">
.light .input {
	@apply bg-stone-100 focus:border-b-red-400;
}

.light .input:disabled {
	@apply cursor-not-allowed bg-stone-400 placeholder:text-stone-500;
}

.dark .input {
	@apply bg-stone-500 text-stone-100 placeholder:text-stone-400 focus:border-b-stone-100;
}

.dark .input:disabled {
	@apply cursor-not-allowed bg-stone-700 placeholder:text-stone-500;
}
</style>
