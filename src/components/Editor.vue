<script setup>
import draggable from "vuedraggable";

const jeop = useJeopardyStore();

const isDragging = ref(false);

function test() {
	console.log("test");
}
</script>

<template>
	<div v-if="!jeop.loading" class="grid gap-5">
		<draggable
			class="row-start-1 flex gap-5 h-fit"
			:style="{
				gridColumnStart: 1,
				gridColumnEnd: jeop.columns.length + 1,
			}"
			v-model="jeop.columns"
			item-key="element"
		>
			<template #item="{ element, index }">
				<CategoryCell :category="element" :index="index" />
			</template>
		</draggable>

		<template v-for="(row, rowIndex) in jeop.table" :key="rowIndex">
			<Cell
				:style="{
					gridRowStart: rowIndex + 2,
					gridColumnStart: columnIndex + 1,
				}"
				v-for="(column, columnIndex) in jeop.columns"
				:key="column.id"
				:rowIndex="rowIndex"
				:columnId="column.id"
				:data="row[column.id]"
				:points="jeop.rows[rowIndex]"
			/>
		</template>

		<draggable
			class="flex flex-col gap-5"
			:style="{
				gridRowStart: 2,
				gridRowEnd: jeop.rows.length + 2,
				gridColumnEnd: 1,
			}"
			v-model="jeop.rows"
			item-key="element"
		>
			<template #item="{ element, index }">
				<div class="flex flex-col justify-center h-full">
					<p
						class="border-b-2 border-neutral-400 text-center cursor-move hover:scale-125 duration-150"
					>
						{{ element }}
					</p>
				</div>
			</template>
		</draggable>
	</div>
</template>
