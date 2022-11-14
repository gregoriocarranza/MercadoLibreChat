import React, { Fragment, useState, useEffect } from "react";
import { useRedirect } from "react-admin";
import Cookies from "universal-cookie";
import io from 'socket.io-client';
import NavBar from "../../components/NavBar.jsx"
import ChatList from "./ChatList.jsx"

import "./App.css";




function Chat() {
    let socket = io("http://localhost:3005/")


    const cookies = new Cookies();
    const redirect = useRedirect();
    const formRef = React.useRef();

    const [reload, setReload] = useState(false);


    const UserName = cookies.get("nombre");
    let obj = []


    const sendMessage = async (e) => {

        e.preventDefault()

        const formData = new FormData(formRef.current);
        const values = Object.fromEntries(formData);
        // console.log(values);
        socket.emit("client:message", values)
    }

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });

    return (
        <Fragment>
            <NavBar />
            <h1 className="saludo">Bienvenido al chat {UserName}!!</h1>
            <div className="chatArea">
                <div className="UserArea"></div>
                <div className="Chat">
                    <ChatList />
                </div>
                <div className="Send">
                    <form
                        onSubmit={sendMessage}
                        ref={formRef}>
                        <textarea className="Textarea" name="Textarea" id="Textarea" placeholder="Ingrese texto"></textarea>
                        <input type="hidden" name="uuid" id="uuid" value={cookies.get("uuid")} />
                        <input className="submitButton" type="submit" value="Enviar" />
                    </form>

                </div>
            </div>
        </Fragment>
    );
}

export default Chat;
