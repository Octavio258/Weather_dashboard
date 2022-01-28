const search = document.querySelector("#search-bar")
const findWeather = document.querySelector("#Clicker")
const weatherToday = document.querySelector("#inputSearch")
const currentForecast = document.querySelector("#currentWeather")
const futureForecast = document.querySelector("#forecast")
const previousSearch = document.querySelector("#history")
const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || []

function getWeather(cityName) {
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`

    fetch(weatherApi)
    .then((data) => data.json())
    .then((newData) => {
        console.log(newData)
        let lat = newData.coord.lat
        let lon = newData.coord.lon
        const forecastApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&${API_KEY}`
        fetch(forecastApi)
        .then((data)=> data.json())
        .then((newData) => {
            console.log(newData)
            TodaysWeather(newData)
            futureForecast.innerHTML = '';
            for (let i = 0; i < 6; i++) {
                renderSingleDay(newData.daily[i])
            }
        })
    })
}

function TodaysWeather(weather) {
    currentForecast.innerHTML = ''
    let card = document.createElement('div')
    let temp = document.createElement('h3')
    let windSpeed = document.createElement('h5')
    let uv = document.createElement('h4')
    let icon = document.createElement('img')

    temp.innerText =   `Temperature: ${weather.current.temp}*F`
    windSpeed.innerText = `Wind Speed: ${weather.current.wind_speed} mph`
    humid.innerText = `Humidity: ${weather.current.humidity} %`
    uv.innerText = `UV Index: ${weather.current.uvi} `
    icon.setAttribute("src", `http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png` )

    currentForecast.append(temp, windSpeed, humid, uv, icon)
    card.append(temp, windSpeed, humid, uv, icon)

    card.classList = 'weather-currently'

    currentForecast.append(card)
};

function renderSingleDay(singleDayData) {
    let card = document.createElement("div")
    let date = document.createElement("h3")
    let icon = document.createElement('img')
    let temp = document.createElement("h4")
    let wind = document.createElement("h5")
    let humid = document.createElement("h5")
     
    icon.setAttribute("src", `http://openweathermap.org/img/wn/${singleDayData.weather[0].icon}@2x.png` )
    temp.innerText = `Tempurature: ${singleDayData.temp.day}°F`
    wind.innerText = `Wind Speed: ${singleDayData.wind_speed} mph`
    humid.innerText = `Humidity: ${singleDayData.humidity} %`


    date.innerText = `Date: ${neat(singleDayData.dt)}`
    card.append(date,temp, wind, humid, icon)
    
    card.classList = "background-blue"

    futureForecast.append(card)
}

function neat(dt) {
    let date = new Date(dt*1000)
    let year = date.getFullYear()
    let month = date.getMonth() +1
    let day = date.getDate()
    return `${month}-${day}-${year}`
}

function displayRecentSearches(searchArray){
    previousSearch.innerHTML = "<h3>Recent Searches:</h3>"
    let five = searchArray.slice(searchArray.length - 5)
    if(searchArray.length > 5){
       let five = searchArray.slice(searchArray.length - 5)
       five.forEach(city => {
           let cityName = document.createElement("h3")
           cityName.innerHTML = city
           previousSearch.append(cityName)       
       });
   }else{
       searchArray.forEach(city => {
           let cityName = document.createElement("h3")
           cityName.innerHTML = city
           previousSearch.append(cityName)
       });
   }
    
}
findWeather.addEventListener("click", (event) => {
    event.preventDefault()
    const newCityName = weatherToday.value
    recentSearches.push(newCityName)
    displayRecentSearches(recentSearches)
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches))
    console.log(newCityName)
    getWeather(newCityName)
})

displayRecentSearches(recentSearches);