<script setup lang="ts">
import { ref, nextTick, onUnmounted } from "vue";
import { useMainMenuStore } from "@/stores/mainmenu";
import { useTemplateStore } from "@/stores/template";
import { useGameProgressStore } from "@/stores/game_progress";
import { useGuestsStore } from "@/stores/guests";
import { vOnClickOutside } from "@vueuse/components";

import type { Guest } from "@/stores/guests";

import TextBox from "./TextBox.vue";
import SaveChangesBtn from "./SaveChangesBtn.vue";
import GuestLI from "./GuestLI.vue";

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
				? 'dark bg-stone-600 text-stone-300'
				: 'light bg-stone-300',
			'z-100 w-[260px] rounded bg-stone-300 p-5 shadow-[0_10px_40px] shadow-black/40',
		]"
		v-on-click-outside="
			() => {
				mainmenu.show = false;
			}
		"
	>
		<h1 class="text-3xl font-bold">JEOPARDY</h1>

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

		<TransitionGroup tag="ul" name="list-slide-left" class="relative mb-3">
			<GuestLI
				v-for="guest in guests.list"
				v-bind="guest"
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

		<div class="flex items-center gap-3">
			<button
				v-if="!template.editing"
				type="button"
				:disabled="!Object.keys(gameProgress.progress).length"
				class="mode-btn"
				@click="
					() => {
						gameProgress.resetGameProgressWarning = true;
						mainmenu.show = false;
					}
				"
			>
				restart
			</button>

			<!-- --- -->

			<button
				type="button"
				@click="
					() => {
						template.editing = !template.editing;
						mainmenu.show = false;
					}
				"
			>
				{{ template.editing ? "play" : "edit" }}
			</button>
		</div>
	</div>
</template>

<style scoped lang="postcss">
button {
	@apply grow rounded px-2 text-lg shadow shadow-black/30 transition-colors;
}

.light button {
	@apply bg-red-400 text-white hover:bg-red-300;
}

.light button:disabled {
	@apply cursor-not-allowed bg-stone-400 text-stone-500;
}

.dark button {
	@apply bg-stone-300 text-stone-600 hover:bg-stone-400;
}

.dark button:disabled {
	@apply cursor-not-allowed bg-stone-700 text-stone-500;
}
</style>
