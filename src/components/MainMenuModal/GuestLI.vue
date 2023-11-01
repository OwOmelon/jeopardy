<script setup lang="ts">
import { Icon } from "@iconify/vue";

import type { Guest } from "@/stores/guests";

const props = defineProps<
	{
		currentlyEditing: boolean | "active";
	} & Guest
>();

const emit = defineEmits<{
	rename: [];
	'rename-cancel': [];
	delete: [];
}>();
</script>

<template>
	<li
		:class="[
			currentlyEditing === 'active'
				? 'bg-red-400 text-white'
				: currentlyEditing
				? 'bg-stone-400'
				: 'hover:bg-stone-200',
			'transition-colors group flex items-center justify-between rounded px-2',
		]"
	>
		<span>{{ name }}</span>

		<div
			:class="[
				currentlyEditing === 'active'
					? '!opacity-100'
					: currentlyEditing
					? '!opacity-0'
					: 'group-hover:opacity-100',
				'flex items-center gap-2 transition-opacity lg:opacity-0',
			]"
		>
			<button
				type="button"
				:disabled="currentlyEditing === true"
				@click="
					() => {
						if (props.currentlyEditing === 'active') {
							emit('rename-cancel');
						} else {
							emit('rename');
						}
					}
				"
			>
				<Icon
					:icon="
						currentlyEditing === 'active'
							? 'material-symbols:cancel-rounded'
							: 'material-symbols:edit-rounded'
					"
				/>
			</button>
			<button
				type="button"
				:disabled="currentlyEditing === true"
				@click="
					() => {
						emit('rename-cancel');
						emit('delete');
					}
				"
			>
				<Icon icon="material-symbols:delete-rounded" />
			</button>
		</div>
	</li>
</template>

<style scoped lang="postcss">
button {
	@apply transition-transform hover:scale-150 active:scale-100;
}
</style>
