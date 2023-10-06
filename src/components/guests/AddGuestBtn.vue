<script setup lang="ts">
import { useGuestsStore } from "@/stores/guests";
import { Icon } from "@iconify/vue";

const guests = useGuestsStore();

function addNewGuest(): void {
	guests.addGuest(`guest${guests.list.length}`);
}
</script>

<template>
	<button
		type="button"
		@click="addNewGuest"
		class="rounded bg-red-400 p-2 text-white"
	>
		<Icon icon="ion:plus-round" />
	</button>
</template>
