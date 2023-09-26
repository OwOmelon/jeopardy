<script setup lang="ts">
import { ref } from "vue";
import { useModalStore } from "@/stores/modals";
import { useGuestsStore } from "@/stores/guests";
import { useTemplateStore } from "@/stores/template";
import { vOnClickOutside } from "@vueuse/components";

import ModalWrapper from "../ModalWrapper.vue";
import TextBox from "./TextBox.vue";
import SaveChangesBtn from "./SaveChangesBtn.vue";
import PlayerLI from "./PlayerLI.vue";

const modal = useModalStore();
const guests = useGuestsStore();
const template = useTemplateStore();

const textBox = ref<HTMLInputElement | null>(null);
const textInput = ref<string>("");

function saveChanges(): void {
	if (guests.activePlayerID) {
		guests.editPlayerName(guests.activePlayerID, textInput.value);
		textBox.value?.blur();

		guests.activePlayerID = "";
	} else {
		if (textInput.value) {
			guests.addPlayer(textInput.value);
		}
	}

	textInput.value = "";
}

function changeEditMode(mode: boolean) {
	template.editing = mode
	modal.mainMenu = false
}
</script>

<template>
	<ModalWrapper :show="modal.mainMenu">
		<div
			class="component z-100 w-[260px] rounded bg-stone-300 p-5 shadow-[0_10px_40px] shadow-black/40"
			v-on-click-outside="
				() => {
					modal.mainMenu = false;
				}
			"
		>
			<h1 class="text-3xl font-bold">JEOPARDY</h1>

			<TextBox
				ref="textBox"
				v-model="textInput"
				@save-changes="saveChanges"
			/>

			<SaveChangesBtn
				:text-input-length="textInput.length"
				@save-changes="saveChanges"
			/>

			<h2 class="mt-3 text-xl font-semibold">guests:</h2>

			<Transition name="fade" leave-active-class="absolute duration-150">
				<p v-if="!guests.list.length" class="text-sm">
					nobody to play with :(
				</p>
			</Transition>

			<TransitionGroup tag="ul" name="list-slide-left" class="relative mb-3">
				<PlayerLI
					v-for="guest in guests.list"
					:key="guest.id"
					:guest="guest"
					@set-text-input-to-guest-name="textInput = guest.name"
					@reset-text-box="
						() => {
							textBox?.blur();
							textInput = '';
						}
					"
				/>
			</TransitionGroup>

			<button type="button" class="mode-btn" @click="changeEditMode(true)">
				edit
			</button>
			<button
				type="button"
				class="mode-btn ml-3"
				@click="changeEditMode(false)"
			>
				play
			</button>
		</div>
	</ModalWrapper>
</template>

<style scoped lang="postcss">
.mode-btn {
	@apply bg-red-400 hover:bg-red-300 shadow shadow-black/30 transition-colors text-white px-2 rounded text-xl;
}
</style>
