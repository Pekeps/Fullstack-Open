import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const removePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

const changeNumber = ({ id, person }) => {
  console.log(id, person)
  return axios.put(`${baseUrl}/${id}`, person)
}


export default { getAll, create, removePerson, changeNumber  }