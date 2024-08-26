<script setup lang="ts">
import { type ComponentPublicInstance, ref, watch, onMounted } from "vue";
import { arrSwap } from "@/composables/array_swap";
import { useDragCursor } from "./drag_cursor";

type DragAttr = `data-draggable-${typeof props.group}-${number}`;

const emit = defineEmits<{
	dragstart: [];
	dragend: [];
	dragswap: [];
}>();

const props = defineProps<{
	tag: string;
	group: string;
	handle: string;
	transitionName: string;
}>();

const obj = defineModel<Record<string, string | number>>({ required: true });
const dragCursor = useDragCursor();
const wrapper = ref<ComponentPublicInstance | null>(null);

const dragFrom = ref<number | null>(null);
const dropTo = ref<number | null>(null);

async function dragMove(e: PointerEvent): Promise<void> {
	try {
		const children = await getChildren();
		const childrenBoundingBoxes = children.map((child) =>
			child.getBoundingClientRect(),
		);

		const hoveredChildIndex = childrenBoundingBoxes.findIndex((rect) => {
			return (
				e.clientX >= rect.left &&
				e.clientX <= rect.right &&
				e.clientY >= rect.top &&
				e.clientY <= rect.bottom
			);
		});

		dragCursor.move(e.clientX, e.clientY, true);

		if (hoveredChildIndex !== dragFrom.value) {
			dropTo.value = hoveredChildIndex;
		}
	} catch (e) {
		console.error(e);
	}
}

function swapModelValue(): void {
	if (dragFrom.value === null || dropTo.value === null || dropTo.value === -1)
		return;

	const swappedEntries = arrSwap(
		Object.entries(obj.value),
		dragFrom.value,
		dropTo.value,
	);

	const swapped = Object.fromEntries(swappedEntries) as typeof obj.value;

	obj.value = swapped;

	emit("dragswap");
}

watch(dropTo, (num) => {
	dragCursor.enteredDropZone.value = num !== null && num !== -1;
});

// --------------------

async function startDragOperations(
	e: PointerEvent,
	attr: DragAttr,
): Promise<void> {
	try {
		const moveFromIndex = await findDragIndex(attr);
		const handle = e.target as HTMLElement;

		if (moveFromIndex === null) return;

		dragFrom.value = moveFromIndex;

		dragCursor.show();
		dragCursor.move(e.clientX, e.clientY, false);

		handle.setPointerCapture(e.pointerId);
		handle.addEventListener("pointermove", dragMove);
		handle.addEventListener("pointerup", endDragOperations);

		emit("dragstart");
	} catch (e) {
		console.error(e);
	}
}

async function endDragOperations(e: PointerEvent): Promise<void> {
	const handle = e.target as HTMLElement;

	if (!handle.hasPointerCapture(e.pointerId)) {
		console.error("pointer capture not found on handle", handle);

		return;
	}

	swapModelValue();
	dragCursor.hide();

	dragFrom.value = null;
	dropTo.value = null;

	handle.releasePointerCapture(e.pointerId);
	handle.removeEventListener("pointermove", dragMove);
	handle.removeEventListener("pointerup", endDragOperations);

	emit("dragend");
}

// --------------------

function getDragAttribute(el: HTMLElement): Promise<DragAttr> {
	return new Promise((res, rej) => {
		const attr = el.getAttribute("drag-item") as DragAttr;

		if (attr === null) {
			rej({ reason: "drag attribute not found", el });
		} else {
			res(attr);
		}
	});
}

async function getDragElHandle(el: HTMLElement): Promise<HTMLElement> {
	return new Promise((res, rej) => {
		const handle = el.getElementsByClassName(props.handle)[0] as HTMLElement;

		if (handle === undefined) {
			rej({ reason: "handle element not found", el });
		} else {
			res(handle);
		}
	});
}

function findDragIndex(attr: DragAttr): Promise<number> {
	return new Promise(async (res, rej) => {
		try {
			const children = await getChildren();

			let dragIndex = -1;

			for (const [index, child] of Object.entries(children)) {
				try {
					const dragAttr = await getDragAttribute(child);

					if (dragAttr === attr) {
						dragIndex = +index;

						break;
					}
				} catch (e) {
					console.error(e);
				}
			}

			if (dragIndex === -1) {
				rej({
					reason: "drag index not found",
					AttrToFind: attr,
					children,
				});
			} else {
				res(dragIndex);
			}
		} catch (e) {
			console.error(e);
		}
	});
}

function getChildren(): Promise<HTMLElement[]> {
	return new Promise(async (res, rej) => {
		try {
			const wrapperEl = await getWrapperEl();
			const children = Array.from(wrapperEl.children) as HTMLElement[];

			if (children.length) {
				res(children);
			} else {
				rej("children not found");
			}
		} catch (e) {
			console.error(e);
		}
	});
}

function getWrapperEl(): Promise<HTMLElement> {
	return new Promise((res, rej) => {
		const el = wrapper.value?.$el as HTMLElement;

		if (el === undefined) {
			rej("wrapper el not found");
		} else {
			res(el);
		}
	});
}

onMounted(() => {
	setTimeout(async () => {
		try {
			const children = await getChildren();

			children.forEach(async (child, index) => {
				const attr: DragAttr = `data-draggable-${props.group}-${index}`;

				try {
					const handle = await getDragElHandle(child);

					handle.addEventListener("touchstart", (e) => e.preventDefault());
					handle.addEventListener("pointerdown", (e) =>
						startDragOperations(e, attr),
					);
					child.setAttribute("drag-item", attr);
				} catch (e) {
					console.error(e);
				}
			});
		} catch (e) {
			console.error(e);
		}
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
