const config = require("./dbconfig.js")
const knex = require('knex')(config)
require('dotenv').config()
knex.schema.createTableIfNotExists('user', table => {
    table.increments('id')
    table.primary('id')
    table.string('uuid')
    table.string('nombre')
    table.string('contraseña')
    table.integer('edad')
    table.string('email')
    table.string('telefono')
    table.string('perfil').defaultTo(`http://localhost:${process.env.PORT}/profileImgs/defaultProfileImage.jpg`)
    table.boolean('admin')
    table.boolean('conected').defaultTo(0)
    table.float('saldo').defaultTo(0)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('update_at').defaultTo(knex.fn.now())

}).then(() => {
    console.log('Tabla creada')

    knex.schema.createTableIfNotExists('productos', table => {
        table.increments('id')
        table.primary('id')
        table.string('uuid')
        table.string('nombre')
        table.string('descripcion')
        table.float('precio')
        table.string('fotoProd').defaultTo("http://localhost:${process.env.PORT}/profileImgs/defaultImage.png")
        table.integer('userId').unsigned()
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('update_at').defaultTo(knex.fn.now())
        table.foreign('userId').references('user.id').onDelete("CASCADE")
    }).then(() => {
        console.log('Tabla creada')
    }).catch((err) => {
        console.log(err)
    }).finally(() => {
        knex.destroy()
    })



}).catch((err) => {
    console.log(err)
}).finally(() => {
    knex.destroy()
})



knex.schema.createTableIfNotExists('message', table => {
    table.increments('id')
    table.primary('id')
    table.string('uuid')
    table.integer('userId').unsigned()
    table.string('message')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('update_at').defaultTo(knex.fn.now())
    table.foreign('userId').references('user.id').onDelete("CASCADE")
}).then(() => {
    console.log('Tabla creada')
}).catch((err) => {
    console.log(err)
}).finally(() => {
    knex.destroy()
})