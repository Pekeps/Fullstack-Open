import React from 'react'
import '@testing-library/jest-dom/'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'minä',
    likes: 0,
    url: 'htpspsah'

  }

  render(<Blog key={blog.likes} blog={blog} />)

  const element = screen.findByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})

test('clicking view button shows all information', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'minä',
    likes: 0,
    url: 'htpspsah'

  }

  render(<Blog key={blog.likes} blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const url = screen.findByText('htpspsah')
  expect(url).toBeDefinded
})

test('liking a blog two times returns two eventhandlers', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'minä',
    likes: 0,
    url: 'htpspsah'

  }

  const mockHandler = jest.fn()

  render(<Blog key={blog.likes} blog={blog} updateBlog={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})



