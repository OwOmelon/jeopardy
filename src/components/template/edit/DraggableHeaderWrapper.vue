<script setup lang="ts">
import { ref, onMounted } from "vue";
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

function moveTo(e: MouseEvent): void {}

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

async function startDragOperations(
	e: MouseEvent,
	attr: DragAttr,
): Promise<void> {
	const moveFromIndex = await findDragindex(attr);

	if (moveFromIndex === null) return;

	dragFrom.value = moveFromIndex;

	try {
		const children = await getChildren();

		children.forEach((child, index) => {
			if (moveFromIndex !== index) {
				child.addEventListener("click", moveTo);
			}
		});

		emit("dragstart");
		e.preventDefault();
		document.body.style.cursor = "no-drop";
		window.addEventListener("mouseup", endDragOperations);
	} catch (e) {
		console.error(e);
	}
}

async function endDragOperations(): Promise<void> {
	onDragEnd();

	try {
		const children = await getChildren();

		children.forEach((child) => {
			child.removeEventListener("click", moveTo);
		});

		document.body.style.cursor = "";
		window.removeEventListener("mouseup", endDragOperations);
	} catch (e) {
		console.error(e);
	}
}

// --------------------

function getDragAttribute(el: HTMLElement): Promise<DragAttr> {
	return new Promise((res, rej) => {
		const attr = el.getAttribute("drag-item") as DragAttr;

		if (attr === null) {
			rej("drag attribute not found");
		} else {
			res(attr);
		}
	});
}

async function getDragElHandle(el: HTMLElement): Promise<HTMLElement> {
	return new Promise((res, rej) => {
		const handle = el.getElementsByClassName("handle")[0] as HTMLElement;

		if (handle === undefined) {
			rej("handle element not found");
		} else {
			res(handle);
		}
	});
}

function findDragindex(attr: DragAttr): Promise<number> {
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
				rej("drag index not found");
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
