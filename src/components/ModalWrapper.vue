<script setup lang="ts">
const props = defineProps<{
	show: boolean;
}>();
</script>

<template>
	<Teleport to="#modal">
		<Transition name="nested-fade-slide-down">
			<div
				v-if="props.show"
				class="component fixed left-0 top-0 z-50 grid h-screen w-screen place-items-center overflow-auto bg-black/50 p-5 backdrop-blur-sm"
			>
				<slot></slot>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped lang="postcss">
:slotted(.modal) {
	@apply w-[90vw] max-w-[900px] rounded shadow-[0_10px_40px] shadow-black/40;
}
</style>
