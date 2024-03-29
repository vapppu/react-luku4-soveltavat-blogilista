const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    }, 10000)

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'veerahi',
            name: 'Veera Hiltunen',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails if username is not given', async () => {
        const usersAtStart = await helper.usersInDb()

        const userWithoutUsername = {
            name: 'No Username',
            password: 'passwordofnousername'
        }

        const result = await api
            .post('/api/users')
            .send(userWithoutUsername)
            .expect(400)
            .expect('Content-TYpe', /application\/json/)

        console.log(result.body.error)

        expect(result.body.error).toContain('`username` is required')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails if password is not given', async () => {
        const usersAtStart = await helper.usersInDb()

        const userWithoutPassword = {
            username: 'nopwd',
            name: 'Without Password'
        }

        const result = await api
            .post('/api/users')
            .send(userWithoutPassword)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        console.log(result.body.error)

        expect(result.body.error).toContain('password missing')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails if username or password is shorter than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const userWithShortUsername = {
            username: 'ab',
            name: 'Liisa Ihmemaassa',
            password: 'liisansalasana'
        }

        const shortUsernameResult = await api
            .post('/api/users')
            .send(userWithShortUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(shortUsernameResult.body.error).toContain('shorter than the minimum allowed length (3)')

        const userWithShortPassword = {
            username: 'kayttaja',
            name: 'Liisa Joulumaassa',
            password: 'sa'
        }

        const shortPasswordResult = await api
            .post('/api/users')
            .send(userWithShortPassword)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(shortPasswordResult.body.error).toContain('password too short')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

    })
})