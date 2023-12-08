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
    await Blog.insertMany(initialBlogs)

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

test('single blog is returned with specified ID', async () => {

    const initialBlog = initialBlogs[0]

    const resultBlog = await api
        .get(`/api/blogs/${initialBlog.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(resultBlog.body).toEqual(initialBlog)
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

    const insertBlogWithoutTitle = await api
        .post('/api/blogs')
        .send(blogWithoutTitle)
        .expect(400)

    const blogWithoutUrl = {
        title: "En ole netissä",
        author: "Neiti Netitön",
        likes: 2
    }

    const insertBlogWithoutUrl = await api
        .post('/api/blogs')
        .send(blogWithoutUrl)
        .expect(400)

    const promiseArray = [insertBlogWithoutTitle, insertBlogWithoutUrl]
    await Promise.all(promiseArray)

    const response = await api.get('/api/blogs')
    const blogsAtEnd = response.body
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)

})

test('Blog without likes is added with 0 likes', async () => {
    const blogWithoutLikes = {
        title: "Ei tykkäyksiä",
        author: "Liisa Liketön",
        url: "nolikes.com"
    }

    await api
        .post('/api/blogs')
        .send(blogWithoutLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogsAtEnd = response.body
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

    const addedBlog = blogsAtEnd.find(blog => blog.title === blogWithoutLikes.title)
    expect(addedBlog.likes).toBe(0)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain(blogWithoutLikes.title)

})

afterAll(async () => {
    await mongoose.connection.close()
})