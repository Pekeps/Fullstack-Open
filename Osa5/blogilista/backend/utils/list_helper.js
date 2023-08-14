const lodash = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1

const totalLikes = (array) => {
  const likesArray = array.map((blog) => blog.likes)
  const reducer = (sum, item) => sum + item
  return likesArray.reduce(reducer, 0)
}

const mostLikes = (array) => {
  if (array.length === 0) {
    return null
  }

  const blogWithMostLikes = array.reduce((compare, item) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    (compare.likes > item.likes ? compare : item), array[0])
  return {
    title: blogWithMostLikes.title,
    author: blogWithMostLikes.author,
    likes: blogWithMostLikes.likes,
  };
}

const mostBlogs = (array) => {
  if (array.length === 0) {
    return null
  }

  const authorBlogs = lodash.countBy(array, 'author')

  const authorWithMostBlogs = lodash.maxBy(
    Object.keys(authorBlogs),
    (author) => authorBlogs[author],
  )
  return {
    author: authorWithMostBlogs,
    blogs: authorBlogs[authorWithMostBlogs],
  }
}

const authorMostLikes = (array) => {
  if (array.length === 0) {
    return null
  }

  const groupedByAuthor = lodash.groupBy(array, 'author')

  const authorLikes = lodash.mapValues(groupedByAuthor, (authorBlogs) => lodash.sumBy(authorBlogs, 'likes'))

  const authorWithMosLikes = lodash.maxBy(
    Object.keys(authorLikes),
    (author) => authorLikes[author],
  )

  return {
    author: authorWithMosLikes,
    likes: authorLikes[authorWithMosLikes],
  }
}

module.exports = {
  dummy,
  totalLikes,
  mostLikes,
  mostBlogs,
  authorMostLikes,
}
