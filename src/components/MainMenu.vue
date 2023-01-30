<script setup>
import { Icon } from "@iconify/vue";

const jeop = useJeopardyStore();

const input = ref(null);

const newParticipant = ref("");
const editParticipantName = ref(null);

function addParticipant() {
	if (newParticipant.value) {
		if (editParticipantName.value !== null) {
			jeop.participants[editParticipantName.value].name =
				newParticipant.value;
			editParticipantName.value = null;
		} else {
			jeop.participants.push({ name: newParticipant.value, points: 0 });
		}
		newParticipant.value = "";
	}
}

function test() {
	jeop.columns.forEach((column) => {
		column.name = column.id;
	});
}
</script>

<template>
	<div
		class="fixed top-0 left-0 grid place-items-center bg-[#000]/30 w-screen h-screen backdrop-blur-sm"
	>
		<div
			class="bg-neutral-300 w-[260px] p-5 rounded shadow-[0_10px_40px] shadow-[#000]/40"
		>
			<h1 class="text-3xl font-bold">JEOPARDY</h1>

			<div class="mt-3">
				<input
					class="on-focus bg-[#fff] px-2 rounded duration-150"
					ref="input"
					type="text"
					v-model="newParticipant"
					:placeholder="
						editParticipantName !== null
							? `old: ${jeop.participants[editParticipantName].name} | new: `
							: 'participant name'
					"
					maxlength="12"
					@keydown.enter="addParticipant"
				/>
				<button
					:class="[
						newParticipant
							? 'bg-red-400 hover:bg-red-300 text-[#fff]'
							: 'bg-neutral-400 cursor-not-allowed',
						'on-focus flex justify-around items-center gap-2 px-2 mt-2 rounded text-xl duration-150',
					]"
					:disabled="!newParticipant"
					@click="addParticipant"
				>
					<p v-text="editParticipantName !== null ? 'change' : 'add'" />
					<Icon
						:icon="
							editParticipantName !== null
								? 'ion:checkmark-round'
								: 'ion:plus-round'
						"
					/>
				</button>
			</div>

			<h2 class="mt-3 text-xl font-semibold">PARTICIPANTS:</h2>

			<Transition name="fade" leave-active-class="absolute duration-150">
				<p class="text-sm" v-if="!jeop.participants.length">
					nobody to play with :(
				</p>
			</Transition>
			<TransitionGroup class="relative" name="slide-left" tag="ul">
				<div
					:class="[
						editParticipantName !== null
							? editParticipantName === index
								? 'hover-show-btn bg-red-400 text-[#fff]'
								: 'bg-neutral-400'
							: 'hover-show-btn hover:bg-neutral-200',
						'flex justify-between items-center w-full px-2 rounded duration-150',
					]"
					v-for="(participant, index) in jeop.participants"
					:key="participant"
				>
					<p>
						{{ participant.name }}
					</p>
					<div
						:class="[
							editParticipantName !== null &&
							editParticipantName === index
								? 'opacity-1 text-[#fff]'
								: 'opacity-0 pointer-events-none',
							'btns flex gap-2 items-center text-red-400/ duration-150',
						]"
					>
						<Icon
							class="hover:scale-150 duration-150"
							:icon="
								editParticipantName !== null
									? 'material-symbols:cancel-rounded'
									: 'material-symbols:edit-rounded'
							"
							@click="
								editParticipantName !== null
									? (editParticipantName = null)
									: ((editParticipantName = index), input.focus())
							"
						/>
						<Icon
							class="hover:scale-150 duration-150"
							icon="material-symbols:delete-rounded"
							@click="
								jeop.participants.splice(index, 1),
									(editParticipantName = null)
							"
						/>
					</div>
				</div>
			</TransitionGroup>

			<div class="flex gap-5 mt-3">
				<button
					class="on-focus btn"
					@click="
						(jeop.currentView = jeop.views[0]), (jeop.showMenu = false)
					"
				>
					edit
				</button>

				<!-- <button class="on-focus btn" @click="test">edit</button> -->
				<button
					class="on-focus btn"
					v-text="jeop.currentView === jeop.views[1] ? 'resume' : 'start'"
					@click="
						(jeop.currentView = jeop.views[1]), (jeop.showMenu = false)
					"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.btn {
	background-color: #f87171;
	padding: 0 0.5rem;
	border-radius: 0.25rem;

	color: #fff;
	font-size: 1.25rem;
	line-height: 1.75rem;

	transition: 150ms;

	&:hover {
		background-color: #fca5a5;
	}
}

.hover-show-btn:hover {
	.btns {
		opacity: 1;

		cursor: pointer;
		pointer-events: auto;
	}
}
</style>
