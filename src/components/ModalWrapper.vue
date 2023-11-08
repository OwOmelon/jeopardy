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
				class="component fixed left-0 top-0 z-50 grid flex-col h-screen w-screen place-items-center bg-black/50 backdrop-blur-sm p-5 overflow-auto"
			>
				<slot></slot>
			</div>
		</Transition>
	</Teleport>
</template>
