<script setup lang="ts">
import { ref, watch } from "vue";
import DragHandle from "./draggable/DragHandle.vue";
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
		<div class="bounce-y-wrapper group relative">
			<TextBox
				v-model="textInput"
				class="cell cell-width header-colors"
				:placeholder="props.column"
				blur-on-keydown-enter
				span-classes="cell-padding"
				@on-blur="emit('change-column-category', props.column, textInput)"
			/>

			<DragHandle />
		</div>
	</th>
</template>
