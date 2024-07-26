<script setup lang="ts">
import { inject } from "vue";
import {
	revealProgressInjectionKey,
	updateRevealProgressInjectionKey,
} from "./reveal-progress-injection-key";

import IconArrowLeft from "~icons/material-symbols/arrow-left-rounded";
import IconArrowRight from "~icons/material-symbols/arrow-right-rounded";

const emit = defineEmits<{
	confirm: [];
}>();

const { revealProgress, revealProgressLimit } = inject(
	revealProgressInjectionKey,
)!;

const { revertProgress, advanceProgress } = inject(
	updateRevealProgressInjectionKey,
)!;
</script>

<template>
	<div class="flex items-center justify-center gap-3">
		<button type="button" class="revert" @click.stop="revertProgress">
			<IconArrowLeft />
		</button>

		<button
			type="button"
			:disabled="revealProgress !== revealProgressLimit"
			class="rect-btn group m-1 flex items-center bg-red-400 text-white disabled:pointer-events-none"
			@click="emit('confirm')"
		>
			confirm
		</button>

		<button
			type="button"
			:disabled="revealProgress === revealProgressLimit"
			class="advance"
			@click.stop="advanceProgress"
		>
			<IconArrowRight />
		</button>
	</div>
</template>

<style scoped lang="postcss">
svg {
	@apply pointer-events-none scale-[3] text-red-400 transition-[opacity,_transform];
}

button:nth-child(1),
button:nth-child(3) {
	@apply p-[0.1em];
}

button:nth-child(1):hover svg {
	@apply -translate-x-2;
}

button:nth-child(3):hover svg {
	@apply translate-x-2;
}
</style>
