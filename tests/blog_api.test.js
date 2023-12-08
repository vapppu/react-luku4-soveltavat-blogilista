const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


describe('When there is initally some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('all blogs are returned', async () => {
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('notes are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('Blog will have an ID', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body
        expect(blogs[0].id).toBeDefined();
    })

    describe('viewing a specific blog', () => {
        test('viewing a single blog with specified ID', async () => {

            const initialBlog = helper.initialBlogs[0]

            const resultBlog = await api
                .get(`/api/blogs/${initialBlog.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            expect(resultBlog.body).toEqual(initialBlog)
        })

        test('fails with statuscode 404 if blog does not exist', async () => {
            const validNonexistingId = await helper.nonExistingId()

            await api
                .get(`/api/blogs/${validNonexistingId}`)
                .expect(404)
        })

        test('fails with statuscode 400 id is invalid', async () => {
            const invalidId = '5a3d5da59070081a82a3445'

            await api
                .get(`/api/blogs/${invalidId}`)
                .expect(400)
        })

    })

    describe('addition of a new blog', () => {

        test('succeeds with valid data', async () => {
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

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

            const titles = blogsAtEnd.map(blog => blog.title)
            expect(titles).toContain(newBlog.title)
        })

        test('succeeds with data with no liked field - inserted into database with 0 likes', async () => {
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

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

            const addedBlog = blogsAtEnd.find(blog => blog.title === blogWithoutLikes.title)
            expect(addedBlog.likes).toBe(0)

            const titles = blogsAtEnd.map(blog => blog.title)
            expect(titles).toContain(blogWithoutLikes.title)
        })

        test('fails with status code 400 if invalid data (title or url missing)', async () => {
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

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

        })
    })
})
afterAll(async () => {
    await mongoose.connection.close()
})