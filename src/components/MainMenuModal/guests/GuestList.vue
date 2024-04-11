<script setup lang="ts">
import type { Guest, ActiveGuestID } from "@/stores/guests";

import GuestEntry from "./Guest.vue";

const props = defineProps<{
	guestList: Guest[];
	activeGuestID: ActiveGuestID;
}>();

const emit = defineEmits<{
	"start-guest-rename": [Guest];
	"cancel-guest-rename": [];
	"delete-guest": [Guest["id"]];
}>();
</script>

<template>
	<TransitionGroup tag="ul" name="list-slide-left" class="relative mb-3">
		<GuestEntry
			v-for="guest in guestList"
			v-bind="guest"
			:currently-editing="
				activeGuestID ? (activeGuestID === guest.id ? 'active' : true) : false
			"
			:key="guest.id"
			@rename="emit('start-guest-rename', guest)"
			@rename-cancel="emit('cancel-guest-rename')"
			@delete="emit('delete-guest', guest.id)"
		/>
	</TransitionGroup>
</template>
