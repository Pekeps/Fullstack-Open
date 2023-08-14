const bcrypt = require('bcrypt')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'heikkiHH',
      name: 'Heikki Hanhirova',
      password: 'palis',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken or username/pw is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }
    const shortUser = {
      username: 'rt',
      name: 'Superuser',
      password: 'salainen',
    }
    const badPw = {
      username: 'badpassword',
      name: 'Superuser',
      password: '42',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const result1 = await api
      .post('/api/users')
      .send(shortUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result1.body.error).toContain('is shorter than the minimum allowed length (3)')

    const result2 = await api
      .post('/api/users')
      .send(badPw)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result2.body.error).toContain('Password must be at least 3 characters')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})
