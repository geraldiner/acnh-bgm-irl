import {
	getBaseApiUrl,
	getHourFromDateString,
	getWeatherDescriptionFromWeatherCode,
	parseWeatherFromDescription
} from '$lib/utils';
import type { PageServerLoad } from './$types';
import { UNSPLASH_ACCESS_KEY } from '$env/static/private';

const fetchLocationData = async () => {
	try {
		const response = await fetch(`${getBaseApiUrl()}/location`);
		const json = await response.json();
		return json;
	} catch (error) {
		return { error: error };
	}
};

const fetchWeatherData = async (latitude: string, longitude: string) => {
	try {
		const response = await fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&timezone=auto&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`
		);
		const json = await response.json();
		return json;
	} catch (error) {
		return { error: error };
	}
};

const fetchUnsplashImage = async (query: string) => {
	try {
		const response = await fetch(
			`https://api.unsplash.com/search/photos?page=1&per_page=2&query=${query}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape`.replace(
				/\s/g,
				'%20'
			)
		);
		const json = await response.json();
		return json;
	} catch (error) {
		return { error: error };
	}
};

const fetchHourlyBGMData = async (hour: number, weather: string) => {
	try {
		const response = await fetch(
			`https://acnh-api.netlify.app/api/v2/hourly-bgm?hour=${hour}&weather=${weather}`
		);
		const json = await response.json();
		return json;
	} catch (error) {
		return { error: error };
	}
};

const fetchHourlyBGMBlob = async (key: string) => {
	try {
		const url = `https://acnh-api.netlify.app/api/v2/blobs?type=audio&key=${key}.mp3`;
		const response = await fetch(url);
		const data = await response.json();
		return data;
	} catch (error) {
		return { error: error };
	}
};

export const load: PageServerLoad = async () => {
	const locationResponse = await fetchLocationData();
	const {
		city,
		country: { code: countryCode },
		latitude,
		longitude,
		subdivision: { name: state }
	} = locationResponse.geoData;
	const weatherResponse = await fetchWeatherData(latitude, longitude);
	const {
		timezone,
		current_units: { temperature_2m: temperatureUnits },
		current: { time, temperature_2m: temperature, weather_code: weatherCode, is_day: isDay }
	} = weatherResponse;
	const hour = getHourFromDateString(time);
	const weatherDescription = getWeatherDescriptionFromWeatherCode(weatherCode);
	const weather = parseWeatherFromDescription(weatherDescription.day);

	const hourlyBGMResponse = await fetchHourlyBGMData(hour, weather);
	const hourlyBGMBlob = await fetchHourlyBGMBlob(hourlyBGMResponse.hourData['file-name']);
	const { data: base64Data, metadata } = hourlyBGMBlob.blobWithMetadata;

	const imageResponse = await fetchUnsplashImage(`${city} ${state} ${countryCode}`);
	const imageData = imageResponse.results[1];

	const data = {
		city,
		countryCode,
		hourlyBGMData: hourlyBGMResponse.hourData,
		imageData: {
			altText: imageData.alt_description,
			imgSrc: imageData.urls.full,
			author: {
				originalLink: imageData.links.html,
				name: imageData.user.name
			}
		},
		audioData: {
			audioBase64: base64Data,
			audioType: metadata.type
		},
		isDay,
		state,
		serverMessage: 'Data found.',
		timezone,
		temperature,
		temperatureUnits,
		time,
		weatherDescription
	};

	return data;
};
