
const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((prev, current) =>
        prev + current.likes
        , 0)
}

const favoriteBlog = (blogs) => {
    const likes = (blogs.map(blog => Number(blog.likes)))
    const mostLikes = Math.max(...likes)
    const blogi = blogs.find(blog => blog.likes === mostLikes)
    return blogi
}

const mostBlogs = (blogs) => {

    let blogCountByAuthor = []
    blogs.forEach(blog => {
        const authorData = blogCountByAuthor.find(countedBlog => countedBlog.author === blog.author)

        if (authorData) {
            authorData.blogs++
        }
        else {
            blogCountByAuthor = blogCountByAuthor.concat({ author: blog.author, blogs: 1 })
        }
    })

    const authorsBlogs = blogCountByAuthor.map(author => Number(author.blogs))
    const mostBlogs = Math.max(...authorsBlogs)

    return blogCountByAuthor.find(author => author.blogs === mostBlogs)
}

const mostLikes = (blogs) => {
    let authorsLikes = []
    blogs.forEach(blog => {
        const authorData = authorsLikes.find(countedBlog => countedBlog.author === blog.author)

        if (authorData) {
            authorData.likes += blog.likes
        }

        else {
            authorsLikes = authorsLikes.concat({ author: blog.author, likes: blog.likes })
        }
    })

    const likes = authorsLikes.map(author => Number(author.likes))
    const mostLikes = Math.max(...likes)

    return authorsLikes.find(author => author.likes === mostLikes)
}



module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}