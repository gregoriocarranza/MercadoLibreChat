const express = require("express");
const { Server: HttpServer } = require('http');
const cookieParser = require('cookie-parser')
const cors = require("cors");
const config = require("./Database/Sql/dbconfig")
const mongoose = require("mongoose")
const pino = require("pino")


const User_route = require("./src/routes/User_route")
const Product_route = require("./src/routes/Product_route");
const Mesagge_route = require("./src/routes/Mesagge_route.js");

const { client } = require("./Database/Sql/dbconfig");

require('dotenv').config()

const MongoUrl = process.env.MONGO || "mongodb://user:user123@database-0-shard-00-00.vgtwg.mongodb.net:27017,database-0-shard-00-01.vgtwg.mongodb.net:27017,database-0-shard-00-02.vgtwg.mongodb.net:27017/CoderHouse?ssl=true&replicaSet=atlas-uit0wk-shard-0&authSource=admin&retryWrites=true&w=majority"


const app = express()
const server = new HttpServer(app)
const io = require('socket.io')(server, { cors: { origin: "*" } });

app.use(cookieParser())
app.use(cors())

const PORT = process.env.PORT || 3008

app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.use(express.json())


app.use(express.static(__dirname + "/ProfileStorage"))
app.use(express.static(__dirname + "/Chat"))

function reloj() {
    momentoActual = new Date()
    return momentoActual

}


const pinoInfo = pino();
const pinoWarn = pino("./logs/warn.log");
const pinoError = pino("./logs/error.log");

let userrout = new User_route(app, pinoError, pinoWarn)
let productroute = new Product_route(app, pinoError, pinoWarn)
let messageroute = new Mesagge_route(app, pinoError, pinoWarn)



app.get("/", async (req, res) => {
    res.send({ Sucsees: "Ok", Status: 200 })
})


mongoose.connect(MongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
const connection = mongoose.connection
connection.once("open", () => {
    console.log("Conexion a MongoDb exitosa")
    pinoWarn.warn("base MongoDB conectada");
    server.listen(PORT, () => {
        console.log(`Aplicacion abierta en el puerto ${PORT} -- ${reloj()}`)
        pinoWarn.warn(`Aplicacion abierta en el puerto ${PORT} -- ${reloj()}`)
    })
    app.on("error", (error) => {
        console.log(`Error en servidor ${error}`)
        pinoError.error(`Error en servidor ${error}`)
    })

})
connection.on("Error", (err) => {
    console.log("Conexion sin exito, Error:", err.message)
    pinoError.error(`Error en conexión de Base de datos: ${error}`);
})



// Socket io----------------------



io.on('connection', async (client) => {
    console.log("Nueva Coneccion: ", client.id)

    let resp = await messageroute.Get_message()
    // console.log(resp[0]);
    client.emit("server:sendAll", resp)

    client.emit("server:sendAll", messageroute.Get_message())

    client.on("client:Ping", (data) => {
        console.log(data);
        socket.emit("server:Pong", "PONG")

    })
    client.on("client:message", (data) => {
        // console.log(data);
        messageroute.Post_Message(data)

    })
    client.on("disconnect", (reason) => {
        console.log("Usuario desconectado ", reason);
    })
});



