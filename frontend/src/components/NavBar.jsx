

import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRedirect } from "react-admin";
import Cookies from "universal-cookie";


import "./App.css";

function NavBar() {
    const redirect = useRedirect();
    const cookies = new Cookies();
    const formRef = React.useRef();

    const [loggued, setLoggued] = useState(true);
    const [reload, setReload] = useState(false);
    const [user, setUser] = useState({});

    const [window, setWindow] = useState("");

    const CheckUser = (a) => {
        const UserUuid = cookies.get("uuid");
        if (
            UserUuid === undefined
        ) {
            console.log("user Not loged");
            changeWindow("principal")

        } else {
            console.log("user loged");
            changeWindow(a)
        }
    }

    const changeWindow = (a) => {
        switch (a) {
            case "chat":
                setWindow(a)
                redirect("/" + a);
                break;
            case "store":
                setWindow(a)
                redirect("/" + a);
                break;
            case "principal":
                setWindow(a)
                redirect("/");
                break;
            case "delog":
                setWindow(a)
                redirect("/" + a);
                break;
            default:
                setWindow("")
                break;
        }
    }
    return (
        <Fragment>
            <div className="buttons"><button
                onClick={() => {
                    CheckUser("delog");
                }}
            >
                Desloguear
            </button>
                <button
                    onClick={() => {
                        CheckUser("principal");
                    }}
                >
                    Ir a la pagina principal
                </button>
                <button
                    onClick={() => {
                        CheckUser("chat");
                    }}
                >
                    Ir al chat
                </button>
                <button
                    onClick={() => {
                        CheckUser("store");
                    }}
                >
                    Ir al store
                </button></div>
        </Fragment>
    )
}

export default NavBar;
