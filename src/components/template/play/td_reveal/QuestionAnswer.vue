<script setup lang="ts">
import IconEdit from "~icons/material-symbols/edit-rounded";

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
	<div class="grid">
		<div class="overflow-hidden">
			<p>{{ activeTableDataCell!.question.text }}</p>

			<div v-if="activeTableDataCell!.question.image" class="image-wrapper">
				<img
					:src="activeTableDataCell!.question.image"
					:alt="ImgAltTxt('question')"
				/>
			</div>

			<Transition
				name="height-auto"
				enter-active-class="duration-1000"
				leave-active-class="duration-1000"
			>
				<div v-if="props.showAnswer" class="grid">
					<div class="overflow-hidden">
						<hr class="mx-12 my-5 border-t-2 border-red-400" />

						<p class="font-bold">
							{{ activeTableDataCell!.answer.text }}
						</p>

						<div v-if="activeTableDataCell!.answer.image" class="image-wrapper">
							<img
								:src="activeTableDataCell!.answer.image"
								:alt="ImgAltTxt('answer')"
							/>
						</div>
					</div>
				</div>
			</Transition>

			<div
				v-if="activeTableDataCell!.answeredBy"
				class="mx-auto mt-10 flex w-fit items-center gap-3 rounded bg-red-400 p-2 font-bold tracking-wide text-white shadow shadow-black/30"
			>
				answered by: {{ activeTableDataCell!.answeredBy ?? "no one" }}

				<button
					type="button"
					class="rounded bg-white p-2 text-red-400 shadow shadow-black/30 transition-[box-shadow,_transform] hover:-translate-y-1 hover:shadow-md"
					@click="emit('change-answeree')"
				>
					<IconEdit />
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped lang="postcss">
p {
	@apply break-words;
}

.image-wrapper {
	@apply mx-auto w-2/3 p-2 py-5;
}

img {
	@apply rounded shadow shadow-black/30;
}
</style>
