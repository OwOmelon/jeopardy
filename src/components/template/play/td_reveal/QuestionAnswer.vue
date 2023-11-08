<script setup lang="ts">
import { useTemplateStore } from "@/stores/template";

const props = defineProps<{
	showAnswer: boolean;
}>();

const { activeCell } = useTemplateStore();
</script>

<template>
	<div class="grid">
		<div class="overflow-hidden">
			<p class="text-xl">{{ activeCell!.question }}</p>

			<Transition
				name="height-auto"
				enter-active-class="duration-1000"
				leave-active-class="duration-1000"
			>
				<div v-if="props.showAnswer" class="grid">
					<div class="overflow-hidden">
						<hr class="my-5 border-t-2 border-red-400" />

						<p class="text-3xl font-bold">
							{{ activeCell!.answer }}
						</p>
					</div>
				</div>
			</Transition>

			<span
				v-if="activeCell!.answeredBy !== undefined"
				class="font-xl text-red mt-10 block font-bold"
			>
				answered by: {{ activeCell!.answeredBy ?? "no one" }}
			</span>
		</div>
	</div>
</template>
