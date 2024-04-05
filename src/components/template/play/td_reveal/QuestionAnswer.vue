<script setup lang="ts">
import IconEdit from "~icons/material-symbols/edit-rounded";
import HeightAuto from "@/components/HeightAutoTransitionWrapper.vue";

import type { TableDataCell } from "@/stores/template";

const props = defineProps<{
	activeTableDataCell: TableDataCell;
	showAnswer: boolean;
}>();

const emit = defineEmits<{
	"change-answeree": [];
}>();

const ImgAltTxt = (type: string) => {
	return `image for ${type} of ${
		props.activeTableDataCell.category || props.activeTableDataCell.column
	} for ${props.activeTableDataCell.points} points`;
};
</script>

<template>
	<div>
		<p>{{ activeTableDataCell!.question.text }}</p>

		<div v-if="activeTableDataCell!.question.image" class="image-wrapper">
			<img
				:src="activeTableDataCell!.question.image"
				:alt="ImgAltTxt('question')"
			/>
		</div>

		<HeightAuto :show="showAnswer" speed="slow">
			<hr class="mx-12 my-5 rounded-full border-t-4 border-red-400" />

			<p class="font-bold">
				{{ activeTableDataCell!.answer.text }}
			</p>

			<div v-if="activeTableDataCell!.answer.image" class="image-wrapper">
				<img
					:src="activeTableDataCell!.answer.image"
					:alt="ImgAltTxt('answer')"
				/>
			</div>
		</HeightAuto>

		<div
			v-if="activeTableDataCell!.answeredBy"
			class="shadow-subtle mx-auto mt-10 flex w-fit items-center gap-3 rounded bg-red-400 p-2 font-bold tracking-wide text-white"
		>
			answered by: {{ activeTableDataCell!.answeredBy ?? "no one" }}

			<button
				type="button"
				class="shadow-subtle rounded bg-white p-2 text-red-400 transition-[box-shadow,_transform] hover:-translate-y-1 hover:shadow-md"
				@click="emit('change-answeree')"
			>
				<IconEdit />
			</button>
		</div>
	</div>
</template>

<style scoped lang="postcss">
p {
	@apply break-words py-1;
}

.image-wrapper {
	@apply mx-auto w-2/3 p-2 py-5;
}

img {
	@apply shadow-subtle mx-auto max-h-[300px] rounded;
}
</style>
