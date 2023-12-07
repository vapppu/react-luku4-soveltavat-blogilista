const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        "title": "Blogi",
        "author": "Veera",
        "url": "www.blogi.com",
        "likes": 6,
        "id": "6564719721e99569fde868af"
    },
    {
        "title": "Heppablogi",
        "author": "Liisa",
        "url": "www.heppablogini.fi",
        "likes": 348,
        "id": "656472af21e99569fde868b1"
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObjects = initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('notes are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('new blog post is added to blog list', async () => {
    const newBlog =
    {
        title: "Uusi blogi",
        author: "Bianca Bloggari",
        url: "www.biancanblogi.com",
        likes: 111
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(response => response.title)

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(titles).toContain(newBlog.title)

})

test('Blog will have an ID', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    expect(blogs[0].id).toBeDefined();
})

test('New blog is added to database', async () => {
    const newBlog = {
        title: 'Testauksen salat',
        author: 'Terhi Testeri',
        url: 'terhintestaukset.com',
        likes: '78'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogsAtEnd = response.body
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain(newBlog.title)
})

test('Invalid blog is not added to database', async () => {
    const blogWithoutTitle = {
        author: "Kirjoittaja",
        url: "kirjoittaja.com"
    }

    await api
        .post('/api/blogs')
        .send(blogWithoutTitle)
        .expect(400)

    const blogWithoutAuthor = {
        title: "Kirjoitin itse itseni",
        url: "itsekirjoittaja.fi",
        likes: 10
    }

    await api
        .post('/api/blogs')
        .send(blogWithoutAuthor)
        .expect(400)

    const blogWithoutUrl = {
        title: "En ole netissä",
        author: "Neiti Netitön",
        likes: 2
    }

    await api
        .post('/api/blogs')
        .send(blogWithoutUrl)
        .expect(400)
})

afterAll(async () => {
    await mongoose.connection.close()
})