console.log('this is main.js file')

var formElement = document.querySelector('#location-form')
var submitBtnElement = document.querySelector('#submit')
var btnWrapperElement = document.querySelector('.btn-wrapper')
var currentWeatherWrapperElement = document.querySelector('.current-wrapper')
var currentWeatherBtnElement = document.querySelector('#current-weather')
var currentCityElement = document.querySelector('#current-city')
var currentDateElement = document.querySelector('#current-date')
var currentTempElement = document.querySelector('#current-temp')
var currentHumElement = document.querySelector('#current-hum')
var currentWindElement = document.querySelector('#current-wind')
var currentWeatherIconElement = document.querySelector('#current-weather__icon')
var futureWeatherWrapperElement = document.querySelector('.future-wrapper')
var futureWeatherBtnElement = document.querySelector('#future-weather')
var historyElement = document.querySelector('#history')


var tempCity

async function handleSubmit(event) {
    event.preventDefault()

    var city = event.target.elements['city'].value
    var state = event.target.elements['state'].value

    try {
        var foundCity = await fetchWeather(city, state)

        localStorage.setItem(`${city}`, JSON.stringify(foundCity))


    } catch (err) {
        console.error('There was an ERROR within our handle submit function', err)
    }

    tempCity = city

    event.target.reset()

    btnWrapperElement.style.display = 'flex'

    displayHistory()
}


function showCurrentWeather() {
    if (tempCity) {
        futureWeatherWrapperElement.style.display = 'none'
        currentWeatherWrapperElement.style.display = 'flex'

        var latestCity = JSON.parse(localStorage.getItem(`${tempCity}`))

        var weatherIcon = latestCity.list[0].weather[0].icon
        var city = latestCity.city.name
        var date = new Date(latestCity.list[0].dt_txt).toDateString()
        var temp = latestCity.list[0].main.temp
        var hum = latestCity.list[0].main.humidity
        var wind = latestCity.list[0].wind.speed

        currentWeatherIconElement.src = `http://openweathermap.org/img/wn/${weatherIcon}.png`
        currentCityElement.innerText = `City: ${city}`
        currentDateElement.innerText = `Date: ${date}`
        currentTempElement.innerText = `Tempurature is: ${Math.floor(temp)}°F`
        currentHumElement.innerText = `Humidity is: ${hum}%`
        currentWindElement.innerText = `Wind Speed is: ${wind}mph`

        console.log('this is our temp city value', tempCity)
        console.log('this is our city from local storage', latestCity)
    }

}

function showFutureWeather() {

    if (tempCity) {
        futureWeatherWrapperElement.innerHTML = ''

        currentWeatherWrapperElement.style.display = 'none'

        futureWeatherWrapperElement.style.display = 'flex'

        var latestCity = JSON.parse(localStorage.getItem(`${tempCity}`))

        for (var index = 0; index < latestCity.list.length; index++) {
            if ((new Date(latestCity.list[index].dt_txt).toTimeString()).includes('00:00:00')) {

                var liElement = document.createElement('li')

                var html = `
                <img src="http://openweathermap.org/img/wn/${latestCity.list[index].weather[0].icon}.png" alt="Weather Icon" id="future-weather__icon" width="100" height="100">
                <h2 id="future-city">City: ${latestCity.city.name}</h2>
                <h3 id="future-date">Date: ${new Date(latestCity.list[index].dt_txt).toDateString()}</h3>
                <p id="future-temp">Tempurature is: ${Math.floor(latestCity.list[index].main.temp)}°F</p>
                <p id="future-hum">Humidity is: ${latestCity.list[index].main.humidity}%</p>
                <p id="future-wind">Wind Speed is: ${latestCity.list[index].wind.speed}mph</p>
            `
                liElement.innerHTML = html
                futureWeatherWrapperElement.append(liElement)
            }
        }
    }

}


async function fetchWeather(city, state) {
    try {
        var response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city},${state}&units=imperial&appid=728f9697e2ac316640bb1695d39a335b`)

        var data = await response.json()

        return data

    } catch (err) {
        console.error('There was an ERROR within our FETCH request', err)
    }
}

function displayHistory() {
    if(localStorage.length > 0) {
        historyElement.innerHTML = ''
        for(var index = 0; index < localStorage.length; index++) {
            var liElement = document.createElement('li')
    
            var html = `
            <span onClick="handleHistory(this)">${localStorage.key(index)}</span>
        `
            liElement.innerHTML = html
            historyElement.append(liElement)
        }
    }    
}

function handleHistory(element) {
    tempCity = element.innerText
    btnWrapperElement.style.display = 'flex'
    currentWeatherWrapperElement.style.display = 'none'
    futureWeatherWrapperElement.style.display = 'none'
}



displayHistory()

formElement.addEventListener('submit', handleSubmit)
currentWeatherBtnElement.addEventListener('click', showCurrentWeather)
futureWeatherBtnElement.addEventListener('click', showFutureWeather)