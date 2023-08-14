const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blogs')

describe('when there is initially some blogs saved', () => {
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
  test('deleting a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map((r) => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })

  test('updating blog information', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      title: 'Updated Title',
      id: blogToUpdate.id,
      author: 'Updated Author',
      url: 'https://updated-url.com/',
      likes: 111111110,
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    expect(response.body).toEqual(updatedBlog)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlogInDb = blogsAtEnd.find((b) => b.id === blogToUpdate.id)

    expect(updatedBlogInDb).toEqual(updatedBlog)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
