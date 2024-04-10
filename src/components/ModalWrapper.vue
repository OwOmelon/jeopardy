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
				class="fixed left-0 top-0 z-50 grid h-screen w-screen place-items-center overflow-auto bg-black/50 p-5 backdrop-blur-sm"
			>
				<slot></slot>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped lang="postcss">
:slotted(.modal) {
	@apply w-[90vw] max-w-[1170px] rounded shadow-[0_0_40px] shadow-black/50;
}
</style>

<style scoped lang="scss">
.nested-fade-slide-down {
	&-enter-active,
	&-leave-active {
		transition: all 300ms ease-in-out;
	}

	&-enter-from,
	&-leave-to {
		opacity: 0;
	}

	&-enter-active > :slotted(div),
	&-leave-active > :slotted(div) {
		transition: all 300ms ease-in-out;
	}

	&-enter-from > :slotted(div),
	&-leave-to > :slotted(div) {
		transform: translateY(-15px);
		opacity: 0.001;
	}
}
</style>
