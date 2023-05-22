import axios from 'axios'
import {useState, useEffect} from 'react'

const CountrySearch = ({ newFilter, handleFilterChange }) => {
  return (
  <form>
  <div>
    find countries
    <input
      value={newFilter}
      onChange={handleFilterChange}
    />
  </div>
</form>
  )
}

const CountryList = ({ countriesToShow, countries, handleClick }) => {
  if (countriesToShow.length <= 10) {
    return(
      <ul>
        {countriesToShow.map(country =>
          <li key={country.capital}>
            {country.name.common}
            <button  onClick={() =>handleClick({ name:country.name })}>
              show
            </button>
          </li>
        )}
      </ul>
   )
 }
}

const LanguageList = ({ languages }) => {
  return(
    <ul>
      {Object.values(languages).map(language =>
        <li key={Math.random()}>
          {language}
        </li>
        )}
    </ul>
  )
}

const CountryInformation = ({ countriesToShow }) => {
 if (countriesToShow === null) {
    return null
  }

const country = countriesToShow[0]

return(
    <>
    <h1>{country.name.common}</h1>
    <p>capital: {country.capital}</p>
    <p>area: {country.area}</p>
    <h3>languages:</h3>
    <LanguageList languages={country.languages} />
    <img src={country.flags.png} />
    </>
  )
}

const Weather = ({ weather, country }) => {
  if (weather !== null) {
  return(
    <>
    <p>temperature {weather.current.temp_c} Celcius</p>
    <img src={weather.current.condition.icon} />
    <p>wind {weather.current.wind_kph} km/h</p>
    </>
  )
  }
}


const App = () => {

  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [countryToDisplay, setCountryToDisplay] = useState(null)
  const [weather, setWeather] = useState(null)
  
  const apiKey = process.env.REACT_APP_API_KEY
  const baseUrl = 'http://api.weatherapi.com/v1/current.json?key='

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

   
  const countriesToShow = countries.filter(country => 
    country.name.common.toLowerCase().includes(newFilter.toLowerCase()))

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleClick = ({ name }) => {
    const country = countries.filter(country =>
      country.name.common === name.common)
    setCountryToDisplay(country)
    
    
    axios
      .get(`${baseUrl}${apiKey}&q=${country[0].capital}`)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.log(error.response.data)
    })

    }

    console.log(weather)
  return (
    <div>

      <CountrySearch newFilter={newFilter}
      handleFilterChange={handleFilterChange}
      />

      <CountryList countriesToShow={countriesToShow} 
      countries={countries}
      handleClick={handleClick}
      />

      <CountryInformation countriesToShow={countryToDisplay} />

      <Weather weather={weather} />
    </div>
  )

}

export default App
