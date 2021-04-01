/*
	Animal Crossing BGM IRL
	Author: Geraldine | https://geraldiner.com

	Listen to the Animal Crossing hourly background music (BGM) in real life (IRL) based on *your* local time and weather. Chill lo-fi music for study/sleep/relaxation.

	### Functionality
	- For viewers who'd like to be more private, they could enter their location info manually instead of allowing the site to access it. This would mean more cases to account for.
	- On the same note, I don't think it's necessary to update the weather info as frequently as the time (ie. every minute/second vs every hour, respectively), so I could make use of localStorage somehow.

	### Time-related
	- The time doesn't actually update - it's stuck at the exact moment the viewer enters the site and then never updates again.
	- Displaying the full day and date might be more helpful because it has more information.

	### Design
	- Maybe using a framework like Bootstrap will give it a nice clean look.
	- Having a cool background image would be nice, something either related to the location, weather, Animal Crossing or some combination.

	### Would be nice
	- For weather conditions like rain or snow, it would be cool to have actual weather sounds. Or maybe even sliders for ambient noises that the viewer could control and make it their own.
*/

let timeHtml = document.querySelector('#time') // where to display the time

let lat
let long

//const weatherData = JSON.parse(localStorage.getItem("weatherData")) || {}};

function checkGeolocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
	}
}

//Get latitude and longitude;
function successFunction(position) {
	lat = position.coords.latitude;
	long = position.coords.longitude;
	setHtml(lat, long)
}

function errorFunction(e) {
	console.log(e)
}

function setHtml(lat, long) {
	let hTime = document.querySelector('#time')
	let pLoc = document.querySelector('#location')
	let audio = document.querySelector('#audio')
	let source = document.querySelector('#audioSource');

	console.log(lat + "," + long)
	let time = new Date()
	let hour = time.getHours()
	let month = time.getMonth()
	let date = time.getDate()
	let year = time.getYear()

	let timeStr = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });

	hTime.textContent = timeStr

	fetchWeather(lat, long, "", 'latlong').then(weather => {
		let data = weather['data'][0]
		let city = data.city_name
		let state = data.state_code
		let country = data.country_code
		let temp = data.temp
		let desc = data.weather.description
		let icon = data.weather.icon
		let code = data.weather.code
		pLoc.textContent = `In ${city}, ${state}, ${country}, it is ${temp}°F. There might be ${desc}.`
		let img = document.createElement('img')
		img.src = `https://www.weatherbit.io/static/img/icons/${icon}.png`
		pLoc.appendChild(img)
	})

	fetchBGMJSON().then(bgm => {
		let keys = Object.keys(bgm)
		for (let i = 0; i < keys.length; i++) {
			if (bgm[keys[i]].hour == hour) {
				console.log(bgm[keys[i]])
				source.src = bgm[keys[i]].music_uri
				audio.load()
				//audio.play()
			}
		}
	})
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
	if (queryType == 'city') {
		endpoint = `https://api.weatherbit.io/v2.0/current?city=${city}&units=I&key=e0c580a040dd46a0829e6bf541d02ce4`
	} else if (queryType == 'latlong') {
		endpoint = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${long}&units=I&key=e0c580a040dd46a0829e6bf541d02ce4`
	}
	response = await fetch(endpoint)
	weather = await response.json()
	return weather
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

function doStuff() {
	let hTime = document.querySelector('#time')
	let pLoc = document.querySelector('#location')
	let audio = document.querySelector('#audio')
	let source = document.querySelector('#audioSource');
	let cityInput
	const btn = document.querySelector('#btn')
	let locInput = document.querySelector('#city')
	btn.addEventListener('click', () => {
		console.log("HI")
		cityInput = locInput.value
		locInput.value = ''
		console.log(cityInput)
		fetchWeather("", "", cityInput, 'city').then(weather => {
			let data = weather['data'][0]
			let city = data.city_name
			let state = data.state_code
			let country = data.country_code
			let temp = data.temp
			let desc = data.weather.description
			let icon = data.weather.icon
			let code = data.weather.code
			pLoc.textContent = `In ${city}, ${state}, ${country}, it is ${temp}°F. There might be ${desc}.`
			let img = document.createElement('img')
			img.src = `https://www.weatherbit.io/static/img/icons/${icon}.png`
			pLoc.appendChild(img)
		})
	})
}

window.addEventListener('load', checkGeolocation);//Check if browser supports W3C Geolocation API

window.addEventListener('load', doStuff)
