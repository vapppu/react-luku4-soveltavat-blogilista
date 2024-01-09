const Blog = require('../models/blog')
const User = require('../models/user')

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

const nonExistingId = async () => {
    const blog = new Blog({
        title: "Ei-olemassaoleva-blogi",
        author: "Kummitus",
        url: "nonexisting.com",
        likes: 0
    })

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb
}