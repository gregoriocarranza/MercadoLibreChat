import React, { Fragment } from "react";
import Cookies from "universal-cookie";
import "./App.css";



function Card({ props }) {
    // console.log(props);
    const cookies = new Cookies();

    const uuid = cookies.get("uuid");



    return (
        <Fragment>
            <div className={props.uuid == uuid ? "divChat propio" : "divChat"}>

                <section className="datos">
                    <img src={props.perfil} alt="ImagenDePerfil" />
                    <h3>{props.nombre} <small>{props.uuid == uuid ? "(VOS)" : ""}</small></h3>

                </section>
                <p className="mensaje">
                    {props.message}
                </p>
            </div>
        </Fragment>
    )
}

export default Card;
