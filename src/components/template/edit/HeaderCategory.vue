<script setup lang="ts">
import { ref, watch } from "vue";
import DragHandle from "@/components/DragHandle.vue";
import TextBox from "@/components/TextBox.vue";

import type { ColumnID } from "@/stores/template";

const props = defineProps<{
	column: ColumnID;
	category: string;
}>();

const emit = defineEmits<{
	"change-column-category": [ColumnID, typeof props.category];
}>();

const textInput = ref(props.category);

watch(
	() => props.category,
	(val) => {
		textInput.value = val;
	},
);
</script>

<template>
	<th>
		<div class="bounce-y-wrapper">
			<div class="cell cell-width cell-padding th-bg group relative">
				<TextBox
					v-model="textInput"
					:placeholder="props.column"
					blur-on-keydown-enter
					@blur="emit('change-column-category', props.column, textInput)"
				/>

				<DragHandle />
			</div>
		</div>
	</th>
</template>

<style scoped lang="postcss">
.bounce-y .bounce-y-wrapper {
	animation: bounce-y 1s ease-in-out infinite;
}

.dragging .cell {
	@apply opacity-50;
}

.drop-to .cell {
	@apply -translate-y-1;
}

@keyframes bounce-y {
	0%,
	100% {
		transform: translateY(0);
	}

	50% {
		transform: translateY(-0.5rem);
	}
}
</style>
