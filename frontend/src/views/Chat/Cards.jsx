import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import "./App.css";

import { getDataUserId } from "../Api"

function Cards(props) {
    console.log(props);
    console.log("entramos en card");
    return (
        <Fragment>
            <h1>a</h1>
            {/* <div id={props.id} className="Card">
                <h3 className="childs">{props.prod.nombre}</h3>
                <img src={props.prod.fotoProd} alt="" className="childs" />
                <p className="childs">{props.prod.descripcion}</p>
                <p className="childs">$ {props.prod.precio}</p>
                <div className="Vendedor">
                    {console.log(products)}
                    <img src={products?.perfil} alt="" />
                    <section>
                        <p>{products?.nombre} </p>
                        <p>{products?.email} </p>
                        </section>
                </div>
            </div> */}
        </Fragment>
    )
}

export default Cards;
