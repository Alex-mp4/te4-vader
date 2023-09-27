import { useEffect, useState } from 'react'
import './App.css'
import Spinner from './components/Spinner'

function App() {
  const [lat, setLat] = useState([])
  const [long, setLong] = useState([])
  const [weatherData, setWeatherData] = useState([])

  const quotes = [{ "id": 1, "text": "Luke Skywatcher" }, { "id": 2, "text": "Mother Nature strikes back" }, { "id": 3, "text": "Weather report more accurate than a stormtrooper" }, { "id": 4, "text": "Now comes our forcecast" }]
  let randomQuoteInt = Math.floor(Math.random() * quotes.length)
  let shownQuote = quotes[randomQuoteInt].text

  //https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

  useEffect(() => {
    async function fetchWeather() {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude)
        setLong(position.coords.longitude)
      })
      console.log('before fetch: ' + lat, long)

      if (lat.length === 0 || long.length === 0) {
        console.log("Could not get data")
        return
      }
      else if (lat == localStorage.getItem("lat") && long == localStorage.getItem("long") && new Date().getTime() < JSON.parse(localStorage.getItem("weatherDataLocal")).newDataIn) {
        console.log("Getting data from Local Storage")
        setWeatherData(JSON.parse(localStorage.getItem("weatherDataLocal")).value)
      }
      else {
        console.log("Getting data from API")
        const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
        await fetch(`${baseUrl}lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)

          .then(res => res.json())
          .then(result => {
            console.log(result)
            setWeatherData(result)
            const weatherDataLocal = {
              value: result,
              newDataIn: new Date().getTime() + 300000
            }
            localStorage.setItem("lat", lat);
            localStorage.setItem("long", long);
            localStorage.setItem("weatherDataLocal", JSON.stringify(weatherDataLocal));
          }).catch(err => {
            console.log(err)
          })
      }
    }
    fetchWeather()
  }, [lat, long])

  return (
    <>
      <h1>Darth Väder</h1>
      <p>{shownQuote}</p>
      <div className='container'>
        {weatherData.main ? (
          <>
            <h2>City: {weatherData.name}</h2>
            <h2>Temperature: {(weatherData.main.temp - 273.15).toFixed(2)} C</h2>
            <h2>Weather: {weatherData.weather[0].main}</h2>
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </>
  )
}
/*
      <h2>(data.name)</h2>
      <h2>Temperature: (data.main.temp)</h2>*/

export default App
