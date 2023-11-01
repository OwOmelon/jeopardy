<script setup lang="ts">
const emit = defineEmits<{
	confirm: [];
	cancel: [];
}>();
</script>

<template>
	<div class="component w-[500px] rounded bg-red-400 p-5 text-white">
		<h1 class="text-3xl font-bold">!! TEMPLATE RESET</h1>

		<p class="my-3">
			Are you sure you want to reset your template ?
			<br />
			You can always undo this by loading a previously saved template on the
			<span class="font-bold">template history</span> located on the top left
		</p>

		<button type="button" @click="emit('cancel')">CANCEL</button>
		<button type="button" class="ml-3" @click="emit('confirm')">CONFIRM</button>
	</div>
</template>

<style scoped lang="postcss">
button {
	@apply rounded bg-white p-2 text-xl font-bold text-red-400 transition-transform hover:-translate-y-1;
}
</style>
