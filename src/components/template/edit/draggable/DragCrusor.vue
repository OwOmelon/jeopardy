<script setup lang="ts"></script>

<template>
	<div
		id="drag-cursor"
		style="pointer-events: none; position: fixed; left: 0; top: 0"
		class="scale-110"
	>
		<div class="-translate-x-1/2 -translate-y-1/2">
			<div
			class="cursor-ring rounded-full border-4 border-stone-400 w-14 aspect-square drop-shadow-[0_1px_2px_rgb(0_0_0)] transition-[width_border] duration-300"
		/>
		</div>
	</div>
</template>

<style lang="postcss">
.drag-cursor-dropzone-enter .cursor-ring {
	@apply w-24;
}
</style>
