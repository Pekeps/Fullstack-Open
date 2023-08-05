const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

blogsRouter.get('/blogs', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/blogs', async (request, response) => {
  const { title, author, url } = request.body
  const likes = request.body.likes !== undefined ? request.body.likes : 0

  const blog = new Blog({
    title,
    author,
    url,
    likes,
  })

  try {
    const result = await blog.save()
    response.status(201).json(result)
  } catch (error) {
    if (error.name === 'ValidationError') {
      response.status(400).json({ error: error.message })
    } else {
      response.status(500).json({ error: 'An error occurred while creating the blog.' })
    }
  }
})

blogsRouter.delete('/blogs/:id', async (request, response) => {
  const result = await Blog.findByIdAndRemove(request.params.id)
  response.status(204).json(result)
})

blogsRouter.put('/blogs/:id', async (request, response) => {
  const { title, author, url } = request.body
  const likes = request.body.likes !== undefined ? request.body.likes : 0

  const result = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      title, author, url, likes,
    },
    { new: true, runValidators: true, context: 'query' },
  )
  response.status(200).json(result)
})

module.exports = blogsRouter
