<script setup lang="ts">
import { useGuestsStore } from "@/stores/guests";
import { useTemplateStore } from "@/stores/template";

import Guest from "./Guest.vue";

const guests = useGuestsStore();
const template = useTemplateStore();
</script>

<template>
	<div v-if="!template.editing && guests.list.length" class="overflow-hidden">
		<ul class="flex flex-wrap justify-center gap-3">
			<Guest
				v-for="guest in guests.list"
				:id="guest.id"
				:name="guest.name"
				:points="guest.points"
				@edit-points="guests.editGuestPoints(guest.id, $event, 'illegitimate')"
			/>
		</ul>
	</div>
</template>
