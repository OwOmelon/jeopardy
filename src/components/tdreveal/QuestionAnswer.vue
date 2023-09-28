<script setup lang="ts">
const props = defineProps<{
	question: string;
	answer: string;
	showAnswer: boolean;
}>();
</script>

<template>
	<div>
		<p class="text-xl">{{ props.question }}</p>

		<Transition name="height-auto">
			<div v-if="props.showAnswer" class="grid">
				<div class="overflow-hidden">
					<hr class="my-5 border-t-2 border-red-400" />
					
					<p class="text-3xl font-bold">
						{{ props.answer }}
					</p>
				</div>
			</div>
		</Transition>
	</div>
</template>
