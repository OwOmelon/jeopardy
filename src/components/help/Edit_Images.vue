<script setup lang="ts">
import { ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";

const emit = defineEmits<{
	close: [];
}>();
</script>

<template>
	<div
		class="rounded bg-stone-100 p-8 text-stone-900"
		v-on-click-outside="
			() => {
				emit('close');
			}
		"
	>
		<div class="relative max-w-[500px]">
			<h3 class="text-4xl font-bold">
				SO YOU WANNA ADD IMAGES TO YOUR JEOPARDY TEMPLATE ?
			</h3>

			<br />

			<p>
				It is recommended that you use
				<a
					href="https://media.tenor.com/N3qwkwoXDD0AAAAM/crunch-cat.gif"
					target="_blank"
				>
					image URLs</a
				>
				instead of uploading images to your template. This website will autosave
				image URLs but not uploaded images. Why?
				<span class="font-bold">Read below for more info.</span>
			</p>

			<div class="gif-placeholder h-16">gif goes here</div>

			<hr class="my-3 border-stone-900" />

			<div class="flex flex-col gap-5">
				<div>
					<p>
						Your template is automatically saved on what's called a "local
						storage" and it can store up to 5 megabytes of data. Now, 5
						megabytes is
						<span class="italic">way more</span> than enough to save a bunch of
						<span class="underline">text</span>, (which is technically what a
						jeopardy template is),
						<span class="font-bold"
							>but not <span class="underline">images</span>.</span
						>
						Depending on the quality and resolution of an image, its file size
						can vary from 1 kilobyte to
						<span class="italic">way more</span> than 5 megabytes. Just a
						handful of high-quality images is enough to easily fill up local
						storage. And so, because of that, uploaded images will not be saved
						on local storage. Once the page refreshes, all of your uploaded
						images will be gone.
					</p>

					<div class="gif-placeholder h-48">gif 1 goes here</div>
				</div>

				<div>
					<p>
						If you want to add images to your template without having to worry
						about losing them when you refresh the page, you can instead use
						<a
							href="https://media.tenor.com/N3qwkwoXDD0AAAAM/crunch-cat.gif"
							target="_blank"
						>
							image URLs!!</a
						>
						An image URL is just a piece of
						<span class="underline">text</span> that links to an image that has
						been saved on the internet. A URL would take up a
						<span class="italic">teensy tiny</span> bit more local storage space
						than any piece of text would.
					</p>

					<div class="gif-placeholder h-48">gif 2 goes here</div>
				</div>

				<div>
					<p>
						If you, for some reason, are not able to use image URLs, you can
						export your template by clicking on the "export" button and your
						browser will download your
						<span class="font-bold">whole</span> template and save it on your
						device (text, image URLs <span class="italic">and</span> uploaded
						images are saved). And then, once you're ready to use said template,
						click on the "import" button, select the template that you
						downloaded/exported, and voila! You will see that your uploaded
						images are in your template :DDD.
					</p>

					<div class="gif-placeholder h-48">gif 3 goes here</div>
				</div>
			</div>

			<button
				type="button"
				class="mt-5 w-full rounded border-2 border-stone-600 bg-stone-600 p-2 text-xl font-bold text-stone-100 transition-colors hover:bg-transparent hover:text-stone-600"
				@click="emit('close')"
			>
				CLOSE
			</button>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
a {
	@apply rounded-sm border-2 border-stone-400 bg-stone-400 px-1 text-white transition-colors hover:bg-transparent hover:text-stone-900;
}

.gif-placeholder {
	@apply mt-5 grid place-items-center rounded bg-stone-600 text-white;
}
</style>
