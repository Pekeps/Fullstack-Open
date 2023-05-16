import { useState, useEffect } from 'react'
import axios from 'axios'

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

const Persons = ({ personsToShow }) => {
  return(
    <ul>
        {personsToShow.map(person =>
          <li key={person.name}>{person.name} {person.number}</li>
        )}
      </ul>
  )
}
const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  })
  
  const personsToShow = persons.filter(person =>
     person.name.toLowerCase().includes(newFilter.toLowerCase()));
  
  console.log(Object.values(persons))
  const addPerson = (event) => {
    console.log('adding person')
    event.preventDefault()
    const person = {
      name: newName,
      number: newNumber
    }
    if (persons.some(e => e.name === newName)) {
      alert(`${newName} is already added to phonebook`)

    } else {
      setPersons(persons.concat(person))
      setNewName('')
      setNewNumber('')
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

  return (
    <div>
      <h1>phonebook</h1>

      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />

      <h2>add a new</h2>

      <PersonForm addPerson={addPerson} newName={newName} handleNameChange
      ={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}  />
      
      <h2>Numbers</h2>
      
      <Persons personsToShow={personsToShow} />
    </div>
  )

}

export default App