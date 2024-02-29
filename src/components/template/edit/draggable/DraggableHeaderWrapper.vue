<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { arrSwap } from "@/composables/array_swap";
import { appCursorOverwrite } from "@/composables/app_cursor_overwrite";
import { useDragCursor } from "./drag_cursor";

type DragAttr = `drag-${typeof props.group}-${number}`;

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
const dragCursor = useDragCursor();
const wrapper = ref<any>(null);

const dragFrom = ref<number | null>(null);
const dropTo = ref<number | null>(null);

async function dragMove(e: PointerEvent): Promise<void> {
	try {
		const children = await getChildren();
		const childrenCoords = children.map((child) =>
			child.getBoundingClientRect(),
		);

		const pointerX = e.clientX;
		const pointerY = e.clientY;

		const childHoveredIndex = childrenCoords.findIndex((rect) => {
			return (
				pointerX >= rect.left &&
				pointerX <= rect.right &&
				pointerY >= rect.top &&
				pointerY <= rect.bottom
			);
		});

		dragCursor.move(pointerX, pointerY, true);

		if (childHoveredIndex !== dragFrom.value) {
			dropTo.value = childHoveredIndex;
		}
	} catch (e) {
		console.error(e);
	}
}

function swapModelValue(): void {
	if (dragFrom.value !== null && dropTo.value !== null && dropTo.value !== -1) {
		const swappedEntries = arrSwap(
			Object.entries(obj.value),
			dragFrom.value,
			dropTo.value,
		);

		const swapped = Object.fromEntries(swappedEntries) as typeof obj.value;

		obj.value = swapped;
	}
}

watch(dropTo, (num) => {
	dragCursor.enteredDropZone.value = num !== null && num !== -1;
});

// --------------------

async function startDragOperations(
	e: PointerEvent,
	attr: DragAttr,
): Promise<void> {
	const handle = e.target as HTMLElement;

	try {
		const moveFromIndex = await findDragIndex(attr);

		if (moveFromIndex === null) return;

		const pointerX = e.clientX;
		const pointerY = e.clientY;

		dragFrom.value = moveFromIndex;

		appCursorOverwrite.enable("grabbing");
		dragCursor.show();
		dragCursor.move(pointerX, pointerY, false);

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
	appCursorOverwrite.disable();

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
		const handle = el.getElementsByClassName("handle")[0] as HTMLElement;

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
				const attr: DragAttr = `drag-${props.group}-${index}`;

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
