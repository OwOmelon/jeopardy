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

function blur(): void {
	textBox.value?.blur();
}

defineExpose({ blur });
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
				: 'add guest'
		"
		maxlength="12"
		:disabled="
			guests.guestLimitReached
				? guests.activeGuestID
					? false
					: true
				: false
		"
		@keydown.enter="emit('save-changes')"
		:class="[
			guests.guestLimitReached
				? guests.activeGuestID
					? 'bg-stone-100'
					: 'bg-stone-400 placeholder:text-stone-500'
				: 'bg-stone-100',
			'mt-3 w-full rounded border-y-2 border-transparent px-2 shadow shadow-black/30 outline-none transition-colors focus:border-b-red-400',
		]"
	/>
</template>
