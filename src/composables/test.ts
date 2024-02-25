import { ref, onMounted } from "vue";

export function test() {
	const text = ref('');

	function log() {
		console.log('test log')
	}

	onMounted(() => {
		console.log('test composable mounted')
	})

	return { text, log }
}