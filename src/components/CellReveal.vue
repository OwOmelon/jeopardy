<script setup>
import { Icon } from "@iconify/vue";

const emit = defineEmits(["set-cell-answered"]);
const jeop = useJeopardyStore();

const step = ref(1);
const isAnswered = computed(() => {
	return jeop.tracker[jeop.activeCell.row][
		jeop.columns.findIndex((column) => column.id === jeop.activeCell.column)
	];
});

const cellToReveal = computed(() => {
	return jeop.table[jeop.activeCell.row][jeop.activeCell.column];
	return jeop.table[jeop.activeCell.row];
});

function setTrackerAnswered(name) {
	jeop.tracker[jeop.activeCell.row][
		jeop.columns.findIndex((column) => column.id === jeop.activeCell.column)
	] = name;

	console.log(jeop.tracker);
}

function toggleReveal(e) {
	switch (e.code) {
		case "Space":
			if (step.value < 3) {
				if (step.value === 2 && !jeop.participants.length) {
					setTrackerAnswered("no one");
					jeop.resetActiveCell();
				} else if (!isAnswered.value) {
					step.value++;
				}
			}

			break;

		case "Escape":
			switch (step.value) {
				case 1:
					jeop.resetActiveCell();
					break;

				case 2:
					if (isAnswered.value) {
						jeop.resetActiveCell();
					}
					break;

				case 3:
					step.value--;
			}

			break;
	}
}

if (isAnswered.value) {
	step.value = 2;
}

window.addEventListener("keydown", toggleReveal);

onBeforeUnmount(() => {
	window.removeEventListener("keydown", toggleReveal);
});
</script>

<template>
	<div
		class="fixed top-0 left-0 grid place-items-center bg-[#000]/30 w-screen h-screen backdrop-blur-sm"
	>
		<div
			class="rounded-lg drop-shadow-2xl font-bold tracking-wider overflow-hidden"
		>
			<div
				class="flex items-center bg-red-400 p-3 border-b-4 border-red-300 text-[#fff] text-center"
			>
				<p class="w-full text-xs text-left">
					back
					<span
						:class="[
							step === 2
								? isAnswered
									? 'bg-red-300'
									: 'bg-neutral-500 text-neutral-300'
								: 'bg-red-300',
							'p-2 rounded duration-150',
						]"
						>ESC</span
					>
				</p>
				<p class="w-full text-sm">
					{{
						jeop.columns[
							jeop.columns.findIndex(
								(column) => column.id === jeop.activeCell.column
							)
						].name.toUpperCase()
					}}
					for
					{{ jeop.rows[jeop.activeCell.row] }}
				</p>
				<p class="w-full text-xs text-right">
					continue
					<span
						:class="[
							step === 3 || isAnswered
								? 'bg-neutral-500 text-neutral-300'
								: 'bg-red-300',
							'p-2 rounded duration-150',
						]"
						>SPACE</span
					>
				</p>
			</div>

			<div
				class="flex flex-col gap-10 justify-center items-center bg-neutral-100 w-[800px] min-h-[350px] p-5 text-red-400 text-3xl text-center"
			>
				<Transition name="fade" mode="out-in">
					<div v-if="step < 3">
						<p>{{ cellToReveal.question }}</p>
						<hr class="h-1 bg-red-400 w-[80%] mx-auto my-5" />
						<p
							:class="[
								step > 1 ? 'scale-100' : 'scale-0',
								'duration-1000',
							]"
						>
							{{ cellToReveal.answer }}
						</p>
					</div>

					<div v-else>
						<p
							v-text="
								jeop.participants.length > 1
									? 'who got the question right?'
									: `did ${jeop.participants[0].name} get it right?`
							"
						/>
						<ul
							v-if="jeop.participants.length > 1"
							class="flex justify-center flex-wrap gap-5 mt-5"
						>
							<button
								v-for="participant in jeop.participants"
								:key="participant"
								class="bg-neutral-200 hover:bg-red-400 p-3 rounded text-neutral-400 hover:text-[#fff] duration-150"
								@click="
									(participant.points =
										participant.points +
										jeop.rows[jeop.activeCell.row]),
										setTrackerAnswered(participant.name),
										jeop.resetActiveCell()
								"
							>
								{{ participant.name }}
							</button>
						</ul>
						<div class="flex justify-center gap-5 mt-5">
							<button
								v-if="jeop.participants.length < 2"
								class="flex items-center gap-3 bg-neutral-200 hover:bg-red-400 p-3 rounded text-neutral-400 hover:text-[#fff] duration-150"
								@click="
									(jeop.participants[0].points =
										jeop.participants[0].points +
										jeop.rows[jeop.activeCell.row]),
										setTrackerAnswered(),
										jeop.resetActiveCell()
								"
							>
								<p>yes</p>
							</button>
							<button
								class="flex items-center gap-3 bg-neutral-200 hover:bg-red-400 p-3 rounded text-neutral-400 hover:text-[#fff] duration-150"
								@click="
									setTrackerAnswered('no one'), jeop.resetActiveCell()
								"
							>
								<p
									v-text="
										jeop.participants.length > 1 ? 'no one' : 'no'
									"
								/>
								<Icon icon="fa-solid:skull" />
							</button>
						</div>
					</div>
				</Transition>

				<p
					v-if="
						jeop.tracker[jeop.activeCell.row][
							jeop.columns.findIndex(
								(column) => column.id === jeop.activeCell.column
							)
						]
					"
				>
					answered by:
					{{
						jeop.tracker[jeop.activeCell.row][
							jeop.columns.findIndex(
								(column) => column.id === jeop.activeCell.column
							)
						]
					}}
				</p>
			</div>
		</div>
	</div>
</template>
