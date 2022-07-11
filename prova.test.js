const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('./app')
const listHelper = require('./utilis/list_helper').dummy
const likeHelper = require('./utilis/list_helper').totalLikes
const favoriteBlog = require('./utilis/list_helper').favoriteBlog
const mostBlogs = require('./utilis/list_helper').mostBlogs
const mostLikes = require('./utilis/list_helper').mostLikes
const Blog = require('./models/bloglist')
const bloglists = require('./utilis/list_helper').initalBlogs

const api = supertest(app)

 beforeEach(async () =>{
   await Blog.deleteMany({})
   const bloglist = bloglists.map(blog => new Blog(blog))
   const promiseBlogs = bloglist.map(blog => blog.save())
   await Promise.all(promiseBlogs)

 })

test('invalid token', async () => {
  const blog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
  await api.post('api/blogs')
    .send(blog)
    .expect(401)
})

test('invalid user', async() => {
  const newUser = {
    username: "Geech",
    name: "boh",
    password: "14059298"
  }

  await api.post('/api/users')
    .send(newUser)
    .expect(400)
})

test('invalid password', async() => {
  const newUser = {
    username: "Pino",
    name: "boh",
    password: "az"
  }

  await api.post('/api/users')
    .send(newUser)
    .expect(400)

})

test('Changing likes', async ()=> {
  const noteAtStart = bloglists
  const noteToUpdate = noteAtStart[0]

  const update = {
    likes: 40
  }
  
  const res = await api.put(`/api/blogs/${noteToUpdate._id}`).send(update)
 
  expect(res.body.likes).toBe(40)

})

test('Delete call', async ()=> {
  const noteAtStart = bloglists
  const noteToDelete = noteAtStart[0]
 
  await api.delete(`/api/blogs/${noteToDelete._id}`)
  .expect(204)

  const current = await api.get('/api/blogs')
  expect(current.body).toHaveLength(noteAtStart.length - 1)
  expect(current.body).not.toContain(noteToDelete)
})

test('Bad request url/title', async ()=> {
  const newBlog = 
  {
    _id: "5a422a851b54a676234d17f7",
    author: "Michael Chan",
    __v: 0
  }
  
  await api.post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('default likes 0', async () => {
  if(!bloglists[1].hasOwnProperty('likes')){
    const resp = await api.get('/api/blogs')
    console.log(resp.body)

    expect(resp.body[1].likes).toBe(0)
  }
})

test('Control id', async () => {
  const resp = await api.get('/api/blogs')

  resp.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

test('Get api', async () => {
  const resp = await api.get('/api/blogs')
  
  expect(resp.body).toHaveLength(3)
})

test('Dummy return 1', () => {
    const blogs = []
    const result = listHelper(blogs)

    expect(result).toBe(1)
})

describe('Number of likes', () => {
    test('One blog', () => {
        const listWithOneBlog = [
            {
              _id: '5a422aa71b54a676234d17f8',
              title: 'Go To Statement Considered Harmful',
              author: 'Edsger W. Dijkstra',
              url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
              likes: 5,
              __v: 0
            }
          ]
        
        const result = likeHelper(listWithOneBlog)

        expect(result).toBe(5)
    })  

    test('Multiple blogs', () => {
        const blogs = [
            {
              _id: "5a422a851b54a676234d17f7",
              title: "React patterns",
              author: "Michael Chan",
              url: "https://reactpatterns.com/",
              likes: 7,
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

           const result = likeHelper(blogs)
           expect(result).toBe(24)
    })

    test('Zero blog', () => {
        const blogs = []

        const result = likeHelper(blogs)
        expect(result).toBe(0)
    })
        
})

describe('Favorite blogs', () => {
  test('Multiple blogs', () => {
    const blogs = [
      {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
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

     const result = favoriteBlog(blogs)
     expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
     })
  }) 
})

describe('Blogs stats', () => {
  test('For author', () =>{
    const blogs = [
      {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
      },
      {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
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
    const result = mostBlogs(blogs)
    expect(result).toEqual({
      author: "Michael Chan",
      blogs: 2
    })
  })
})

describe('Most liked', () => {
  test('Most liked blogs', () => {
    const blogs = [
      {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
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
     const result = mostLikes(blogs)
     expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 12
     })
  })
})

afterAll(() => {
  mongoose.connection.close()
})