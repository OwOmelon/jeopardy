<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
	defineProps<{ show: boolean; speed?: "slow" | "medium" | "fast" }>(),
	{
		speed: "fast",
	},
);

const transitionDuration = computed(() => {
	const options = {
		enterActiveClass: "duration-300",
		leaveActiveClass: "duration-300",
	};

	switch (props.speed) {
		case "slow":
			options.enterActiveClass = "duration-1000";
			options.leaveActiveClass = "duration-1000";
			break;

		case "medium":
			options.enterActiveClass = "duration-500";
			options.leaveActiveClass = "duration-500";
			break;
	}

	return options;
});
</script>

<template>
	<Transition name="height-auto" v-bind="transitionDuration">
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
