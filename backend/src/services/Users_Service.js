
const config = require("../../Database/Sql/dbconfig")

// const storage = require("../../ProfileStorage/storage")
const multer = require('multer')
const upload = multer({ dest: "../../ProfileStorage/imgs" })

const knex = require('knex')(config)
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()

class Contenedor {

    constructor(DirFile) {
    }

    async getAll() {
        try {
            return new Promise((resolve, reject) => {
                knex.from("user").select("*").then((data) => {
                    // console.log(data)
                    resolve(data)

                })
            })


        } catch (error) {
            console.log(error)
            return []
        }
    }

    async save(obj, pinoWarn, pinoError) {
        let obj2 = {
            uuid: uuidv4(),
            nombre: obj.nombre,
            contraseña: obj.contraseña,
            edad: obj.edad,
            email: obj.email,
            telefono: obj.telefono,
            admin: obj.admin,
            saldo: obj.saldo
        }

        return new Promise((resolve, reject) => {
            // console.log(obj)
            knex.from("user").insert(obj2).then((data) => {
                knex.from("user").select("*").whereIn('id', data).then(([data2]) => {
                    console.log("Usuario Creado")
                    // console.log(data2)
                    resolve({ message: "Exito en la creacion del objeto", status: 200, data: data2 })
                })



            }).catch((err) => {
                console.log(err)
                pinoError.error(err)
            })
        })


    }

    async getByEmail(data) {
        return new Promise((resolve, reject) => {
            knex.from('user').select("*").where({ email: data }).then((u) => {
                // console.log(u[0])
                resolve(u[0])
            }).catch((err) => {
                console.log(err)
            })
        })
    }
    async getByid(data) {
        
        return new Promise((resolve, reject) => {
            knex.from('user').select("nombre","email","perfil").where({ id: data }).then((u) => {
                // console.log(u[0])
                resolve(u[0])
            }).catch((err) => {
                console.log(err)
            })
        })
    }
    async getByuuid(data) {
        return new Promise((resolve, reject) => {
            knex.from('user').select("*").where({ uuid: data }).then((u) => {
                // console.log(u[0])
                resolve(u[0])
            }).catch((err) => {
                console.log(err)
            })
        })
    }

    async deleteByUUID(uuid, pinoWarn, pinoError) {

        // console.log(Id)
        try {
            return new Promise((resolve, reject) => {
                knex.from('user').where({ uuid: uuid }).del().then((data) => {
                    switch (data) {
                        case 1:
                            pinoWarn.warn("Usuario Eliminado " + uuid)
                            resolve({ message: "Exito en la eliminacion del objeto", status: 200 })
                            break;
                        default:
                            resolve({ message: "No se encontro el archivo que estas buscando", status: 404 })
                            break;
                    }
                })
            })
        } catch (error) {
            console.log(error)
            pinoError.error(error)
        }
    }

    async Update(obj, pinoWarn, pinoError) {

        try {
            return new Promise((resolve, reject) => {
                knex.from("user").where("uuid", obj.uuid).update(obj).update("update_at", knex.fn.now()).then((data) => {
                    switch (data) {
                        case 1:
                            resolve({ message: "Exito en la modificacion del objeto", status: 200, data: obj })
                            break;
                        default:
                            resolve({ message: "No se encontro el archivo que estas buscando", status: 404 })
                            break;
                    }
                })
            })
        } catch (error) {
            console.log(error)
            pinoError.error(err)
        }
    }

    async ChangePicture(data) {
        console.log(data.img)
        // return new Promise((resolve, reject) => {
        //     knex.from("user").where("id", data.uuid).update(img).then((data) => {
        //         console.log(data[0])
        //         console.log("User Modificadp " + data.uuid)

        //         resolve({ message: "Exito en la modificacion del objeto", status: 200 })

        //     })
        // })
    }

    async SendMesage(datas) {

        return new Promise((resolve, reject) => {
            knex.from('user').select("*").where({ uuid: datas.uuid }).then((u) => {
                console.log(u[0])

                const accountSid = 'AC784720990dbfb333d0ce4f770eb13341';
                const authToken = '23f30a06eeca94412fe73476d6456ada';
                const client = require('twilio')(accountSid, authToken);

                client.messages
                    .create({
                        body: 'Su compra a sido procesada, pronto le estara llegando su correspondiente mail',
                        from: `whatsapp:${process.env.NUMBER}`,
                        to: `whatsapp:${u[0].telefono}`
                    })
                    .then(message => console.log(message.sid))
                    .done();
            }).catch((err) => {
                console.log(err)
            })
        })
    }

    async SendMesageToAdmin(datas) {

        return new Promise((resolve, reject) => {
            knex.from('user').select("*").where({ uuid: datas.uuid }).then((u) => {
                console.log(u[0])

                const accountSid = 'AC784720990dbfb333d0ce4f770eb13341';
                const authToken = '23f30a06eeca94412fe73476d6456ada';
                const client = require('twilio')(accountSid, authToken);

                client.messages
                    .create({
                        body: `Un usuario ha hecho una compra: UUID: ${u[0].uuid} - Nombre: ${u[0].nombre}`,
                        from: `whatsapp:${process.env.NUMBER}`,
                        to: `whatsapp:${process.env.ADMIN}`
                    })
                    .then(message => console.log(message.sid))
                    .done();

            }).catch((err) => {
                console.log(err)
            })
        })
    }
}



module.exports = Contenedor