import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const user = "http://localhost:3005/api/user";

const productos = "http://localhost:3005/api/products";
const carrito = "http://localhost:3005/api/carrito";

// Recibir data
export const getProductos = async () => {
  // console.log(`${productos}`);
  return await axios.get(`${productos}`);
};

export const agregarProductos = async (prod) => {
  console.log(prod);

  return await axios({
    method: "post",
    url: `${productos}`,
    data: prod,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  
  // return await axios.post(`${productos}`, prod);
};
export const actualizarProductos = async (prod) => {
  // console.log(`${productos}/${User.id}`);
  console.log(prod);
  return await axios.put(`${productos}`, prod);
};
export const eliminarProductos = async (id) => {
  // console.log(`${productos}/${User.id}`);
  // console.log(id);
  return await axios.delete(`${productos}/${id}`);
};

// cart----------------------------------------------------------

export const CrearCarrito = async () => {
  return await axios.post(`${carrito}`, { uuid: uuidv4() });
};
export const Delete_cart = async (id) => {
  // console.log(user);
  return await axios.delete(`${carrito}/${id}`);
};
export const Comprar = async (body) => {
  // console.log(body);
  return await axios.post(`${carrito}/${body.Cartid}/prod`, body.task);
};
export const ProdCarrito = async (body) => {
  // console.log(body);
  return await axios.get(`${carrito}/${body}/prod`);
};
export const DeleteProdCarrito = async (body) => {
  // console.log(body);
  const uuid = body.uuid.toString();
  // console.log(body.prod.id);
  return await axios.delete(`${carrito}/${uuid}/prod/${body.prod.id}`);
};

//user-------------------------------------
export const CrearUsuario = async (Usuario) => {
  // console.log(Usuario);
  return await axios.post(`${user}`, Usuario);
};
export const CheckUser = async (Usuario) => {
  // console.log(Usuario);
  return await axios.post(`${user}/login`, Usuario);
};
export const getDataUserId = async (Usuario) => {
  // console.log(Usuario);
  return await axios.post(`${user}/getid`, { id: Usuario });
};
export const getDataUser = async (Usuario) => {
  // console.log(Usuario);
  return await axios.post(`${user}/getUuid`, { uuid: Usuario });
};
export const ChangePicture = async (bodyFormData) => {

  // console.log(bodyFormData);
  return await axios({
    method: "post",
    url: `${user}/ChangePicture`,
    data: bodyFormData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  // return await axios.post(`${user}/ChangePicture`, Usuario);
};
export const ChangePhoneNumber = async (Usuario) => {
  // console.log(Usuario);

  return await axios.post(`${user}/ChangePhoneNumber`, Usuario);
};

export const EnviarMensaje = async (Usuario) => {
  // console.log(Usuario);

  return await axios.post(`${user}/EnviarMensaje`, Usuario);
};
