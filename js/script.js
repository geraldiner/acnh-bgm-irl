/*

	Animal Crossing BGM IRL
	Author: Geraldine | https://geraldiner.com

	Listen to the Animal Crossing hourly background music (BGM) in real life (IRL) based on *your* local time and weather. Chill lo-fi music for study/sleep/relaxation.

*/


// get DOM elements
const body = document.querySelector('body')
const descHtml = document.querySelector('#description')
const timeHtml = document.querySelector('#time')
const locationHtml = document.querySelector('#location')
const weatherDescHtml = document.querySelector('#weatherDesc')
const weatherIconHtml = document.querySelector('#weatherIcon')

const audioPlayer = document.querySelector('#audioPlayer')
const audioHtml = document.querySelector('#audio')
const audioSource = document.querySelector('#audioSource')


// Check if the browser supports Geolocation
function checkGeolocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
	} else {
		alert("This browser doesn't support Geolocation.")
	}
}

// Success callback for Geolocation function, gets the coordinates for the viewers position and uses it to set the HTML for all the information received from APIs and the browser
function successFunction(position) {
	const coords = {
		'lat': position.coords.latitude,
		'long': position.coords.longitude
	}
	setHtml(coords)
}

// Error callback for Geolocation function, alerts the viewer with a reminder that location access is needed to continue
function errorFunction() {
	alert("Please allow location access to continue.")
}

// Sets the different parts of the HTML based on the information being received from APIs and the browser: 1) weather, 2) background image, 3) time, 4) ACNH audio
async function setHtml(coords) {
	let weatherData = await setWeatherHtml(coords)
	await setBackgroundHtml(weatherData.city)
	let time = setTimeHtml()
	setAudioHtml(time, weatherData.desc)
}

// Specifically focuses on setting the weather information in the HTML, returns the data to be used by other functions
async function setWeatherHtml(coords) {
	let weatherData = await fetchWeather(coords)
	return processWeatherData(weatherData)
}

// Processes the info received from the weatherbit API and displays it in the DOM, returns a new object with only the information used for this app to be used by other functions
function processWeatherData(weatherData) {
	let data = weatherData.data[0]
	let weatherInfo = {
		'lat': data.lat,
		'long': data.lon,
		'timezone': data.timezone,
		'city': data.city_name,
		'state': data.state_code,
		'country': data.country_code,
		'temp': data.temp,
		'desc': data.weather.description,
		'img': `https://www.weatherbit.io/static/img/icons/${data.weather.icon}.png`,
		'code': data.weather.code,
	}
	let str = `In ${weatherInfo.city}, it's ${weatherInfo.temp}°F. There might be ${weatherInfo.desc}.`
	weatherInfo.str = str
	weatherIconHtml.src = weatherInfo.img
	weatherDescHtml.textContent = weatherInfo.str
	descHtml.style.display = 'flex'
	document.querySelector('.container').style.justifyContent = 'center'
	return weatherInfo
}

// Specifically focuses on setting the background image in the HTML
async function setBackgroundHtml(city) {
	let bgImgData = await fetchPhoto(city)
	processBgImgData(bgImgData)
}

// Processes the info received from the Unsplash API and displays it in the DOM
function processBgImgData(bgImgData) {
	let data = bgImgData.results[0]
	let bgImgInfo = {
		'alt': data.alt_information,
		'links': data.links,
		'urls': data.urls,
		'author': data.user
	}
	body.style.background = `url('${bgImgInfo.urls.full}')`
	body.style.backgroundAttachment = 'fixed'
	body.style.backgroundRepeat = 'no-repeat'
	body.style.backgroundPositionX = 'center'
	body.style.backgroundPositionY = 'center'
	body.style.backgroundSize = 'cover'
}

// Specifically focuses on setting the time information in the HTML using the Date object, returns it to be used by other functions
function setTimeHtml() {
	let hour, month, date, year, timeStr
	let time = new Date()
	let options = { hour: 'numeric', minute: 'numeric', second: 'numeric', month: 'long', day: '2-digit', year: 'numeric', hour12: true }

	hour = time.getHours()
	month = time.getMonth()
	date = time.getDate()
	year = time.getYear()
	timeStr = time.toLocaleString('en-US', options);
	timeHtml.textContent = timeStr
	return time
}

// Specifically focuses on setting the audio information in the HTML
async function setAudioHtml(time, weatherDesc) {
	let bgmData = await fetchBGMJSON()
	processAudioData(time, bgmData, weatherDesc)
}

// Processes the info received from the ACNH API and displays it in the DOM based on time and weather
function processAudioData(time, bgmData, weatherDesc) {
	let keys = Object.keys(bgmData)
	for (let i = 0; i < keys.length; i++) {
		if (bgmData[keys[i]].hour == time.getHours()) {
			let weatherBGM = determineWeather(weatherDesc)
			if (weatherBGM == bgmData[keys[i]].weather) {
				audioSource.src = bgmData[keys[i]].music_uri
				audioHtml.load()
				audioPlayer.style.display = 'block'
				audioHtml.play()
			}
		}
	}
}

// Takes the weather description and returns the audio name that most closely matches it
function determineWeather(weatherDesc) {
	const rainCodes = ['rain', 'drizzle']
	const snowCodes = ['snow', 'sleet', 'hail', 'flurries']
	const weatherCodes = [rainCodes, snowCodes]

	for (let i = 0; i < weatherCodes.length; i++) {
		for (let j = 0; j < weatherCodes[i].length; j++) {
			if (weatherDesc.includes(weatherCodes[i][j])) {
				if (i === 0) {
					return 'Rainy'
				} else {
					return 'Snowy'
				}
			}
		}
		return 'Sunny'
	}
}


// Fetches data from the weatherbit API based on the viewer's location coordinates
async function fetchWeather(coords) {
	let endpoint = `https://api.weatherbit.io/v2.0/current?lat=${coords.lat}&lon=${coords.long}&units=I&key=${config.WEATHER_API_KEY}`
	try {
		const weatherStream = await fetch(endpoint)
		const weatherJson = await weatherStream.json()
		return weatherJson
	} catch (error) {
		return { Error: error.stack }
	}
}

// Fetches data from the Unsplash API based on the viewer's city location
async function fetchPhoto(city) {
	let endpoint = `https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=${config.UNSPLASH_ACCESS_KEY}&orientation=landscape`
	endpoint = endpoint.replace(/\s/g, "%20")
	try {
		let photoStream = await fetch(endpoint)
		let photoJson = await photoStream.json()
		return photoJson
	} catch (err) {
		return { Error: error.stack }
	}
}

// Fetches data from the ACNH API's json file for hourly BGM music
async function fetchBGMJSON() {
	const endpoint = 'https://raw.githubusercontent.com/alexislours/ACNHAPI/master/hourly.json'
	try {
		const acnhStream = await fetch(endpoint)
		const acnhJson = await acnhStream.json()
		return acnhJson
	} catch (err) {
		return { Error: error.stack }
	}
}

window.addEventListener('load', checkGeolocation)
setInterval(setTimeHtml, 1000)


/*

1. get the location from the viewer - comes as coordinates
2. get the weather from the viewer based on the coordinates
3. get a related image based on the location of the viewer
4. get the time from the viewer - date object
5. get the audio based on the time & weather
6. place everything in the dom
- display date & time every second
- diplay background image
- start playing audio

*/