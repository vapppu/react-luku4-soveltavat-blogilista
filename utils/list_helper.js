const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((prev, current) =>
        prev + current.likes
        , 0)
}

module.exports = {
    dummy,
    totalLikes
}