<script setup>
const jeop = useJeopardyStore();
</script>

<template>
	<div
		class="fixed top-0 left-0 grid place-items-center bg-[#000]/30 w-screen h-screen backdrop-blur-sm"
	>
		<div
			class="bg-red-400 p-5 rounded text-[#fff] shadow-[0_10px_40px] shadow-[#000]/40"
		>
			<h1 class="text-3xl font-bold">!RESTART</h1>
			<p>
				Are you sure you want to reset your progress? This action cannot be
				undone.
			</p>
			<div class="mt-3">
				<button
					class="bg-[#fff] hover:bg-red-300 p-3 rounded text-red-400 hover:text-[#fff] duration-150"
					@click="jeop.showRestartModal = false"
				>
					cancel
				</button>
				<button
					class="bg-[#fff] hover:bg-red-300 p-3 ml-5 rounded text-red-400 hover:text-[#fff] duration-150"
					@click="(jeop.showRestartModal = false), jeop.resetProgress()"
				>
					restart
				</button>
			</div>
		</div>
	</div>
</template>
