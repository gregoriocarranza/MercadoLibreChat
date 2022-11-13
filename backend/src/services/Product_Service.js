
const config = require("../../Database/Sql/dbconfig")
const knex = require('knex')(config)
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()

class Contenedor {

    constructor(DirFile) {
    }

    async getAll(pinoError) {
        try {
            return new Promise((resolve, reject) => {
                knex.from("productos").select("*").then((data) => {
                    // console.log(data)
                    resolve(data)
                })
            })
        } catch (error) {
            console.log(error)
            pinoError.error(err)
            return []
        }
    }

    async save(obj, pinoWarn, pinoError) {




        try {
            return new Promise((resolve, reject) => {
                // console.log(obj);
                knex.from("user").select("*").where("uuid", obj.uuid).then(([data]) => {
                    // console.log(data);
                    let obj2 = {
                        uuid: uuidv4(),
                        nombre: obj.nombre,
                        descripcion: obj.descripcion,
                        precio: obj.precio,
                        userId: data.id,
                        fotoProd: obj.fotoProd
                    }
                    knex.from("productos").insert(obj2).then(([data]) => {
                        pinoWarn.warn("Producto posteado con el id " + data)
                        obj2 = { ...obj2, id: data }
                        resolve({ message: "Exito en la creacion del objeto", status: 202, data: obj2 })

                    }).catch((err) => {
                        console.log(err)
                        pinoError.error(err)
                        resolve({ message: "error al insertar el regsistro", status: 500 })
                    })
                })

            })
        } catch (error) {
            console.log(error)
            pinoError.error(err)
        }
    }
    async Update(obj, pinoWarn, pinoError) {

        try {
            return new Promise((resolve, reject) => {
                knex.from("productos").where("uuid", obj.uuid).update(obj).update("update_at", knex.fn.now()).then((data) => {
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
    async deleteByUUID(uuid, pinoWarn, pinoError) {

        // console.log(Id)
        try {
            return new Promise((resolve, reject) => {
                knex.from('productos').where({ uuid: uuid }).del().then((data) => {
                    switch (data) {
                        case 1:
                            pinoWarn.warn("Producto Eliminado " + uuid)
                            resolve({ message: "Exito en la eliminacion del objeto", status: 200 })
                            break;
                        default:
                            resolve({ message: "No se encontro el archivo que estas buscando", status: 404 })
                            break;
                    }
                    pinoWarn.warn("Producto Eliminado " + uuid)
                    resolve({ message: "Exito en la eliminacion del objeto", status: 200 })
                })
            })
        } catch (error) {
            console.log(error)
            pinoError.error(error)
        }
    }
}



module.exports = Contenedor