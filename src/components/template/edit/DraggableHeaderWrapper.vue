<script setup lang="ts">
import { ref, onMounted } from "vue";
import { arrSwap } from "@/composables/array_swap";

const emit = defineEmits<{
	'dragstart': []; 
	'dragend': []; 
}>()

const props = defineProps<{
	tag: string;
	group: string;
	handle: string;
	transitionName: string;
}>();

const obj = defineModel<Record<string, string | number>>({ required: true });
const wrapper = ref<any>(null);

const dragFrom = ref<number | null>(null);
const dropTo = ref<number | null>(null);

function onDragStart(attr: string) {
	const index = findIndex(attr);

	dragFrom.value = index;
	emit('dragstart');
}

function onDragEnter(attr: string) {
	const index = findIndex(attr);

	dropTo.value = index;
}

function onDrop() {
	if (dragFrom.value === null || dropTo.value === null) return;

	const swappedModelValueEntries = arrSwap(
		Object.entries(obj.value),
		dragFrom.value,
		dropTo.value,
	);

	const swappedModelValue = swappedModelValueEntries.reduce(
		(entries, [key, value]) => {
			return {
				...entries,
				[key]: value,
			};
		},
		{},
	) as typeof obj.value;

	obj.value = swappedModelValue;
}

function onDragEnd(el: Element) {
	el.removeAttribute("draggable");

	dragFrom.value = null;
	dropTo.value = null;
	
	emit('dragend');
}

// --------------------

function onHandleMouseDown(parent: Element) {
	parent.setAttribute("draggable", "true");
}

// --------------------

function findIndex(attr: string): number | null {
	const children = getChildren();

	return children !== null
		? children.findIndex((child) => child.hasAttribute(attr))
		: null;
}

function getChildren(): Element[] | null {
	const el = getWrapperEl();

	return el !== null ? Array.from(el.children) : null;
}

function getWrapperEl(): Element | null {
	return wrapper.value?.$el ?? null;
}

onMounted(() => {
	const el = getWrapperEl()!;

	el.addEventListener("drop", () => onDrop());
	el.addEventListener("dragover", (e) => {
		e.preventDefault();
	});

	Array.from(el.children).forEach((child, index) => {
		const attr = `drag-${props.group}-${index}`;
		const handle = child.getElementsByClassName(props.handle)[0];

		handle.addEventListener("mousedown", () => onHandleMouseDown(child));

		child.setAttribute(attr, "");

		child.addEventListener("dragstart", () => onDragStart(attr));
		child.addEventListener("dragenter", () => onDragEnter(attr));
		child.addEventListener("dragend", () => onDragEnd(child));
	});
});
</script>

<template>
	<TransitionGroup ref="wrapper" :tag="tag" :name="transitionName">
		<template v-for="(value, key, index) in modelValue" :key="key">
			<slot
				:value="value"
				:property="key"
				:dragging="index === dragFrom"
				:dropTo="index === dropTo"
			/>
		</template>
	</TransitionGroup>
</template>
