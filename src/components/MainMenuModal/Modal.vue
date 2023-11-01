<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { useMainMenuStore } from "@/stores/mainmenu";
import { useGuestsStore } from "@/stores/guests";
import { useTemplateStore } from "@/stores/template";
import { vOnClickOutside } from "@vueuse/components";

import type { Guest } from "@/stores/guests";

import TextBox from "./TextBox.vue";
import SaveChangesBtn from "./SaveChangesBtn.vue";
import GuestLI from "./GuestLI.vue";

const mainmenu = useMainMenuStore();
const guests = useGuestsStore();
const template = useTemplateStore();

const textBox = ref<InstanceType<typeof TextBox> | null>(null);
const textInput = ref<string>("");

function startGuestRename(guest: Guest) {
	guests.activeGuestID = guest.id;
	textInput.value = guest.name;

	// WAIT FOR TEXTBOX'S disabled ATTRIBUTE TO TURN TO false, THEN FOCUS,
	setTimeout(() => {
		textBox.value!.focus();
	});
}

function cancelGuestRename() {
	guests.activeGuestID = "";
	textInput.value = "";
	textBox.value!.blur();
}

function saveChanges(): void {
	if (guests.activeGuestID) {
		guests.editGuestName(guests.activeGuestID, textInput.value);
		textBox.value?.blur();

		guests.activeGuestID = "";
	} else {
		if (textInput.value) {
			guests.addGuest(textInput.value);
		}
	}

	textInput.value = "";
}

function onModeBtnClick(edit: boolean) {
	template.editing = edit;
	mainmenu.show = false;
}

onUnmounted(() => {
	guests.activeGuestID = "";
});
</script>

<template>
	<div
		:class="[
			template.editing ? 'bg-stone-600 text-stone-300' : 'bg-stone-300',
			'component z-100 w-[260px] rounded bg-stone-300 p-5 shadow-[0_10px_40px] shadow-black/40',
		]"
		v-on-click-outside="
			() => {
				mainmenu.show = false;
			}
		"
	>
		<h1 class="text-3xl font-bold">JEOPARDY</h1>

		<TextBox
			ref="textBox"
			v-model="textInput"
			:editing="template.editing"
			@save-changes="saveChanges"
		/>

		<SaveChangesBtn
			:editing="template.editing"
			:text-input-length="textInput.length"
			@save-changes="saveChanges"
		/>

		<h2 class="mt-3 text-xl font-semibold">guests:</h2>

		<Transition name="fade" leave-active-class="absolute duration-150">
			<p v-if="!guests.list.length" class="text-sm">nobody to play with :(</p>
		</Transition>

		<TransitionGroup tag="ul" name="list-slide-left" class="relative mb-3">
			<GuestLI
				v-for="guest in guests.list"
				v-bind="guest"
				:editing="template.editing"
				:currently-editing="
					guests.activeGuestID
						? guests.activeGuestID === guest.id
							? 'active'
							: true
						: false
				"
				:key="guest.id"
				@rename="startGuestRename(guest)"
				@rename-cancel="cancelGuestRename"
				@delete="guests.deleteGuest(guest.id)"
			/>
		</TransitionGroup>

		<button
			type="button"
			:class="[
				template.editing ? 'mode-btn-dark' : 'mode-btn-light',
				'mode-btn',
			]"
			@click="onModeBtnClick(true)"
		>
			edit
		</button>
		<button
			type="button"
			:class="[
				template.editing ? 'mode-btn-dark' : 'mode-btn-light',
				'mode-btn ml-3',
			]"
			@click="onModeBtnClick(false)"
		>
			play
		</button>
	</div>
</template>

<style scoped lang="postcss">
.mode-btn {
	@apply rounded px-2 text-xl shadow shadow-black/30 transition-colors;
}

.mode-btn-light {
	@apply bg-red-400 text-white hover:bg-red-300;
}

.mode-btn-dark {
	@apply bg-stone-300 text-stone-600 hover:bg-stone-400;
}
</style>
