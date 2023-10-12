<script setup lang="ts">
import { ref, computed } from "vue";

const {
	modelValue,
	placeholder = "",
	disabled = false,
} = defineProps<{
	modelValue: string;
	placeholder?: string;
	disabled?: boolean;
}>();

const emit = defineEmits<{
	"update:modelValue": [string];
	"on-blur": [];
}>();

const spanTextBox = ref<HTMLSpanElement | null>(null);

const textInput = computed({
	get() {
		return modelValue;
	},

	set(newValue) {
		emit("update:modelValue", newValue);
	},
});
</script>

<template>
	<div class="relative">
		<span
			ref="spanTextBox"
			:contenteditable="!disabled"
			class="block"
			@keydown.enter="spanTextBox?.blur()"
			@blur="emit('on-blur')"
			@input="textInput = ($event.target as HTMLSpanElement).innerText"
		>
			{{ modelValue }}
		</span>
	</div>
</template>
