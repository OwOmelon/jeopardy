<script setup lang="ts">
import IconDragHorizontal from "~icons/carbon/drag-horizontal";
import IconDragVertical from "~icons/carbon/drag-vertical";

const props = defineProps<{
	rotate?: boolean;
}>();
</script>

<template>
	<div
		:class="[
			rotate ? 'px-1 py-3' : 'px-3 py-1',
			{ 'flex-col': props.rotate },
			'handle absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 cursor-grab rounded bg-stone-300 shadow shadow-black/30 transition-opacity active:cursor-grabbing group-hover:opacity-100 lg:opacity-0',
		]"
		@click.stop
	>
		<IconDragVertical v-if="rotate" />
		<IconDragHorizontal v-else />
	</div>
</template>

<style scoped lang="postcss">
svg {
	@apply h-5 w-5 text-stone-600;
}
</style>
