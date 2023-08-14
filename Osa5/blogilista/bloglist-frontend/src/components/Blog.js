import Togglable from "./Toggleble"

const Blog = ({ blog, updateBlog, deleteBlog, isCreator }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
  <div style={blogStyle}>
    {blog.title} {blog.author}
    <Togglable buttonLabel="view">
      {blog.url} <br />
      {blog.likes}
      <button onClick={updateBlog}>like</button> <br />
      {blog.name} <br />
      {isCreator && <div><button onClick={deleteBlog}>remove</button></div>}

    </Togglable>
  </div>  
  )
  }

export default Blog