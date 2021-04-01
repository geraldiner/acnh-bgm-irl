/*
	Animal Crossing BGM IRL
	Author: Geraldine | https://geraldiner.com

	Listen to the Animal Crossing hourly background music (BGM) in real life (IRL) based on *your* local time and weather. Chill lo-fi music for study/sleep/relaxation.

	### Functionality
	- On the same note, I don't think it's necessary to update the weather info as frequently as the time (ie. every minute/second vs every hour, respectively), so I could make use of localStorage somehow.


	### Design
	- Having a cool background image would be nice, something either related to the location, weather, Animal Crossing or some combination.

	### Would be nice
	- For weather conditions like rain or snow, it would be cool to have actual weather sounds. Or maybe even sliders for ambient noises that the viewer could control and make it their own.
*/

// API Keys
const weatherApiKey = 'e0c580a040dd46a0829e6bf541d02ce4'
const unsplashAccessKey = 'k8WhCa_ZwWjj6XixJCy8r1z-2KMao8qpeVltgUxWEzs'

// HTML variables from DOM

let cityInput = document.querySelector('#cityInput')
let submitBtn = document.querySelector('#btn')
let locationForm = document.querySelector('#locationForm')

let descHtml = document.querySelector('#description')
let timeHtml = document.querySelector('#time')
let locationHtml = document.querySelector('#location')
let weatherDescHtml = document.querySelector('#weatherDesc')
let weatherIconHtml = document.querySelector('#weatherIcon')

let audioPlayer = document.querySelector('#audioPlayer')
let audioHtml = document.querySelector('#audio')
let audioSource = document.querySelector('#audioSource')

// Variables for processing

let lat
let long
let inputBool

const hourData = JSON.parse(localStorage.getItem("hourData")) || 0
const weatherData = JSON.parse(localStorage.getItem("weatherData")) || {}
const bgImgData = JSON.parse(localStorage.getItem("bgImgData")) || {}

/* 
	Check to see if the viewer will allow location access through the browser
*/
function checkGeolocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(successFunction);
	}
}

// Get latitude and longitude;
function successFunction(position) {
	lat = position.coords.latitude;
	long = position.coords.longitude;
	inputBool = false
	setHtml()
}

function setHtml(e) {
	setWeatherHtml()
	let time = setTimeHtml()
	setBackgroundHtml()
	setAudio(time)
}

function setWeatherHtml() {
	if (weatherData == {}) {
		console.log("this works here")
	} else {
		console.log("else statement")
	}
	fetchWeather(lat, long, '', 'latlong')

	// Is there location access or not?
	// if (inputBool) {
	// 	//get weather data
	// 	if (!weatherData || weatherData.city != cityInput.value) {
	// 		fetchWeather('', '', cityInput.value, 'city')
	// 	}
	// } else {
	// 	if (!weatherData) {
	// 		fetchWeather(lat, long, '', 'latlong')
	// 	}
	// }
	weatherIconHtml.src = weatherData.img
	weatherDescHtml.textContent = weatherData.str
	descHtml.style.display = 'flex'
	document.querySelector('.container').style.justifyContent = 'center'
}

function setTimeHtml() {
	let hour
	let month
	let date
	let year
	let timeStr
	let time = new Date()
	let options = { hour: 'numeric', minute: 'numeric', second: 'numeric', month: 'long', day: '2-digit', year: 'numeric', hour12: true }

	hour = time.getHours()
	month = time.getMonth()
	date = time.getDate()
	year = time.getYear()

	localStorage.setItem("hourData", JSON.stringify(hour))

	if (hour != hourData) {
		localStorage.setItem("hourData", JSON.stringify(hour))
	}

	if (inputBool || weatherData) {
		options.timeZone = weatherData.timezone
	}
	timeStr = time.toLocaleString('en-US', options);

	timeHtml.textContent = timeStr

	return time
}

function setBackgroundHtml() {
	let body = document.getElementsByTagName('body')[0]
	fetchPhoto()
	body.style.background = `url('${bgImgData.urls.full}')`
	body.style.backgroundAttachment = 'fixed'
	body.style.backgroundRepeat = 'no-repeat'
	body.style.backgroundPositionX = 'center'
	body.style.backgroundPositionY = 'center'
	body.style.backgroundSize = 'cover'
}

function setAudio(time) {
	fetchBGMJSON().then(bgm => {
		let keys = Object.keys(bgm)
		for (let i = 0; i < keys.length; i++) {
			if (bgm[keys[i]].hour == time.getHours()) {
				let
					weatherBGM = determineWeather()
				if (weatherBGM == bgm[keys[i]].weather) {
					audioSource.src = bgm[keys[i]].music_uri
					audioHtml.load()
					audioHtml.play()
				}
			}
		}
	})
	audioPlayer.style.display = 'block'
}

function determineWeather() {
	const rainCodes = ['rain', 'drizzle']
	const snowCodes = ['snow', 'sleet', 'hail', 'flurries']

	for (let i = 0; i < rainCodes.length; i++) {
		if (weatherData.desc.includes(rainCodes[i])) {
			return 'Rainy'
			break
		}
	}

	for (let i = 0; i < snowCodes.length; i++) {
		if (weatherData.desc.includes(snowCodes[i])) {
			return 'Snowy'
			break
		}
	}

	return 'Sunny'
}

async function fetchTime(time, timestamp) {
	let endpoint = `https://maps.googleapis.com/maps/api/timezone/json?location=${weatherData.lat},%20${weatherData.long}&timestamp=${timestamp}&key=AIzaSyAM_a6zpQL7fYCeqvSXMnK0-wOpdXBqizM`
	let localTime

	const response = await fetch(endpoint)
	const timeInfo = await response.json()
	return timeInfo
}

async function fetchBGMJSON() {
	const endpoint = 'https://raw.githubusercontent.com/alexislours/ACNHAPI/master/hourly.json'
	const response = await fetch(endpoint)
	const bgm = await response.json()
	return bgm
}

async function fetchWeather(lat, long, city, queryType) {
	let endpoint
	let response
	let weather
	let weatherData
	let splitCity

	if (city) {
		splitCity = city.split(", ")
		for (let i = 0; i < splitCity.length; i++) {
			splitCity[i].trim()
		}
	}

	if (queryType == 'city') {
		endpoint = splitCity ? `https://api.weatherbit.io/v2.0/current?city=${splitCity[0]}&country=${splitCity[1]}&units=I&key=e0c580a040dd46a0829e6bf541d02ce4` : `https://api.weatherbit.io/v2.0/current?city=${city}&units=I&key=e0c580a040dd46a0829e6bf541d02ce4`
	} else if (queryType == 'latlong') {
		endpoint = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${long}&units=I&key=e0c580a040dd46a0829e6bf541d02ce4`
	}
	response = await fetch(endpoint)
	weather = await response.json().then(info => {
		let data = info['data'][0]
		weatherData = {
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
		let str = `In ${weatherData.city}, it's ${weatherData.temp}°F. There might be ${weatherData.desc}.`
		weatherData.str = str
	})
	localStorage.setItem("weatherData", JSON.stringify(weatherData))
	//locationForm.reset()
}

async function fetchPhoto() {
	let bgImgData
	let endpoint = `https://api.unsplash.com/search/photos?page=1&query=${weatherData.city}&client_id=${unsplashAccessKey}&orientation=landscape`
	endpoint = endpoint.replace(/\s/g, "%20")
	console.log(endpoint)
	let response = await fetch(endpoint)
	let photo = await response.json().then(info => {
		let data = info.results[0]
		bgImgData = {
			'alt': data.alt_information,
			'links': data.links,
			'urls': data.urls,
			'author': data.user
		}
	})
	localStorage.setItem("bgImgData", JSON.stringify(bgImgData))
	return photo
}

function geocodeAddress(geocoder) {
	let cityName = weatherData.desc
	geocoder.geocode({ address: cityName }, (results, status) => {
		if (status === "OK") {
			console.log(results)
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}

window.addEventListener('load', checkGeolocation)
// locationForm.addEventListener('submit', (e) => {
// 	e.preventDefault()
// 	inputBool = true
// 	setHtml(e)
// })

setInterval(setTimeHtml, 1000)

// window.addEventListener('load', checkGeolocation);//Check if browser supports W3C Geolocation API

// window.addEventListener('load', doStuff)
