<script setup lang="ts">
const props = defineProps<{
	rotate?: boolean;
}>();
</script>

<template>
	<div
		:class="[
			{ 'flex-col': props.rotate },
			'handle absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 cursor-grab rounded bg-neutral-300 p-2 lg:opacity-0 shadow shadow-black/30 transition-opacity group-hover:opacity-100',
		]"
		@click.stop
	>
		<svg
			:class="[{'rotate-90': props.rotate}]"
			xmlns="http://www.w3.org/2000/svg"
			width="12"
			height="12"
			viewBox="0 0 32 32"
			class="fill-neutral-600"
		>
			<path
				d="M18.4334 1.32126L7.26146 12.8636C6.86158 13.2759 6.54433 13.7657 6.32788 14.3048C6.11142 14.8439 6 15.4218 6 16.0055C6 16.5892 6.11142 17.1671 6.32788 17.7062C6.54433 18.2453 6.86158 18.7351 7.26146 19.1473L18.4334 30.6897C21.1509 33.4973 25.8095 31.4919 25.8095 27.5256V4.44082C25.8095 0.474517 21.1509 -1.48635 18.4334 1.32126Z"
			/>
		</svg>

		<svg
			:class="[{'-rotate-90': props.rotate}]"
			xmlns="http://www.w3.org/2000/svg"
			width="12"
			height="12"
			viewBox="0 0 32 32"
			class="rotate-180 fill-neutral-600"
		>
			<path
				d="M18.4334 1.32126L7.26146 12.8636C6.86158 13.2759 6.54433 13.7657 6.32788 14.3048C6.11142 14.8439 6 15.4218 6 16.0055C6 16.5892 6.11142 17.1671 6.32788 17.7062C6.54433 18.2453 6.86158 18.7351 7.26146 19.1473L18.4334 30.6897C21.1509 33.4973 25.8095 31.4919 25.8095 27.5256V4.44082C25.8095 0.474517 21.1509 -1.48635 18.4334 1.32126Z"
			/>
		</svg>
	</div>
</template>
