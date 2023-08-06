const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blogs')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

require('express-async-errors')

blogsRouter.get('/blogs', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/blogs',  userExtractor, async (request, response) => {
  const { title, author, url } = request.body
  const likes = request.body.likes !== undefined ? request.body.likes : 0

  const user = await User.findById(request.user)

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
  })
 
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)
})

blogsRouter.delete('/blogs/:id', userExtractor, async (request, response) => {

  
  const blog = await Blog.findById(request.params.id)
  if ( request.user === blog.user.toString() ) {
    const result = await Blog.findByIdAndRemove(request.params.id)
  response.status(204).json(result)
  }
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
