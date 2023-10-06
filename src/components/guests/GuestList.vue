<script setup lang="ts">
import { useGuestsStore } from "@/stores/guests";
import { useTemplateStore } from "@/stores/template";
import { Icon } from "@iconify/vue";

import AddGuestBtn from "./AddGuestBtn.vue";
import Guest from "./Guest.vue";

const guests = useGuestsStore();
const template = useTemplateStore();
</script>

<template>
	<div v-if="!template.editing" class="mt-10 flex items-center gap-3">
		<ul class="flex gap-3">
			<span v-if="!guests.list.length">no guests :&lt;</span>

			<template v-else>
				<Guest
					v-for="guest in guests.list"
					:id="guest.id"
					:name="guest.name"
					:points="guest.points"
					@delete-guest="guests.deleteGuest"
					@update-points="guests.updatePoints"
				/>
			</template>
		</ul>

		<AddGuestBtn />
	</div>
</template>
