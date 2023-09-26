import { useEffect, useState } from 'react'
import './App.css'
import Spinner from './components/Spinner'

function App() {
  const [lat, setLat] = useState([])
  const [long, setLong] = useState([])
  const [weatherData, setWeatherData] = useState([])

  //https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

  useEffect(() => {
    async function fetchWeather() {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude)
        setLong(position.coords.longitude)
      })
      console.log('before fetch: ' + lat, long)

      if (lat.length === 0 || long.length === 0) {
        return
      }

      const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
      await fetch(`${baseUrl}lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)

        .then(res => res.json())
        .then(result => {
          console.log(result)
          setWeatherData(result)
        }).catch(err => {
          console.log(err)
        })
    }
    fetchWeather()
  }, [lat, long])

  return (
    <>
      <h1>Darth Väder</h1>
      {weatherData.main ? (
        <>
          <h2>City: {weatherData.name}</h2>
          <h2>Temperature: {(weatherData.main.temp - 273.15).toFixed(2)} C</h2>
          <h2>Weather: {weatherData.weather[0].main}</h2>
        </>
      ) : (
        <Spinner />
      )}
    </>
  )
}
/*
      <h2>(data.name)</h2>
      <h2>Temperature: (data.main.temp)</h2>*/

export default App
