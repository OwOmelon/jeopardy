<script setup lang="ts">
import { ref, computed } from "vue";
import { usePlayersStore } from "../../stores/players";

const props = defineProps<{
	modelValue: string;
}>();

const emit = defineEmits<{
	"save-changes": [];
	"update:modelValue": [string];
}>();

const players = usePlayersStore();

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
			players.activePlayerID
				? 'edit player name'
				: players.playerLimitReached
				? 'player limit reached'
				: 'add player'
		"
		maxlength="12"
		:disabled="
			players.playerLimitReached
				? players.activePlayerID
					? false
					: true
				: false
		"
		@keydown.enter="emit('save-changes')"
		:class="[
			players.playerLimitReached
				? players.activePlayerID
					? 'bg-white'
					: 'bg-neutral-400 placeholder:text-neutral-500'
				: 'bg-white',
			'mt-3 w-full rounded border-y-2 border-transparent px-2 shadow shadow-black/30 outline-none transition-colors focus:border-b-red-400',
		]"
	/>
</template>
