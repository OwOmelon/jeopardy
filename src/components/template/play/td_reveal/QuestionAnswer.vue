<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useTemplateStore } from "@/stores/template";
import { Icon } from "@iconify/vue";

const props = defineProps<{
	showAnswer: boolean;
}>();

const emit = defineEmits<{
	"change-answeree": [];
}>();

const { activeCell: ActiveTemplateCell } = storeToRefs(useTemplateStore());

const ImgAltTxt = (type: string) => {
	return `image for ${type} of ${
		ActiveTemplateCell.value!.category || ActiveTemplateCell.value!.column
	} for ${ActiveTemplateCell.value!.points} points`;
};
</script>

<template>
	<div class="grid">
		<div class="overflow-hidden">
			<div v-if="ActiveTemplateCell!.question.image" class="image-wrapper">
				<img
					:src="ActiveTemplateCell!.question.image"
					:alt="ImgAltTxt('question')"
				/>
			</div>

			<p class="text-xl">{{ ActiveTemplateCell!.question.text }}</p>

			<Transition
				name="height-auto"
				enter-active-class="duration-1000"
				leave-active-class="duration-1000"
			>
				<div v-if="props.showAnswer" class="grid">
					<div class="overflow-hidden">
						<hr class="my-5 border-t-2 border-red-400" />

						<div v-if="ActiveTemplateCell!.answer.image" class="image-wrapper">
							<img
								:src="ActiveTemplateCell!.answer.image"
								:alt="ImgAltTxt('answer')"
							/>
						</div>

						<p class="text-3xl font-bold">
							{{ ActiveTemplateCell!.answer.text }}
						</p>
					</div>
				</div>
			</Transition>

			<div
				v-if="ActiveTemplateCell!.answeredBy"
				class="mx-auto mb-1 mt-10 flex w-fit items-center gap-3 rounded bg-red-400 p-2 font-bold tracking-wide text-white shadow shadow-black/30"
			>
				answered by: {{ ActiveTemplateCell!.answeredBy ?? "no one" }}

				<button
					type="button"
					class="rounded bg-white p-2 text-red-400 shadow shadow-black/30 transition-[box-shadow,_transform] hover:-translate-y-1 hover:shadow-md"
					@click="emit('change-answeree')"
				>
					<Icon icon="material-symbols:edit-rounded" />
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
	@apply mx-auto mb-6 w-fit p-2;
}

img {
	@apply rounded shadow shadow-black/30;
}
</style>
