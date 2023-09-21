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
				class="component fixed left-0 top-0 z-50 grid h-screen w-screen place-items-center bg-black/50 backdrop-blur-sm"
			>
				<slot></slot>
			</div>
		</Transition>
	</Teleport>
</template>
