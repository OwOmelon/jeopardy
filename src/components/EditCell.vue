<script setup>
import { vOnClickOutside } from "@vueuse/components";
import { useTextareaAutosize } from "@vueuse/core";

const jeop = useJeopardyStore();

const { textarea, input } = useTextareaAutosize();
const editor = ref(null);

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

function saveChanges() {
	if (showSaveChanges.value) {
		cellToEdit.value.question = newQuestion.value;
		cellToEdit.value.answer = newAnswer.value;

		newQuestion.value = "";
		newAnswer.value = "";

		jeop.resetActiveCell();
	} else {
		console.log("bruh");
	}
}

function windowKeyDown(e) {
	e.key === "Escape"
		? jeop.resetActiveCell()
		: e.key === "Enter"
		? saveChanges()
		: "";
	console.log(e.key);
}

window.addEventListener("keydown", windowKeyDown);

onBeforeUnmount(() => {
	window.removeEventListener("keydown", windowKeyDown);
});
</script>

<template>
	<div
		class="grid place-items-center fixed top-0 left-0 w-screen h-screen bg-[#000]/50"
	>
		<div
			class="rounded-md overflow-hidden"
			v-on-click-outside="jeop.resetActiveCell"
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
							@click="saveChanges"
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
	</div>
</template>
