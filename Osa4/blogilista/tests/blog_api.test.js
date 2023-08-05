const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blogs')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs have id identifier', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  blogs.forEach((blog) => {
    expect(blog.id).toBeDefined()
  });
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map((r) => r.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(titles).toContain('React patterns')
})

test('no likes given defaults 0', async () => {
  const newBlog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    __v: 0,
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const addedBlog = response.body
  expect(addedBlog.likes).toEqual(0)
})

test('cannot post blog with no title or url', async () => {
  const noTitle = {
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    __v: 0,
  }
  const noUrl = {
    title: 'React patterns',
    author: 'Michael Chan',
    __v: 0,
  }

  await api
    .post('/api/blogs')
    .send(noTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(noUrl)
    .expect(400)
})

afterAll(async () => {
  await mongoose.connection.close()
})
