<script setup lang="ts">
import IconEditRounded from "~icons/material-symbols/edit-rounded";
import IconDeleteRounded from "~icons/material-symbols/delete-rounded";
import IconCancelRounded from "~icons/material-symbols/cancel-rounded";

import type { Guest } from "@/stores/guests";

const props = defineProps<
	{
		currentlyEditing: boolean | "active";
	} & Guest
>();

const emit = defineEmits<{
	rename: [];
	"rename-cancel": [];
	delete: [];
}>();
</script>

<template>
	<li
		:class="[
			`guest${
				currentlyEditing === 'active'
					? '-active shadow-subtle'
					: currentlyEditing
						? '-disabled'
						: ''
			}`,
			'group flex items-center justify-between rounded px-2 transition-colors',
		]"
	>
		<span>{{ name }}</span>

		<div class="flex items-center gap-2 transition-opacity">
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
				<IconCancelRounded v-if="currentlyEditing === 'active'" />
				<IconEditRounded v-else />
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
				<IconDeleteRounded />
			</button>
		</div>
	</li>
</template>

<style scoped lang="postcss">
.light .guest {
	@apply hover:bg-stone-50;
}

.light .guest-active {
	@apply bg-red-400 text-white;
}

.light .guest-disabled {
	@apply text-stone-500;
}

.light button {
	@apply outline-stone-500;
}

/* ----- */

.dark .guest {
	@apply hover:bg-stone-700;
}

.dark .guest-active {
	@apply bg-stone-300 text-stone-800;
}

.dark .guest-disabled {
	@apply text-stone-600;
}

.dark button {
	@apply outline-stone-300;
}

/* ----- */

button {
	@apply outline-offset-2 transition-[opacity,_transform] hover:scale-125  active:scale-100;
}

.guest-disabled button {
	@apply opacity-0;
}
</style>
