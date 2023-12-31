const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const manyBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

describe('total likes', () => {

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test('when list has multiple blogs (manyBlogs)', () => {
        const result = listHelper.totalLikes(manyBlogs)
        expect(result).toBe(36)
    })

    test('when list has an empty array', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })
})

describe('Favorite blog', () => {

    test('When several blogs', () => {
        expect(listHelper.favoriteBlog(manyBlogs)).toEqual(manyBlogs[2])
    })

    test('When one blog', () => {
        expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(listWithOneBlog[0])
    })

    test('When empty array', () => {
        expect(listHelper.favoriteBlog([])).toEqual(undefined)
    })
})

describe('Author with most blogs', () => {

    test('When multiple blogs', () => {
        expect(listHelper.mostBlogs(manyBlogs)).toEqual(
            {
                author: "Robert C. Martin",
                blogs: 3
            }
        )
    })

    test('When single blog', () => {
        expect(listHelper.mostBlogs([{
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
        }])).toEqual({
            author: "Edsger W. Dijkstra",
            blogs: 1
        })
    })

    test('When empty array', () => {
        expect(listHelper.mostBlogs([])).toBe(undefined)
    })
})

describe('Author with most likes', () => {

    test('When multiple blogs', () => {
        expect(listHelper.mostLikes(manyBlogs)).toEqual(
            {
                author: "Edsger W. Dijkstra",
                likes: 17
            }
        )
    })

    test('When single blog', () => {
        expect(listHelper.mostLikes([{
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
        }])).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 12
        })
    })

    test('When empty array', () => {
        expect(listHelper.mostLikes([])).toBe(undefined)
    })

})