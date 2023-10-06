<script setup lang="ts">
import { useGuestsStore } from "@/stores/guests";
import { useTemplateStore } from "@/stores/template";

import Guest from "./Guest.vue";

const guests = useGuestsStore();
const template = useTemplateStore();
</script>

<template>
	<div v-if="!template.editing" class="mt-10 flex items-center gap-3">
		<ul class="flex gap-3">
			<Guest
				v-for="guest in guests.list"
				:id="guest.id"
				:name="guest.name"
				:points="guest.points"
				@edit-points="guests.editGuestPoints"
			/>
		</ul>
	</div>
</template>
