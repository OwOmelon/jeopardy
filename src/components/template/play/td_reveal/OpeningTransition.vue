<script setup lang="ts">
import type { TableDataCell } from "@/stores/template";

defineProps<{
	category: TableDataCell["category"];
	points: TableDataCell["points"];
}>();

const emit = defineEmits<{
	finish: [];
}>();
</script>

<template>
	<div
		class="fixed left-1/2 top-1/2 grid h-screen w-screen -translate-x-1/2 -translate-y-1/2 place-items-center"
	>
		<div class="relative border-black">
			<svg
				width="50"
				height="50"
				viewBox="0 0 50 50"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				@animationend="emit('finish')"
			>
				<path
					d="M46.8582 25C45.5337 25.2405 43.8887 25.5714 42.1465 25.9988C40.0635 26.5097 37.8315 27.1608 35.8385 27.964C33.8562 28.7628 32.0622 29.7307 30.8964 30.8964C29.7307 32.0622 28.7628 33.8562 27.964 35.8385C27.1608 37.8315 26.5097 40.0635 25.9988 42.1465C25.5714 43.8887 25.2405 45.5337 25 46.8582C24.7595 45.5337 24.4286 43.8887 24.0012 42.1465C23.4903 40.0635 22.8392 37.8315 22.036 35.8385C21.2372 33.8562 20.2693 32.0622 19.1036 30.8964C17.9378 29.7307 16.1438 28.7628 14.1615 27.964C12.1685 27.1608 9.93649 26.5097 7.85349 25.9988C6.11129 25.5714 4.4663 25.2405 3.14177 25C4.4663 24.7595 6.11129 24.4286 7.85349 24.0012C9.93649 23.4903 12.1685 22.8392 14.1615 22.036C16.1438 21.2372 17.9378 20.2693 19.1036 19.1036C20.2693 17.9378 21.2372 16.1438 22.036 14.1615C22.8392 12.1685 23.4903 9.93649 24.0012 7.85349C24.4286 6.11129 24.7595 4.4663 25 3.14177C25.2405 4.4663 25.5714 6.11129 25.9988 7.85349C26.5097 9.93649 27.1608 12.1685 27.964 14.1615C28.7628 16.1438 29.7307 17.9378 30.8964 19.1036C32.0622 20.2693 33.8562 21.2372 35.8385 22.036C37.8315 22.8392 40.0635 23.4903 42.1465 24.0012C43.8887 24.4286 45.5337 24.7595 46.8582 25Z"
					fill="none"
					stroke="currentColor"
					stroke-width="0.25px"
					stroke-linejoin="round"
				/>
			</svg>

			<div class="text">
				<span class="z-10">{{ category }}</span>

				<hr class="mb-4 rounded-full border-2 border-[currentColor]" />

				<div class="w-fit rounded bg-red-400 px-3 py-1 text-white">
					<span>{{ points }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="postcss">
.text {
	animation: fade-slide-right 500ms forwards;

	@apply px-3 w-fit relative flex max-w-[60rem] flex-col text-5xl font-bold leading-[1em] text-stone-700 md:text-8xl;
}

.text span {
	@apply drop-shadow-[0_10px_8px_rgb(0_0_0_/_0.125)];
}

@keyframes fade-slide-right {
	from {
		opacity: 0;
		transform: translateX(-0.5em);
	}

	to {
		opacity: 1;
		transform: translateX(0);
	}
}

svg {
	animation: slow-spin 2s forwards;

	@apply absolute absolute left-0 top-0 grid h-[30rem] w-[30rem] place-items-center text-[12rem] text-red-400;
}

@keyframes slow-spin {
	0% {
		transform: translate(calc(-50%), -50%) rotate(0);
		animation-timing-function: linear;
	}

	50% {
		transform: translate(calc(-50%), -50%) rotate(45deg);
	}

	to {
		transform: translate(calc(-50%), -50%) rotate(135deg);
	}

	/* --- */

	0% {
		translate: -10rem;
	}

	25%,
	50% {
		translate: 0;
		animation-timing-function: ease-in;
	}

	100% {
		translate: 500%;
	}
}
</style>
