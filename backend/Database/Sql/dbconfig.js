require('dotenv').config()

module.exports = config = {
    client: 'mysql',
    connection: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE1
    }
}
