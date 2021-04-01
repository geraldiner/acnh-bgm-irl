/*
	Animal Crossing BGM IRL
	Author: Geraldine | https://geraldiner.com

	Listen to the Animal Crossing hourly background music (BGM) in real life (IRL) based on *your* local time and weather. Chill lo-fi music for study/sleep/relaxation.

	### Functionality
	- For viewers who'd like to be more private, they could enter their location info manually instead of allowing the site to access it. This would mean more cases to account for.
	- On the same note, I don't think it's necessary to update the weather info as frequently as the time (ie. every minute/second vs every hour, respectively), so I could make use of localStorage somehow.


	### Design
	- Having a cool background image would be nice, something either related to the location, weather, Animal Crossing or some combination.

	### Would be nice
	- For weather conditions like rain or snow, it would be cool to have actual weather sounds. Or maybe even sliders for ambient noises that the viewer could control and make it their own.
*/

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



const locationData = JSON.parse(localStorage.getItem("locationData")) || {}
const weatherData = JSON.parse(localStorage.getItem("weatherData")) || {}

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
	setAudio(time)
}

function setWeatherHtml() {
	// Is there location access or not?
	if (inputBool) {
		//get weather data
		if (!weatherData || weatherData.city != cityInput.value) {
			fetchWeather('', '', cityInput.value, 'city')
		}
	} else {
		fetchWeather(lat, long, '', 'latlong')
	}
	weatherIconHtml.src = weatherData.img
	weatherDescHtml.textContent = weatherData.str
	descHtml.style.display = 'flex'
}

function setTimeHtml() {
	let time = new Date()
	let hour
	let month
	let date
	let year
	let timeStr

	hour = time.getHours()
	month = time.getMonth()
	date = time.getDate()
	year = time.getYear()

	timeStr = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', month: 'long', day: '2-digit', year: 'numeric', hour12: true });

	timeHtml.textContent = timeStr

	return time
}

function setAudio(time) {
	fetchBGMJSON().then(bgm => {
		let keys = Object.keys(bgm)
		for (let i = 0; i < keys.length; i++) {
			if (bgm[keys[i]].hour == time.getHours()) {
				let weatherBGM = determineWeather()
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
	if (queryType == 'city') {
		endpoint = `https://api.weatherbit.io/v2.0/current?city=${city}&units=I&key=e0c580a040dd46a0829e6bf541d02ce4`
	} else if (queryType == 'latlong') {
		endpoint = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${long}&units=I&key=e0c580a040dd46a0829e6bf541d02ce4`
	}
	response = await fetch(endpoint)
	weather = await response.json().then(info => {
		let data = info['data'][0]
		weatherData = {
			'lat': data.lat,
			'long': data.lon,
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
	locationForm.reset()
}

function formatWeather(data) {
	weatherData = {
		'lat': data.lat,
		'long': data.lon,
		'city': data.city_name,
		'state': data.state_code,
		'country': data.country_code,
		'temp': data.temp,
		'desc': data.weather.description,
		'img': `https://www.weatherbit.io/static/img/icons/${data.weather.icon}.png`,
		'code': data.weather.code,
		'str': `In ${this.city}, it's ${this.temp}°F. There might be ${this.desc}.`
	}
}

//setInterval(checkGeolocation, 1000)

function geocodeLatLng(geocoder, map, infowindow) {
	// const input = document.getElementById("latlng").value;
	// const latlngStr = input.split(",", 2);
	// const latlng = {
	// 	lat: parseFloat(latlngStr[0]),
	// 	lng: parseFloat(latlngStr[1]),
	// };
	geocoder.geocode({ location: latlng }, (results, status) => {
		if (status === "OK") {
			for (var i = 0; i < results.length; i++) {
				if (results[i].types[0] == 'administrative_area_level_1') {
					console.log(results[i].formatted_address)
				}
			}

			if (results[0]) {
				map.setZoom(11);
				const marker = new google.maps.Marker({
					position: latlng,
					map: map,
				});
				infowindow.setContent(results[0].formatted_address);
				infowindow.open(map, marker);
			} else {
				window.alert("No results found");
			}
		} else {
			window.alert("Geocoder failed due to: " + status);
		}
	});
}

window.addEventListener('load', checkGeolocation)
locationForm.addEventListener('submit', (e) => {
	e.preventDefault()
	inputBool = true
	setHtml(e)
})

setInterval(setTimeHtml, 1000)

// window.addEventListener('load', checkGeolocation);//Check if browser supports W3C Geolocation API

// window.addEventListener('load', doStuff)
