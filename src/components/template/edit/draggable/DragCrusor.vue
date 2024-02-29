<script setup lang="ts">
import { useDragCursor } from "./drag_cursor";

const { enteredDropZone } = useDragCursor();
</script>

<template>
	<div
		id="drag-cursor"
		style="pointer-events: none; position: fixed; left: 0; top: 0"
		class="scale-110 transition-opacity duration-300"
	>
		<div
			class="relative grid -translate-x-1/2 -translate-y-1/2 place-items-center"
		>
			<i
				:class="[
					enteredDropZone ? 'w-24 border-green-400' : 'w-14 border-red-400',
					'cursor-ring shadow-subtle absolute aspect-square rounded-full border-4 bg-stone-500/25 transition-[width_border] duration-300',
				]"
			/>

			<div
				:class="[
					enteredDropZone ? 'drag-icon-drop-enter' : 'drag-icon-dragging',
					'drag-icon shadow-subtle absolute grid place-items-center',
				]"
			>
				<i />

				<i />
				<i />

				<div class="box">
					<i />
					<i />

					<i />
					<i />

					<i />
					<i />

					<i />
					<i />
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="postcss">
.shadow-subtle {
	@apply drop-shadow-[0_1px_2px_rgb(0_0_0)];
}

.drag-icon i {
	@apply absolute rounded-full bg-stone-200 transition-[bottom,_left,_right,_top,height,_width,_transform] duration-300;
}

.drag-icon .box {
	@apply absolute transition-[top,_height,_width,_transform] duration-300;
}
</style>

<style scoped lang="scss">
.drag-icon {
	& > i:nth-child(1) {
		width: 4px;
	}

	& > i:nth-child(2) {
		height: 4px;
		width: 12px;
	}

	& > i:nth-child(3) {
		height: 4px;
		width: 12px;
	}

	.box {
		i:nth-child(-n + 4) {
			top: 0;
		}

		i:nth-child(n + 5):nth-child(-n + 8) {
			bottom: 0;
		}

		i:nth-child(n + 3):nth-child(-n + 6) {
			right: 0;
		}
	}
}

.drag-icon-dragging {
	& > i:nth-child(1) {
		bottom: -6px;
		height: 12px;
	}

	& > i:nth-child(2) {
		left: -6px;
		bottom: -2px;
		transform: rotate(0);
	}

	& > i:nth-child(3) {
		right: -6px;
		bottom: -2px;
		transform: rotate(0);
	}

	& .box {
		top: -13px;
		width: 26px;
		height: 26px;
		transform: rotate(45deg);

		i:nth-child(odd) {
			height: 4px;
			width: 10px;
		}

		i:nth-child(even) {
			height: 10px;
			width: 4px;
		}
	}
}

.drag-icon-drop-enter {
	& > i:nth-child(1) {
		bottom: 8px;
		height: 30px;
		width: 4px;
	}

	& > i:nth-child(2) {
		left: -3px;
		bottom: 7px;
		transform: rotate(-45deg);
	}

	& > i:nth-child(3) {
		right: -3px;
		bottom: 7px;
		transform: rotate(45deg);
	}

	& .box {
		top: 4px;
		height: 30px;
		width: 50px;
		transform: rotate(0deg);

		i:nth-child(odd) {
			height: 4px;
			width: 20px;
		}

		i:nth-child(even) {
			height: 12px;
			width: 4px;
		}
	}
}
</style>
