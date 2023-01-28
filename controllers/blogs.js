const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (req, res) => {
    Blog.find({})
        .then(blogs => {
            res.json(blogs)
        })
})

blogsRouter.post('/', (req, res) => {
    const blog = new Blog(req.body)

    blog.save()
        .then(result => {
            res.status(201).json(result)
        })
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