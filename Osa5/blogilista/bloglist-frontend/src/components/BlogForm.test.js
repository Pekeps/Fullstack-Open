import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> returns posted blog', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  render(<BlogForm createBlog={createBlog} />)

  const input = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('submit')

  await user.type(input[0], 'title')
  await user.type(input[1], 'author')
  await user.type(input[2], 'url')
  await user.click(sendButton)

  const expectedObject = {
    title: 'title',
    author: 'author',
    url: 'url'
  }

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual(expectedObject)
})