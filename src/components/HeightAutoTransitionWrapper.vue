<script setup lang="ts">
const props = defineProps<{
	show: boolean;
}>();
</script>

<template>
	<Transition name="height-auto">
		<div v-if="show" class="grid">
			<div class="overflow-hidden">
				<slot />
			</div>
		</div>
	</Transition>
</template>

<style scoped lang="scss">
.height-auto {
	&-enter-active,
	&-leave-active {
		transition:
			grid-template-rows 300ms,
			opacity 300ms;
	}

	&-enter-from,
	&-leave-to {
		grid-template-rows: 0fr;
		opacity: 0;
	}

	&-enter-to,
	&-leave-from {
		grid-template-rows: 1fr;
	}
}
</style>
