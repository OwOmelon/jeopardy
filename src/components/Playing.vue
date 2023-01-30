<script setup>
const jeop = useJeopardyStore();

const showResetProgressBtn = computed(() => {
	let array = [];
	for (let i = 0; i < jeop.tracker.length; i++) {
		const row = jeop.tracker[i].every((state) => state === false);
		array.push(row);
	}

	return array.every((state) => state === true);
});

if (!jeop.tracker.length) {
	jeop.createTracker();
}
</script>

<template>
	<div v-if="!jeop.loading">
		<div
			class="grid gap-4"
			:style="{
				gridTemplateRows: `repeat(${jeop.rows.length + 1}, 70px)`,
				gridTemplateColumns: `repeat(${jeop.columns.length}, 150px)`,
			}"
		>
			<div
				v-for="(column, index) in jeop.columns"
				:key="index"
				class="grid place-items-center text-center bg-red-400 rounded text-[#fff] font-bold tracking-wider"
				style="grid-row-start: 1"
			>
				<p>{{ column.name }}</p>
			</div>
			<template v-for="(row, rowIndex) in jeop.table" :key="rowIndex">
				<div
					v-for="(column, columnIndex) in jeop.columns"
					:key="columnIndex"
					:class="[
						!jeop.tracker[rowIndex][columnIndex]
							? 'bg-neutral-300 hover:bg-red-400 hover:text-[#fff] hover:scale-110 hover:-translate-y-2'
							: 'bg-neutral-500 hover:bg-neutral-400 text-neutral-300',
						'grid place-items-center rounded cursor-pointer duration-150',
					]"
					:style="{ gridRowStart: rowIndex + 2 }"
					@click="
						(jeop.activeCell.row = rowIndex),
							(jeop.activeCell.column = column.id)
					"
				>
					<p>{{ jeop.rows[rowIndex] }}</p>
				</div>
			</template>
		</div>

		<div
			class="relative flex justify-center items-end gap-5 mt-10 font-bold text-center"
		>
			<template v-if="jeop.participants.length">
				<div
					v-for="(participant, index) in jeop.participants"
					:key="index"
					class="w-20"
				>
					<p>{{ participant.name }}</p>
					<input
						class="participant-points bg-neutral-300 w-full border-2 border-transparent focus:border-red-500 outline-none rounded text-center duration-150"
						type="number"
						v-model="participant.points"
					/>
				</div>
			</template>

			<p v-else>nobody to play with :(</p>

			<button
				:class="[
					showResetProgressBtn
						? 'bg-neutral-500 text-neutral-300 cursor-not-allowed'
						: 'bg-red-400 hover:bg-red-300 text-[#fff]',
					'absolute right-0 px-4 py-2 rounded duration-150',
				]"
				:disabled="showResetProgressBtn"
				@click="jeop.showRestartModal = true"
			>
				reset progress
			</button>
		</div>

		<Transition name="fade">
			<CellReveal
				v-if="
					jeop.activeCell.row !== null &&
					jeop.currentView === jeop.views[1]
				"
			/>
		</Transition>
	</div>
</template>

<style lang="scss" scoped>
.participant-points {
	-moz-appearance: textfield;

	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
}
</style>
