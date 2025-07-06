import weatherCodesJson from '../data/weather_codes.json';

const getHourFromDateString = (input: string) => {
	const date = new Date(input);
	const hour = date.getHours();
	return hour;
};

const getWeatherDescriptionFromWeatherCode = (weatherCode: string) => {
	return weatherCodesJson[weatherCode];
};

const RAINY_DESCRIPTIONS = [
	'Light Drizzle',
	'Drizzle',
	'Heavy Drizzle',
	'Light Freezing Drizzle',
	'Freezing Drizzle',
	'Light Rain',
	'Rain',
	'Heavy Rain',
	'Light Freezing Rain',
	'Freezing Rain',
	'Light Showers',
	'Showers',
	'Heavy Showers',
	'Thunderstorms',
	'Thunderstorms With Hail'
];

const SNOWY_DESCRIPTIONS = [
	'Light Snow',
	'Snow',
	'Heavy Snow',
	'Snow Grains',
	'Light Snow Showers',
	'Show Showers'
];

const parseWeatherFromDescription = (description: string) => {
	if (RAINY_DESCRIPTIONS.includes(description)) {
		return 'rainy';
	}
	if (SNOWY_DESCRIPTIONS.includes(description)) {
		return 'snowy';
	}
	return 'sunny';
};

function convertBase64ToBlobUrl(dataURI: string, contentType: string) {
	const BASE64_MARKER = ';base64,';
	const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
	const base64 = dataURI.substring(base64Index);
	const raw = atob(base64);
	const rawLength = raw.length;
	const array = new Uint8Array(new ArrayBuffer(rawLength));

	for (let i = 0; i < rawLength; i++) {
		array[i] = raw.charCodeAt(i);
	}
	const blob = new Blob([array], { type: contentType });
	const blobUrl = URL.createObjectURL(blob);
	return blobUrl;
}

const getBaseApiUrl = () => {
	return import.meta.env.DEV ? 'http://localhost:8888' : 'https://acnh-bgm-irl.netlify.app';
};

export {
	convertBase64ToBlobUrl,
	getHourFromDateString,
	getWeatherDescriptionFromWeatherCode,
	getBaseApiUrl,
	parseWeatherFromDescription
};
