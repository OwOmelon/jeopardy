<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const props = withDefaults(
	defineProps<{
		modelValue: string;
		placeholder?: string;
		disabled?: boolean;
	}>(),
	{
		placeholder: "",
		focusClasses: "",
		disabled: false,
	},
);

const emit = defineEmits<{
	"update:modelValue": [string];
}>();

const input = ref<HTMLSpanElement | null>(null);

watch(
	() => props.modelValue,
	(val) => {
		if (val !== input.value!.innerText) {
			input.value!.innerText = val;
		}
	},
);

onMounted(() => {
	input.value!.innerText = props.modelValue;
});
</script>

<template>
	<span
		ref="input"
		:contenteditable="!props.disabled"
		class="whitespace-pre-wrap"
		@input="emit('update:modelValue', input!.innerText)"
		@beforeinput="(e) => {
			if (input!.innerText === props.placeholder) {

				input!.innerText = ''
			}
		}"
		>{{ !modelValue.trim().length ? placeholder : "" }}</span
	>
</template>
