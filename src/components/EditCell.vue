<script setup>
import { vOnClickOutside } from "@vueuse/components";

const jeop = useJeopardyStore();

const editor = ref(null);
const showSaveChangesWarning = ref(false);

const cellToEdit = computed(() => {
	return jeop.table[jeop.activeCell.row][jeop.activeCell.column];
});

const newQuestion = ref(cellToEdit.value.question);
const newAnswer = ref(cellToEdit.value.answer);

const showSaveChanges = computed(() => {
	return newQuestion.value.toLowerCase().trim() ===
		cellToEdit.value.question.toLowerCase().trim() &&
		newAnswer.value.toLowerCase().trim() ===
			cellToEdit.value.answer.toLowerCase().trim()
		? false
		: true;
});

function confirm() {
	if (jeop.gameOngoing) {
		showSaveChangesWarning.value = true;
	} else {
		saveChanges();
	}
}

function saveChanges() {
	if (showSaveChanges.value) {
		cellToEdit.value.question = newQuestion.value;
		cellToEdit.value.answer = newAnswer.value;

		newQuestion.value = "";
		newAnswer.value = "";

		jeop.resetActiveCell();

		if (jeop.gameOngoing) {
			jeop.resetProgress();
		}
	}
}

function windowKeyDown(e) {
	e.key === "Escape"
		? jeop.resetActiveCell()
		: e.key === "Enter"
		? confirm()
		: "";
}

window.addEventListener("keydown", windowKeyDown);

onBeforeUnmount(() => {
	window.removeEventListener("keydown", windowKeyDown);
});
</script>

<template>
	<div
		class="grid place-items-center fixed top-0 left-0 w-screen h-screen bg-[#000]/50 backdrop-blur-sm"
	>
		<div
			class="rounded-md overflow-hidden shadow-[0_10px_40px] shadow-[#000]/40"
		>
			<div
				class="flex justify-between bg-neutral-500 p-2 border-b-2 border-neutral-600 text-[#fff] font-semibold"
			>
				<p>
					Editing Cell of Column {{ jeop.activeCell.column + 1 }} Row
					{{ jeop.activeCell.row + 1 }}
				</p>
				<div>
					<Transition name="fade">
						<button
							class="mr-5 hover:text-green-500 duration-150"
							v-if="showSaveChanges"
							@click="confirm"
						>
							Save Changes [Enter]
						</button>
					</Transition>

					<button
						class="hover:text-red-500 duration-150"
						@click="jeop.resetActiveCell"
					>
						Close [ESC]
					</button>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-5 bg-neutral-300 w-[800px] p-5">
				<div>
					<label>Question</label>
					<textarea
						class="bg-[#fff] w-full h-[150px] resize-none p-3 mt-3 outline-none rounded shadow"
						type="text"
						v-model="newQuestion"
						placeholder="Type Something..."
					/>
				</div>
				<div>
					<label>Answer</label>
					<textarea
						class="bg-[#fff] w-full h-[150px] resize-none p-3 mt-3 outline-none rounded shadow"
						type="text"
						v-model="newAnswer"
						placeholder="Type Something..."
					/>
				</div>
			</div>
		</div>

		<Transition name="fade">
			<div
				v-if="showSaveChangesWarning"
				class="fixed top-0 left-0 grid place-items-center w-screen h-screen backdrop-blur-sm"
			>
				<div
					class="bg-red-400 max-w-[50%] p-5 rounded text-[#fff] shadow-[0_10px_40px] shadow-[#000]/40"
				>
					<h1 class="mb-3 text-3xl font-bold">!GAME ONGOING</h1>
					<p>
						Committing any changes in your jeopardy template will reset
						your game progress. This action cannot be undone. Do you wish
						to continue?
					</p>
					<div class="mt-3">
						<button
							class="bg-[#fff] hover:bg-red-300 p-3 rounded text-red-400 hover:text-[#fff] duration-150"
							@click="jeop.resetActiveCell"
						>
							cancel
						</button>
						<button
							class="bg-[#fff] hover:bg-red-300 p-3 ml-5 rounded text-red-400 hover:text-[#fff] duration-150"
							@click="saveChanges"
						>
							save changes
						</button>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
