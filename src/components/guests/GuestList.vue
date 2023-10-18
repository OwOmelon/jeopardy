<script setup lang="ts">
import { useGuestsStore } from "@/stores/guests";
import { useTemplateStore } from "@/stores/template";

import Guest from "./Guest.vue";

const guests = useGuestsStore();
const template = useTemplateStore();
</script>

<template>
	<div v-if="!template.editing" class="mb-10 p-5 pt-0">
		<ul class="flex justify-center flex-wrap gap-3">
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
