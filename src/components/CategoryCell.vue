<script setup>
import { vOnClickOutside } from "@vueuse/components";
import { Icon } from "@iconify/vue";

const jeop = useJeopardyStore();
const props = defineProps({
	index: Number,
	category: Object,
});

const textbox = ref(null);

const isActive = computed(() => {
	return props.category.id === jeop.activeCategoryCell ? true : false;
});

function saveChanges() {
	jeop.columns[props.index].name = textbox.value.innerText;
	jeop.activeCategoryCell = null;
}

watch(
	() => isActive.value,
	(value) => {
		if (value) {
			textbox.value.focus();
		}
	}
);
</script>

<template>
	<div
		:class="[
			isActive ? 'scale-110 -translate-y-2' : 'cursor-pointer',
			'category-cell flex justify-center items-center relative bg-neutral-500 w-full rounded text-[#fff] text-center duration-150',
		]"
		@mouseenter="showHandle = true"
		@mouseleave="showHandle = false"
	>
		<p
			class="p-2 w-full outline-none"
			ref="textbox"
			contenteditable
			@focus="jeop.activeCategoryCell = category.id"
			@blur="saveChanges"
		>
			{{ category.name }}
		</p>
		<div
			class="handle absolute -top-2 -left-2 bg-neutral-300 hover:bg-neutral-200 p-1 rounded text-2xl opacity-0 cursor-move duration-150"
		>
			<Icon icon="charm:menu-hamburger" />
		</div>
	</div>
</template>

<style scoped>
.category-cell:hover .handle {
	opacity: 1;
}
</style>
