module.exports = {
    host: process.env.HOST,
    port: Number(process.env.PORT),
    secret: process.env.JWT_SECRET,
    env: process.env.NODE_ENV
};