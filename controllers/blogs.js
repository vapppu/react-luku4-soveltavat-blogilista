const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    return (blog ? response.json(blog) : response.status(404).json(blog))
})

blogsRouter.post('/', async (request, response, next) => {

    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    })

    try {
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
    }
    catch (exception) {
        next(exception)
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
    try {
        const blogObject = request.body

        if (blogObject.title && blogObject.url) {
            const result = await Blog.findByIdAndUpdate(request.params.id, { ...blogObject }, { new: true, runValidators: true, context: 'query' })
            response.json(result)
        }
        else {
            response.status(400).end()
        }
    }
    catch (exception) {
        next(exception)
    }
})


module.exports = blogsRouter