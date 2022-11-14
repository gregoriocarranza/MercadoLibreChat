import React, { Fragment, useState, useEffect } from "react";
import { useRedirect } from "react-admin";
import io from 'socket.io-client';
import "./App.css";
import Cards from "./Cards.jsx";

let socket = io("http://localhost:3005/")


function ChatList() {
    const [mensajes, setMensajes] = useState([]);

    socket.on("server:sendAll", (data) => {
        setMensajes(data)
    })
    
    return (
        <Fragment>
            {mensajes?.forEach((u) => {
                console.log(u);
                <Cards key={u.id} props={u} />
            })}

        </Fragment>
    )
}

export default ChatList;
