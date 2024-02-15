<script setup lang="ts">
import { ref, onMounted } from "vue";
import { arrSwap } from "@/composables/array_swap";

type Attr = `drag-${typeof props.group}-${number}`;

const emit = defineEmits<{
	dragstart: [];
	dragend: [];
}>();

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

function onDragStart(attr: Attr): void {
	const index = findIndex(attr);

	dragFrom.value = index;

	emit("dragstart");
}

function onDragEnter(e: MouseEvent): void {
	if (dragFrom.value === null) return;

	const attr = getDragAttribute(e.target as HTMLElement);

	if (attr === null) return;

	const index = findIndex(attr);

	if (index === dragFrom.value) return;

	dropTo.value = index;
	document.body.style.cursor = "cell";
}

function onDragLeave(): void {
	if (dragFrom.value === null || dropTo.value === null) return;

	dropTo.value = null;
	document.body.style.cursor = "no-drop";
}

function onDragEnd(): void {
	if (dragFrom.value !== null && dropTo.value !== null) {
		const swappedModelValueEntries = arrSwap(
			Object.entries(obj.value),
			dragFrom.value,
			dropTo.value,
		);

		const swappedModelValue = Object.fromEntries(
			swappedModelValueEntries,
		) as typeof obj.value;

		obj.value = swappedModelValue;
	}

	dragFrom.value = null;
	dropTo.value = null;

	emit("dragend");
}

// --------------------

function startDragOperations(e: MouseEvent, attr: Attr): void {
	e.preventDefault();

	onDragStart(attr);

	getChildren()!.forEach((child) => {
		child.addEventListener("mouseenter", onDragEnter);
		child.addEventListener("mouseleave", onDragLeave);
	});

	document.body.style.cursor = "no-drop";
	window.addEventListener("mouseup", stopDragOperations);
}

function stopDragOperations(): void {
	onDragEnd();

	getChildren()!.forEach((child) => {
		child.removeEventListener("mouseenter", onDragEnter);
		child.removeEventListener("mouseleave", onDragLeave);
	});

	document.body.style.cursor = "";
	window.removeEventListener("mouseup", stopDragOperations);
}

// --------------------

function findIndex(attr: Attr): number | null {
	const children = getChildren();

	return children !== null
		? children.findIndex((child) => child.getAttribute("drag-item") === attr)
		: null;
}

function getDragAttribute(el: HTMLElement): Attr | null {
	return (el.getAttribute("drag-item") as Attr) ?? null;
}

function getChildren(): HTMLElement[] | null {
	const wrapperEl = getWrapperEl();

	return wrapperEl !== null
		? (Array.from(wrapperEl.children) as HTMLElement[])
		: null;
}

function getWrapperEl(): HTMLElement | null {
	return wrapper.value?.$el ?? null;
}

onMounted(() => {
	setTimeout(() => {
		getChildren()!.forEach((child, index) => {
			const attr: Attr = `drag-${props.group}-${index}`;
			const handle = child.getElementsByClassName(
				props.handle,
			)[0] as HTMLElement;

			handle.addEventListener("mousedown", (e) => startDragOperations(e, attr));
			child.setAttribute("drag-item", attr);
		});
	}, 100);
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
