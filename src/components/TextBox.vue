<script setup lang="ts">
import { ref, onMounted } from "vue";

const {
	modelValue,
	placeholder = "",
	focusClasses = "",
	disabled = false,
	blurOnKeydownEnter = false,
} = defineProps<{
	modelValue: string;
	placeholder?: string;
	focusClasses?: string;
	disabled?: boolean;
	blurOnKeydownEnter?: boolean;
}>();

const emit = defineEmits<{
	blur: [];
	focus: [];
	"update:modelValue": [string];
}>();

const container = ref<HTMLDivElement | null>(null);
const input = ref<HTMLSpanElement | null>(null);

const focused = ref<boolean>(false);

onMounted(() => {
	input.value!.innerText = modelValue;
});
</script>

<template>
	<div
		ref="container"
		:class="[focused ? focusClasses : '', 'relative']"
		@click="input!.focus()"
	>
		<span
			ref="input"
			:contenteditable="!disabled"
			class="block outline-none"
			@focus="() => {
				focused = true
				emit('focus')
			}"
			@blur="() => {
				focused = false
				emit('blur')
			}"
			@input="emit('update:modelValue', input!.innerText.trim())"
			@keydown.enter="() => {
				if (blurOnKeydownEnter) input!.blur()
			}"
		>
		</span>

		<div
			v-if="!modelValue.length"
			class="pointer-events-none absolute bottom-0 left-0 top-0 h-full w-full border-[inherit] p-[inherit] opacity-50"
		>
			<span class="block h-full w-full overflow-hidden">
				{{ placeholder }}
			</span>
		</div>
	</div>
</template>
