<script lang="ts">
	import { page } from '$app/state';
	import { convertBase64ToBlobUrl } from '$lib/utils';

	let { audioSrc } = $props();

	$effect(() => {
		audioSrc = convertBase64ToBlobUrl(
			page.data.audioData.audioBase64,
			page.data.audioData.audioType
		);
	});
</script>

<div class="fixed -z-[1] h-full w-full">
	<img
		src={page.data.imageData.imgSrc}
		alt={page.data.imageData.altText}
		class="relative h-full w-full object-cover object-center"
	/>
</div>
<div class="fixed -z-[1] h-full w-full bg-black opacity-50"></div>
<div class="mx-auto flex h-full w-full items-center justify-center p-4">
	<div class="mt-14 rounded-lg bg-white/70 p-6">
		<h1 class="mt-0">Welcome to ACNH BGM IRL</h1>
		<p>
			It is currently {page.data.temperature}
			{page.data.temperatureUnits} in {page.data.city}, {page.data.state} ({page.data.countryCode}).
		</p>
		<p>The weather is: {page.data.weatherDescription.day.description}</p>
		<div class="size-32">
			{#if page.data.isDay}
				<img
					src={`/images/weather-icons/svg/${page.data.weatherDescription.day.image}`}
					alt={page.data.weatherDescription.day.description}
				/>
			{:else}
				<img
					src={`/images/weather-icons/svg/${page.data.weatherDescription.night.image}`}
					alt={page.data.weatherDescription.night.description}
				/>{/if}
		</div>
		{#if !audioSrc}
			<p>Loading audio...</p>
		{:else}
			<audio controls autoplay>
				<source src={audioSrc} type={page.data.audioData.audioType} />
			</audio>
		{/if}
		<p>
			Image credit: <a
				href={page.data.imageData.author.originalLink}
				target="_blank"
				rel="noopener noreferrer">{page.data.imageData.author.name} on Unsplash</a
			>.
		</p>
	</div>
</div>
