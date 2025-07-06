<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';

	let { children } = $props();
	let backgroundUrl =
		'data:image/bmp;base64,Qk32BAAAAAAAADYAAAAoAAAACAAAAAgAAAABABgAAAAAAMAAAAATCwAAEwsAAAAAAAAAAAAAV1lYYl9VcGhRa2pTR2FbAFVgAFBdOFNUfXdihXlgjXxdf3ZbTWRbAE1YAENSA0pIoZFsp5NrrJJpmodjYW1bAExQADxEAEc5vqRyxKVyyKRwtZdqgXtcCllLAEo8S1U0061x2a9z3rBzzqVto41fanBNX2VAhG8/4bBt57Nv7bdx4rBuwJ1im4dTl4BNr4hQ6K5n7rNq97lu77dt1KhkuJdat5JXy5ld6q1l8bNo+rpt87ls26xlwpxcwphb1Z9h';
</script>

<main class="mx-auto min-h-screen w-full grow">
	{@render children()}
</main>
<Footer />
