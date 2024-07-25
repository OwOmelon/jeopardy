<script setup lang="ts">
import IconArrowRight from "~icons/material-symbols/arrow-right-rounded";

const emit = defineEmits<{
	confirm: [];
}>();
</script>

<template>
	<button
		type="button"
		class="group m-1 flex items-center bg-red-400 text-white"
		@click="emit('confirm')"
	>
		confirm

		<IconArrowRight
			class="ml-3 scale-[3] transition-transform group-hover:translate-x-2"
		/>
	</button>
</template>
