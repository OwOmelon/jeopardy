<script setup lang="ts">
import { ref, nextTick, onUnmounted } from "vue";
import { useMainMenuStore } from "@/stores/mainmenu";
import { useTemplateStore } from "@/stores/template";
import { useGameProgressStore } from "@/stores/game_progress";
import { useGuestsStore } from "@/stores/guests";
import { vOnClickOutside } from "@vueuse/components";

import type { Guest } from "@/stores/guests";

import IconPlay from "~icons/material-symbols/play-arrow-rounded";
import IconRestart from "~icons/ph/arrow-counter-clockwise-bold";
import TextBox from "./TextBox.vue";
import SaveChangesBtn from "./SaveChangesBtn.vue";
import GuestList from "./guests/GuestList.vue";

const mainmenu = useMainMenuStore();
const template = useTemplateStore();
const gameProgress = useGameProgressStore();
const guests = useGuestsStore();

const textBox = ref<InstanceType<typeof TextBox> | null>(null);
const textInput = ref<string>("");

async function startGuestRename(guest: Guest): Promise<void> {
	guests.activeGuestID = guest.id;
	textInput.value = guest.name;

	await nextTick();

	textBox.value!.focus();
}

function cancelGuestRename() {
	textInput.value = "";
	textBox.value!.blur();

	guests.resetActiveGuestID();
}

function saveChanges(): void {
	if (guests.activeGuestID) {
		guests.editGuestName(guests.activeGuestID, textInput.value);
		textBox.value?.blur();

		guests.resetActiveGuestID();
	} else {
		if (textInput.value) {
			guests.addGuest(textInput.value);
		}
	}

	textInput.value = "";
}

onUnmounted(() => {
	saveChanges();
	guests.resetActiveGuestID();
});
</script>

<template>
	<div
		:class="[
			template.editing
				? 'dark bg-stone-800 text-stone-300'
				: 'light bg-stone-200 text-stone-600',
			'z-100 w-[260px] rounded p-5 shadow-[0_10px_40px] shadow-black/40',
		]"
		v-on-click-outside="
			() => {
				mainmenu.show = false;
			}
		"
	>
		<h5 class="font-bold">JEOPARDY</h5>

		<TextBox ref="textBox" v-model="textInput" @save-changes="saveChanges" />

		<SaveChangesBtn
			:text-input-length="textInput.length"
			@save-changes="saveChanges"
		/>

		<h2 class="mt-3 text-xl font-semibold">
			guests: {{ guests.list.length }}/6
		</h2>

		<Transition name="fade" leave-active-class="absolute duration-150">
			<p v-if="!guests.list.length" class="text-sm">nobody to play with :(</p>
		</Transition>

		<GuestList
			:guest-list="guests.list"
			:active-guest-i-d="guests.activeGuestID"
			@start-guest-rename="startGuestRename"
			@cancel-guest-rename="cancelGuestRename"
			@delete-guest="guests.deleteGuest($event)"
		/>

		<div class="buttons flex items-center gap-3">
			<button
				v-if="!template.editing"
				type="button"
				:disabled="!Object.keys(gameProgress.progress).length"
				class="mode-btn bg-stone-50 disabled:cursor-not-allowed disabled:bg-stone-400 disabled:text-stone-500 disabled:hover:!-translate-y-0"
				@click="
					() => {
						gameProgress.resetGameProgressWarning = true;
						mainmenu.show = false;
					}
				"
			>
				restart
				<IconRestart />
			</button>

			<!-- --- -->

			<button
				type="button"
				class="bg-red-400 text-white"
				@click="
					() => {
						template.editing = !template.editing;
						mainmenu.show = false;
					}
				"
			>
				{{ template.editing ? "play" : "edit" }}
				<IconPlay class="scale-150" />
			</button>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.buttons button {
	@apply shadow-subtle flex grow items-center justify-center gap-3 rounded px-3 py-1 font-bold transition-transform hover:-translate-y-1;
}
</style>
