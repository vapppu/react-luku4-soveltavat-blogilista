const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    console.log(request.body)
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    console.log(passwordHash)

    const user = new User({
        username,
        name,
        passwordHash
    })

    console.log(user)

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter