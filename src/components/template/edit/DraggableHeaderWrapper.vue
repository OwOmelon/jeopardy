<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { arrSwap } from "@/composables/array_swap";

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
const wrapper = ref<any>(null);

const dragFrom = ref<number | null>(null);
const dropTo = ref<number | null>(null);

async function dragMove(e: MouseEvent): Promise<void> {
	try {
		const children = await getChildren();
		const childrenCoords = children.map((child) =>
			child.getBoundingClientRect(),
		);

		const mouseX = e.clientX;
		const mouseY = e.clientY;

		const childHoveredIndex = childrenCoords.findIndex((rect) => {
			return (
				mouseX >= rect.left &&
				mouseX <= rect.right &&
				mouseY >= rect.top &&
				mouseY <= rect.bottom
			);
		});

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

	dragFrom.value = null;
	dropTo.value = null;
}

watch(dropTo, (newTo, oldTo) => {
	if (newTo !== null && oldTo === null) {
		const rule = "* { cursor: no-drop !important }";

		const styleSheet = document.createElement("style");

		styleSheet.innerText = rule;
		styleSheet.title = "drag-override-window-cursor";
		styleSheet.setAttribute("id", "drag-override-window-cursor");
		document.head.appendChild(styleSheet);

		return;
	}

	if (newTo === null && oldTo !== null) {
		const customStyleSheet = document.getElementById(
			"drag-override-window-cursor",
		);

		customStyleSheet?.remove();

		return;
	}

	if (newTo !== null) {
		const sheets = document.styleSheets;
		const index = Array.from(sheets).findIndex(
			(sheet) => sheet.title === "drag-override-window-cursor",
		);
		const wcss = sheets.item(index);

		wcss?.deleteRule(0);
		wcss?.insertRule(
			`* { cursor: ${newTo === -1 ? "no-drop" : "cell"} !important }`,
		);
	}
});

// --------------------

async function startDragOperations(
	e: MouseEvent,
	attr: DragAttr,
): Promise<void> {
	try {
		const moveFromIndex = await findDragIndex(attr);

		if (moveFromIndex === null) return;

		dragFrom.value = moveFromIndex;

		e.preventDefault();
		window.addEventListener("mousemove", dragMove);
		window.addEventListener("mouseup", endDragOperations);

		emit("dragstart");
	} catch (e) {
		console.error(e);
	}
}

async function endDragOperations(): Promise<void> {
	swapModelValue();

	window.removeEventListener("mousemove", dragMove);
	window.removeEventListener("mouseup", endDragOperations);

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

					handle.addEventListener("mousedown", (e) =>
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
