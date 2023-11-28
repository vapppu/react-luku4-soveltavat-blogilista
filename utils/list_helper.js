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
    console.log(blogi)
    return blogi
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}