<script setup lang="ts">
import { ref } from "vue";
import { useModalStore } from "../../stores/modals";
import { usePlayersStore } from "../../stores/players";

import TextBox from "./TextBox.vue";
import SaveChangesBtn from "./SaveChangesBtn.vue";
import PlayerLI from "./PlayerLI.vue";

const modal = useModalStore();
const players = usePlayersStore();

const textBox = ref<HTMLInputElement | null>(null);
const textInput = ref<string>("");

function saveChanges(): void {
	if (players.activePlayerID) {
		players.editPlayerName(players.activePlayerID, textInput.value);
		textBox.value?.blur();

		players.activePlayerID = "";
	} else {
		if (textInput.value) {
			players.addPlayer(textInput.value);
		}
	}

	textInput.value = "";
}
</script>

<template>
	<Teleport to="#modal">
		<div
			v-if="modal.mainMenu"
			class="fixed left-0 top-0 grid h-screen w-screen place-items-center bg-black/50 backdrop-blur-sm"
		>
			<div
				class="component z-100 w-[260px] rounded bg-neutral-300 p-5 shadow-[0_10px_40px] shadow-black/40"
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

				<h2 class="mt-3 text-xl font-semibold">PLAYERS:</h2>

				<Transition name="fade" leave-active-class="absolute duration-150">
					<p v-if="!players.players.length" class="text-sm">
						nobody to play with :(
					</p>
				</Transition>

				<TransitionGroup tag="ul" name="list-slide-left" class="relative">
					<PlayerLI
						v-for="player in players.players"
						:key="player.id"
						:player="player"
						@set-text-input-to-player-name="textInput = player.name"
						@reset-text-box="
							() => {
								textBox?.blur();
								textInput = '';
							}
						"
					/>
				</TransitionGroup>
			</div>
		</div>
	</Teleport>
</template>
