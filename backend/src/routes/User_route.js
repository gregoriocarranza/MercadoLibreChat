const express = require('express')

const multer = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './ProfileStorage/profileImgs')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        cb(null, `${uniqueSuffix}-${file.originalname}`)
    }
})

require('dotenv').config()
const upload = multer({ storage: storage })

const User_Service = require("../Services/Users_Service.js")

class User_route {
    constructor(app, pinoError, pinoWarn) {
        this.app = app
        this.pinoError = pinoError
        this.pinoWarn = pinoWarn
        pinoWarn.warn(`Inicializando modulo - User_route`);
        this.Router = express.Router()
        this.app.use('/api/user', this.Router)

        this.container = new User_Service
        this.Router.get(`/`, this.Get_users)
        this.Router.post(`/`, this.Post_user)
        this.Router.post(`/getUuid`, this.Get_user_By_Uuid)
        this.Router.post(`/getid`, this.Get_user_By_id)

        this.Router.post(`/updateUser`, this.UserUpdate)
        this.Router.delete(`/`, this.Delete_User)
        this.Router.post(`/ChangePicture`, upload.single('File'), this.UserPicture)

        this.Router.post(`/login`, this.UserLogin)
        this.Router.post(`/EnviarMensaje`, this.EnviarMensaje)

        this.Router.get(`/ping`, this.ping)
        this.Router.get(`/4testing`, this.Test)

    }

    ping = async (req, res) => {

        res.status(202).send("PONG User")

    }
    Get_users = async (req, res) => {
        try {
            // console.log(req.body)
            this.container.getAll(this.pinoWarn, this.pinoError).then((resp) => {
                console.log(resp)
                res.status(202).send(resp)
            })
        } catch (error) {
            console.error(error)
        }
    }


    Get_user_By_id = async (req, res) => {
        // console.log(req.body.id);
        try {
            if (req.body.id) {
                this.container.getByid(req.body.id, this.pinoWarn, this.pinoError).then((resp) => {
                    // console.log(resp)
                    res.send(resp)
                })
            }
        } catch (error) {
            console.error(error)
            this.pinoError.error(err)
        }
    }

    Get_user_By_Uuid = async (req, res) => {
        console.log(req.body.uuid);
        try {
            if (req.body.uuid) {
                this.container.getByuuid(req.body.uuid, this.pinoWarn, this.pinoError).then((resp) => {
                    // console.log(resp)
                    res.send(resp)
                })
            }
        } catch (error) {
            console.error(error)
            this.pinoError.error(err)
        }
    }

    Post_user = async (req, res) => {
        // console.log(req.body)
        try {
            this.container.getByEmail(req.body.email, this.pinoWarn, this.pinoError).then((resp) => {
                // console.log(resp)
                if (resp) {
                    console.log("Usuario encontrado con este email")
                    this.pinoWarn.warn({ message: "Ya hau un usuario con este mail", status: 200, CODE: "EMAILEXISTENTE" })
                    res.send({ message: "Ya hau un usuario con este mail", status: 200, CODE: "EMAILEXISTENTE" })
                } else {
                    this.container.save(req.body, this.pinoWarn, this.pinoError).then((resp) => {
                        console.log(resp)
                        let obj2 = {
                            uuid: resp.data.uuid,
                            email: resp.data.email,
                            nombre: resp.data.nombre,
                            perfil: resp.data.perfil
                        }
                        res.status(resp.status).send(obj2)
                    })
                }
            })
        } catch (error) {
            console.error(error)
            this.pinoError.error(err)
        }
    }

    UserUpdate = async (req, res) => {
        try {
            this.container.Update(req.body, this.pinoWarn, this.pinoError).then((resp) => {
                console.log(resp)
                res.status(resp.status).send(resp)
            })
        } catch (error) {
            console.error(error)
            this.pinoError.error(err)
        }
    }

    Delete_User = async (req, res) => {
        // console.log(req.headers.uuid);
        try {
            this.container.deleteByUUID(req.headers.uuid, this.pinoWarn, this.pinoError).then((resp) => {
                console.log(resp)
                res.status(resp.status).send(resp)
            })
        } catch (error) {
            console.error(error)
            this.pinoError.error(err)
        }
    }

    UserPicture = async (req, res) => {
        try {
            // console.log(req.body);


            if (!req.file) {
                console.error("Sin archivo para cargar en el multer");
                this.pinoError.error("Sin archivo para cargar en el multer")
                res.status(404).send("No mandaste ninguna foto")
            } else {
                console.log(req.file.path)
                let DirUrl = req.file.path.replaceAll(String.fromCharCode(92), String.fromCharCode(47));
                DirUrl = `http://localhost:${process.env.PORT}/` + DirUrl.slice(15)

                let obj = {
                    uuid: req.body.uuid,
                    perfil: DirUrl
                }
                // console.log(obj);
                this.container.Update(obj, this.pinoWarn, this.pinoError).then((resp) => {
                    console.log(resp)
                    res.status(202).send(resp)
                })
            }
        } catch (err) {
            console.error(err)
            this.pinoError.error(err)
        }

    }

    UserLogin = async (req, res) => {
        try {
            console.log("Logeando...")
            this.container.getByEmail(req.body.email).then((resp) => {
                // console.log(resp)
                if (!resp) {
                    console.log("No hay usuario con ese imail")
                    res.status(404).send({ status: 404, message: "No existe un usuario con este email", CODE: "INEXISTENTE" })
                    return
                }
                if (resp.contraseña != req.body.contraseña) {
                    console.log("La contraseña no coinciden")
                    res.status(200).send({ status: 200, message: "Las contraseñas no coinciden", CODE: "CONTRASENIAINCORRECTA" })
                    return
                }

                res.cookie('sesion', JSON.stringify({ uuid: resp.uuid, email: resp.email, }), {
                    maxAge: 300000,
                    path: "/",
                    domain: process.env.DOMAIN || "",
                });

                let obj2 = {
                    uuid: resp.uuid,
                    email: resp.email,
                    nombre: resp.nombre,
                    perfil: resp.perfil
                }
                res.status(202).send({ status: 202, message: "Ingreso exitoso", data: obj2 })

            })
        } catch (error) {
            console.error(error)
            this.pinoError.error(err)
        }
    }



    EnviarMensaje = async (req, res) => {
        console.log(req.body)

        try {

            this.container.SendMesage(req.body)
            this.container.SendMesageToAdmin(req.body)


        } catch (error) {
            console.error(error)
            this.pinoError.error(err)
        }
    }

    Test = async (req, res) => {

        let obj = []
        let indexOfObj = 5
        for (let index = 0; index <= indexOfObj; index++) {
            const testObj = {
                Autor: faker.name.firstName(),
                Titulo: faker.commerce.productName(),
                Descripcion: faker.commerce.productDescription(),
                Ratio: faker.commerce.price(0, 10, 0),
                Precio: faker.commerce.price(100, 500, 0),
                Mostrar_Web: false
            }
            this.container.save(testObj)
            obj.push(testObj)
        }
        res.status(200).json({ sucsess: true, message: "Objetos creados: " + indexOfObj, obj })
    }
}

module.exports = User_route