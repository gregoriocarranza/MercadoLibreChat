const express = require('express')

const multer = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './ProfileStorage/productImgs')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${uniqueSuffix}-${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

const Mesagge_Service = require("../Services/Mesagge_Service.js")

class Mesagge_route {
    constructor(app, pinoError, pinoWarn) {
        this.app = app
        this.pinoError = pinoError
        this.pinoWarn = pinoWarn
        pinoWarn.warn(`Inicializando modulo - Mesagge_route`);
        this.Router = express.Router()
        this.app.use('/api/messages', this.Router)

        this.container = new Mesagge_Service
    }

    GetMessage = async () => {
        try {
            return new Promise((resolve, reject) => {
                console.log("Actualizando Mensajes");
                this.container.getAll(this.pinoError).then((resp) => {
                    // console.log(resp)
                    resolve(resp)
                })
            })


        } catch (error) {
            console.log(error)
        }
    }

    GetMessageById = async (id) => {
        try {
            return new Promise((resolve, reject) => {
                console.log("Actualizando Mensajes");
                this.container.getById(this.pinoError, id).then((resp) => {
                    // console.log(resp)
                    resolve(resp)
                })
            })


        } catch (error) {
            console.log(error)
        }
    }

    PostMessage = async (a) => {
        try {
            return new Promise((resolve, reject) => {
                // console.log(a);
                this.container.save(a, this.pinoWarn, this.pinoError).then((resp) => {
                    resolve(resp)

                })
            })
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Mesagge_route