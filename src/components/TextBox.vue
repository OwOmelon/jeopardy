<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const props = withDefaults(
	defineProps<{
		modelValue: string;
		placeholder?: string;
		focusClasses?: string;
		disabled?: boolean;
		blurOnKeydownEnter?: boolean;
	}>(),
	{
		placeholder: "",
		focusClasses: "",
		disabled: false,
	},
);

const emit = defineEmits<{
	blur: [];
	focus: [];
	"update:modelValue": [string];
}>();

const container = ref<HTMLDivElement | null>(null);
const input = ref<HTMLSpanElement | null>(null);

const focused = ref<boolean>(false);

function moveCaretPosition(): void {
	if (!input.value!.hasChildNodes()) return;

	const range = document.createRange();
	const selection = window.getSelection()!;
	const node = input.value!.lastChild!;

	range.setStart(node, node.textContent?.length ?? 0);
	range.collapse(true);

	selection.removeAllRanges();
	selection.addRange(range);
}

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
	<div
		ref="container"
		:class="[focused ? focusClasses : '', 'relative flex']"
		@click="
			() => {
				if (focused) return;

				input!.focus();
				moveCaretPosition();
			}
		"
	>
		<span
			ref="input"
			:contenteditable="!disabled"
			class="block h-full w-full whitespace-pre-wrap outline-none"
			@focus="
				() => {
					focused = true;
					emit('focus');
				}
			"
			@blur="
				() => {
					focused = false;
					emit('blur');
				}
			"
			@input="emit('update:modelValue', input!.innerText)"
			@keydown.enter="
				() => {
					if (blurOnKeydownEnter) input!.blur();
				}
			"
		/>

		<span v-if="props.disabled && !modelValue.length">&nbsp</span>

		<div
			v-if="!modelValue.trim().length"
			class="pointer-events-none absolute bottom-0 left-0 top-0 h-full w-full border-[inherit] p-[inherit] opacity-50"
		>
			<span class="block h-full w-full overflow-hidden">
				{{ placeholder }}
			</span>
		</div>
	</div>
</template>
