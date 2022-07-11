const blogListRouter = require('express').Router()
const Blog = require('../models/bloglist')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogListRouter.get('/blogs', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name:1 })
    response.json(blogs)
  })

blogListRouter.post('/blogs', async (request, response, next) => {
    const body = request.body

    const user = request.user
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    if(!blog.title && !blog.url){
     response.status(400)
    }

    try{
      const result = await blog.save()
      user.blogs = user.blogs.concat(result._id)  
      await user.save()
      response.status(201).json(result)
    } catch (error){
      next(error)
    }

  })

  blogListRouter.delete('/blogs/:id', async (request, response, next) => {

    const user = request.user

    try{  
      const blog = await Blog.findById(request.params.id)
      if(user._id.toString() === blog.user.toString()){
        await Blog.findByIdAndRemove(request.params.id)
      }
      else {
        return response.status(401).json({ error: 'token invalid' })
      }
      response.status(204).end()
    } catch (error) {
      next(error)
    }
  })

  blogListRouter.put('/blogs/:id', async (request, response, next) => {
    const update = request.body

    const blog = {
      likes: update.likes
    }

    try{
      const result = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
      response.status(201).json(result)
    } catch (error) {
      next(error)
    }
  })
  module.exports = blogListRouter