<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { UseDraggable as Draggable } from "@vueuse/components";
import { useTemplateStore } from "@/stores/template";

import type { RowID, ColumnID } from "@/stores/template";

const handle = ref<HTMLElement | null>(null);
const show = ref(true);

function toggleShow(e: KeyboardEvent) {
	if (e.ctrlKey && e.shiftKey && e.altKey && e.key.toLowerCase() === "s") {
		show.value = !show.value;
	}
}

window.addEventListener("keydown", toggleShow);

// --------------------

const template = useTemplateStore();

const templateStructureArr = computed(() => {
	const rowsArr = Object.entries(template.rows) as [RowID, number][];
	const columnsArr = Object.entries(template.columns) as [ColumnID, string][];

	const a: {
		row: RowID;
		points: number;
		column: ColumnID;
		category: string;
	}[] = [];

	for (let i = 0; i < 5; i++) {
		a.push({
			row: rowsArr[i][0],
			points: rowsArr[i][1],
			column: columnsArr[i][0],
			category: columnsArr[i][1],
		});
	}

	return a;
});

function func() {}

// --------------------

type ArrKey = `uh${number}`;

const transitGroupEl = ref<any>(null);

const obj = ref(createObj());
const uniqueKey = "uh9";

watch(obj, (val) => {
	const entries: any[] = JSON.parse(JSON.stringify(Object.entries(val)))

	entries.forEach((entry) => {
		console.log(entry)
	})

	console.log('---------------------')
})

const dragFrom = ref<number | null>(null);
const dropTo = ref<number | null>(null);

function onDragStart(attr: string) {
	const index = findIndex(attr);

	dragFrom.value = index;
}

function onDragEnter(attr: string) {
	const index = findIndex(attr);

	dropTo.value = index;
}

function onDrop() {
	if (dragFrom.value === null || dropTo.value === null) return;

	let objToArr = Object.entries(obj.value) as [ArrKey, string][];

	const movedObj = arrSwitch(objToArr, dragFrom.value, dropTo.value).reduce(
		(entries, [key, value]) => {
			return {
				...entries,
				[key]: value,
			};
		},
		{},
	);

	obj.value = movedObj;
}

function onDragEnd() {
	dragFrom.value = null;
	dropTo.value = null;
}

function findIndex(attr: string): number {
	return getChildren().findIndex((child) => child.hasAttribute(attr));
}

function getChildren(): Element[] {
	return Array.from(transitGroupEl.value.$el.children);
}

onMounted(() => {
	const el = transitGroupEl.value.$el as HTMLElement;

	el.addEventListener("drop", () => onDrop());
	el.addEventListener("dragend", () => onDragEnd());

	el.addEventListener("dragover", (e) => {
		e.preventDefault();
	});
	el.addEventListener("dragenter", (e) => {
		e.preventDefault();
	});

	getChildren().forEach((child, index) => {
		const attr = `drag-${index}`;

		child.setAttribute("draggable", "true");
		child.setAttribute(attr, "");

		child.addEventListener("dragstart", () => onDragStart(attr));
		child.addEventListener("dragenter", () => onDragEnter(attr));
	});
});

function createObj(): Record<ArrKey, string> {
	const newObj: ReturnType<typeof createObj> = { [uniqueKey]: "weeeee" };

	for (let x = 0; x < 5; x++) {
		newObj[`uh${x}`] = `hooo${x}`;
	}
	return newObj;
}

function moveUniqueInObj(direction: -1 | 1) {
	let objToArr = Object.entries(obj.value) as [ArrKey, string][];
	const from = objToArr.findIndex(([key, value]) => {
		return key === uniqueKey;
	});
	const to = from + direction;

	if (to < 0 || to > objToArr.length - 1) return;

	const movedObj = arrSwitch(objToArr, from, to).reduce(
		(entries, [key, value]) => {
			return {
				...entries,
				[key]: value,
			};
		},
		{},
	);

	obj.value = movedObj;
}

function arrSwitch(arr: any[], from: number, to: number): any[] {
	[arr[from], arr[to]] = [arr[to], arr[from]];

	return JSON.parse(JSON.stringify(arr));
}
</script>

<template>
	<Draggable
		v-if="show"
		:handle="handle"
		:initial-value="{ x: 50, y: 50 }"
		class="fixed"
	>
		<div
			ref="handle"
			class="flex items-center justify-end rounded-t bg-white p-1"
		>
			<button class="rounded-full bg-black p-2" @click="show = false" />
		</div>

		<div
			id="DEBUG-MAIN"
			class="rounded-b bg-black/50 p-3 text-xs text-white backdrop-blur-sm"
		>
			<div class="flex gap-3">
				<div v-for="item in templateStructureArr" class="text-center">
					<p>
						{{ item.category || item.column }}
					</p>
					<hr />
					<div class="group">
						<p class="group-hover:hidden">
							{{ item.row }}
						</p>
						<p class="hidden group-hover:block">
							{{ item.points }}
						</p>
					</div>
				</div>
			</div>

			<br />

			<p>{{ dragFrom ?? "x" }} | {{ dropTo ?? "x" }}</p>
			<TransitionGroup
				ref="transitGroupEl"
				tag="div"
				name="list-slide-left"
				class="relative flex gap-3"
			>
				<div
					v-for="(value, key, index) in obj"
					:key="key"
					:class="[
						{ '!-translate-y-1': index === dragFrom },
						{ 'translate-y-1': index === dropTo },
						'text-center transition-transform',
					]"
				>
					<p>{{ value }}</p>
					<hr />
					<p>{{ key }}</p>
				</div>
			</TransitionGroup>

			<br />

			<button @click="func">func</button>

			<div class="flex gap-3">
				<button @click="moveUniqueInObj(-1)">move left</button>
				<button @click="moveUniqueInObj(1)">move right</button>
			</div>
		</div>
	</Draggable>
</template>

<style scoped lang="postcss">
button {
	@apply rounded border-2 border-white bg-white px-3 py-1 text-black transition-colors hover:bg-black hover:text-white;
}
</style>
