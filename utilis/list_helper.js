var lodash = require('lodash')

const initalBlogs =[
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    }
   ]

const dummy = (blog) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum += blog.likes;
    }

    return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if(blogs.length === 0){
        return 0
    }

    let max = {
        title: blogs[0].title,
        author: blogs[0].author,
        likes: blogs[0].likes,
    }

    blogs.forEach(blog => {
        blog.likes >= max.likes
        max = {
            title: blog.title,
            author: blog.author,
            likes: blog.likes,
        }
    });

    return max
}

const mostBlogs = (blogs) => {
   const result = lodash.countBy(blogs, (blog) => blog.author)
   const res = []
   for (const [key, value] of Object.entries(result)) {
    res.push(value)
  }
  const max = Math.max(...res)

  let author
  for (const [key, value] of Object.entries(result)) {
    if (value === max) {
        author = key
    }
  }

  const resp = {
    "author": author,
    "blogs": max
  }
 
  return resp
}

const mostLikes = (blogs) => {
    const maxLikes = Math.max(...blogs.map(blog => blog.likes))

    let author
    blogs.forEach( (blog) => {
        if(blog.likes === maxLikes){
            author = blog.author
        }
     })
    
    const result = {
        "author": author,
        "likes": maxLikes
    }
   
    return result
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    initalBlogs
}

