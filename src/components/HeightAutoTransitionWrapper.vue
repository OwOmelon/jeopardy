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
