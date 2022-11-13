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

const Product_Service = require("../Services/Product_Service.js")

class Product_route {
    constructor(app, pinoError, pinoWarn) {
        this.app = app
        this.pinoError = pinoError
        this.pinoWarn = pinoWarn
        pinoWarn.warn(`Inicializando modulo - Product_route`);
        this.Router = express.Router()
        this.app.use('/api/products', this.Router)

        this.container = new Product_Service
        this.Router.get(`/`, this.Get_Products)
        this.Router.post(`/`, upload.single('File'), this.Post_Products)
        this.Router.post(`/updateUser`, this.Product_Update)
        this.Router.delete(`/`, this.Delete_Products)

        this.Router.get(`/ping`, this.ping)



    }
    ping = async (req, res) => {

        res.status(202).send("PONG Products")

    }

    Get_Products = async (req, res) => {
        try {
            // console.log(req.body)
            this.container.getAll(this.pinoError).then((resp) => {
                // console.log(resp)
                res.status(202).send(resp)
            })
        } catch (error) {
            console.log(error)
        }
    }

    Post_Products = async (req, res) => {
        // console.log(req.body)
        let DirUrl = req.file?.path.replaceAll(String.fromCharCode(92), String.fromCharCode(47));
        DirUrl = `http://localhost:${process.env.PORT}/` + DirUrl?.slice(15)
        let obj = { ...req.body, fotoProd: DirUrl }
        this.container.save(obj, this.pinoWarn, this.pinoError).then((resp) => {
            // console.log(resp)
            res.status(resp.status).send(resp)

        })
    }
    Product_Update = async (req, res) => {
        try {
            this.container.Update(req.body, this.pinoWarn, this.pinoError).then((resp) => {
                console.log(resp)
                res.status(resp.status).send(resp)
            })
        } catch (error) {
            console.log(error)
            pinoError.error(err)
        }
    }
    Delete_Products = async (req, res) => {
        // console.log(req.headers.uuid);
        try {
            this.container.deleteByUUID(req.headers.uuid, this.pinoWarn, this.pinoError).then((resp) => {
                console.log(resp)
                res.status(resp.status).send(resp)
            })
        } catch (error) {
            console.log(error)
            pinoError.error(err)
        }
    }
}

module.exports = Product_route