/*

	Animal Crossing BGM IRL
	Author: Geraldine | https://geraldiner.com

	Listen to the Animal Crossing hourly background music (BGM) in real life (IRL) based on *your* local time and weather. Chill lo-fi music for study/sleep/relaxation.

*/

// Get keys
import apikeys from './apikeys.js'


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

const coordinates = JSON.parse(localStorage.getItem("coordinates")) || {}
const hourData = JSON.parse(localStorage.getItem("hourData")) || 0
const weatherData = JSON.parse(localStorage.getItem("weatherData")) || {}
const bgImgData = JSON.parse(localStorage.getItem("bgImgData")) || {}

// functions
function checkGeolocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
	} else {
		alert("This browser doesn't support Geolocation.")
	}
}

function successFunction(position) {
	const coords = {
		'lat': position.coords.latitude,
		'long': position.coords.longitude
	}
	setHtml(coords)
	localStorage.setItem("coordinates", JSON.stringify(coords))
}

function errorFunction() {
	alert("Please allow location access to continue.")
}

function setHtml(coords) {
	if (!weatherData.lat) {
		setWeatherHtml(coords)
	}
}

function setWeatherHtml(coords) {
	fetchWeather(coords)

}

function setBackgroundHtml(city) {
	fetchPhoto(city)
		.then(info => {
			let data = info.results[0]
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
			localStorage.setItem("bgImgData", JSON.stringify(bgImgInfo))
		})
}

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

	localStorage.setItem("hourData", JSON.stringify(hour))

	if (hour !== hourData) {
		localStorage.setItem("hourData", JSON.stringify(hour))
		setWeatherHtml(coordinates)
	}
	return time
}

function setAudio(time, weatherDesc) {
	fetchBGMJSON().then(bgm => {
		let keys = Object.keys(bgm)
		for (let i = 0; i < keys.length; i++) {
			if (bgm[keys[i]].hour == hourData) {
				let weatherBGM = determineWeather(weatherDesc)
				if (weatherBGM == bgm[keys[i]].weather) {
					audioSource.src = bgm[keys[i]].music_uri
					audioHtml.load()
					audioPlayer.style.display = 'block'
					audioHtml.play()
				}
			}
		}
	})
}

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


// async functions
async function fetchWeather(coords) {
	let endpoint = `https://api.weatherbit.io/v2.0/current?lat=${coords.lat}&lon=${coords.long}&units=I&key=${apikeys.WEATHER_API_KEY}`
	try {
		const weatherStream = await fetch(endpoint)
		const weatherJson = await weatherStream.json()
			.then(info => {
				let data = info['data'][0]
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
				let time = setTimeHtml()
				setAudio(time, weatherInfo.desc)
				setBackgroundHtml(weatherInfo.city)
				localStorage.setItem("weatherData", JSON.stringify(weatherInfo))
			})
	} catch (err) {
		return { Error: err.stack }
	}
}

async function fetchPhoto(city) {
	let endpoint = `https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=${apikeys.UNSPLASH_ACCESS_KEY}&orientation=landscape`
	endpoint = endpoint.replace(/\s/g, "%20")
	try {
		let photoStream = await fetch(endpoint)
		let photoJson = await photoStream.json()
		return photoJson
	} catch (err) {
		return { Error: error.stack }
	}
}

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
2. get the time from the viewer - date object
3. get the weather from the viewer based on the coordinates
4. get a related image based on the location of the viewer
5. get the audio based on the time & weather
6. place everything in the dom
- display date & time every second
- diplay background image
- start playing audio


async function fetchTime(time, timestamp) {
	let endpoint = `https://maps.googleapis.com/maps/api/timezone/json?location=${weatherData.lat},%20${weatherData.long}&timestamp=${timestamp}&key=AIzaSyAM_a6zpQL7fYCeqvSXMnK0-wOpdXBqizM`
	let localTime

	const response = await fetch(endpoint)
	const timeInfo = await response.json()
	return timeInfo
}
*/