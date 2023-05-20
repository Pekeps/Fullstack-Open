import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Notification = ({ message }) => {
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  
  if (message === null) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  
  if (message === null) {
    return null
  }

  return (
    <div style={errorStyle}>
      {message}
    </div>
  )
}

const Filter = ({ newFilter, handleFilterChange }) => {
  return (
  <form>
  <div>
    filter shown with 
    <input
      value={newFilter}
      onChange={handleFilterChange}
    />
  </div>
</form>
  )
}

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
        <div>
          name:
          <input
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          number:
          <input
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({ personsToShow, handleClick }) => {
  return(
    <ul>
        {personsToShow.map(person =>
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() =>handleClick({ id:person.id, name:person.name })}>
              delete
            </button>
          </li>
        )}
      </ul>
  )
}
const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const findIdByName = (name) => {
    const findId = persons.find(x => x.name === name)
    return findId.id
  }
  const personsToShow = persons.filter(person =>
     person.name.toLowerCase().includes(newFilter.toLowerCase()));
    
  
  
  const addPerson = (event) => {
    event.preventDefault()
    const person = {
      name: newName,
      number: newNumber
    }
    if (persons.some(e => e.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        console.log(findIdByName(newName))
        personService
          .changeNumber({ id:findIdByName(newName), person:person})
          .then(response => {
            setPersons(persons.map(person => person.id !== findIdByName(newName) ? person : response.data))
            setNotificationMessage(
              `changed ${newName} number to ${newNumber}`
            )
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(
              `Information of ${newName} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }

    } else {
      personService
        .create(person)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNotificationMessage(
            `Added ${newName}`
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
          setNewNumber('')
          setNewName('')
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }
  console.log(persons.id)

  const handleClick = ({ id, name }) => {
    if (window.confirm(`Do you want to delete ${name}`)) {
      personService
      .removePerson(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id ))
        setNotificationMessage(
          `Removed ${name}`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })}
    }


  return (
    <div>
      <h1>phonebook</h1>

      <Notification message={notificationMessage} />
      <Error message={errorMessage} />

      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />

      <h2>add a new</h2>

      <PersonForm addPerson={addPerson} newName={newName} handleNameChange
      ={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}  />
      
      <h2>Numbers</h2>
      
      
      <Persons
        personsToShow={personsToShow}
        handleClick={handleClick}
      />
    </div>
  )

}

export default App