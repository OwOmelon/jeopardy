<script setup>
const jeop = useJeopardyStore();
const props = defineProps({
	columnId: String,
	rowIndex: Number,
	data: Object,
	points: Number,
});

const question = ref("");
const answer = ref("");

const isHovered = ref(false);

const cellText = computed(() => {
	const question = props.data.question ? props.data.question : props.points;
	const answer =
		props.data.question && props.data.answer
			? props.data.answer
			: props.data.question && !props.data.answer
			? "Add Answer"
			: "Add Question";

	return isHovered.value ? answer : question;
});

function setActiveCell() {
	jeop.activeCell.row = props.rowIndex;
	jeop.activeCell.column = props.columnId;
}
</script>

<template>
	<div
		class="grid place-items-center relative bg-neutral-300 w-[16vw] h-[12vh] text-xs rounded-md text-center cursor-pointer hover:scale-110 hover:-translate-y-2 duration-150"
		@mouseenter="isHovered = true"
		@mouseleave="isHovered = false"
		@click="setActiveCell"
	>
		<Transition name="fade" leave-active-class="absolute duration-150">
			<p class="p-2" :key="cellText">{{ cellText }}</p>
		</Transition>
	</div>
</template>
