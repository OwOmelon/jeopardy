<script setup lang="ts">
import { useGuestsStore } from "@/stores/guests";

import Guest from "./Guest.vue";

const guests = useGuestsStore();
</script>

<template>
	<ul class="flex flex-wrap justify-center gap-3 pb-1">
		<Guest
			v-for="guest in guests.list"
			:id="guest.id"
			:name="guest.name"
			:points="guest.points"
			@edit-points="guests.editGuestPoints(guest.id, $event, 'illegitimate')"
		/>
	</ul>
</template>
