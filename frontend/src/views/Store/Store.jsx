import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRedirect } from "react-admin";
import Cookies from "universal-cookie";

import NavBar from "../../components/NavBar";
import ProductList from "./ProductList.jsx";

import { getProductos, agregarProductos } from ".././Api"
import "./App.css";

function Store() {
    const [reload, setReload] = useState(false);
    const [products, setProducts] = useState();
    const formRef = React.useRef();
    const cookies = new Cookies();

    useEffect(() => {
        getProducto()
    }, [reload])

    const getProducto = async () => {
        setProducts(await (await getProductos()).data)
    }


    const EnviarForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const values = Object.fromEntries(formData);

        if (values.NAME === "" || values.PASSWORD === "") {
            console.log("Todos los datos deben estar completados");
            return;
        }
        const res = await agregarProductos(values);
        const UserData = res.data.data;
        console.log(res.data);
        console.log(UserData);
        setReload(!reload)
    }
    return (
        <Fragment>
            <NavBar />
            <center><h1>Sector de venta</h1></center>
            <form action="" method="" onSubmit={EnviarForm} ref={formRef} className="formProd">
                <center><h2>Ingresa un Producto para vender</h2></center>
                <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    placeholder="Ingrese el nombre de su producto"
                />
                <input
                    type="text"
                    name="descripcion"
                    id="descripcion"
                    placeholder="Ingrese una descripcion"
                />
                <input
                    type="number"
                    name="precio"
                    id="precio"
                    placeholder="Ingrese un precio"
                />
                <input type="file" accept="image/*" name="File" id="File" />
                <input type="hidden" name="uuid" id="uuid" value={cookies.get("uuid")} />
                <input type="submit" id="submit" value="Enviar" />
            </form>
            <section className="StoreNav">
                <ProductList props={products} />
            </section>
        </Fragment>
    )
}

export default Store;
