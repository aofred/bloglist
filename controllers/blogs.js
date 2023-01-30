const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {  
    const authorization = request.get('authorization')  
    if (authorization && authorization.startsWith('Bearer ')) {    
        return authorization.replace('Bearer ', '')  
    }  
    return null
}

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1, id: 1})
    
    res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
    const body = req.body
    
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {    
        return response.status(401).json({ error: 'token invalid' })  
    }
    const user = await User.findById(decodedToken.id)
    
    const blog = new Blog(body)
    blog.user = user._id
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
    try {
        await Blog.findByIdAndRemove(req.params.id)
        res.status(204).end()
    } catch (exception) {
        console.error(exception)
    }
})

module.exports = blogsRouter