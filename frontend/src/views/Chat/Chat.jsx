import React, { useContext, useState, useEffect, Fragment } from "react";
import Cookies from "universal-cookie";
import NavBar from "../../components/NavBar.jsx"
import ChatList from "./ChatList.jsx"

import "./App.css";


import { SocketContext } from '../../Context/socket';

function Chat() {

    const cookies = new Cookies();
    const formRef = React.useRef();
    const socket = useContext(SocketContext);
    const [mensajes, setMensajes] = useState([]);




    const UserName = cookies.get("nombre");

    const sendMessage = async (e) => {

        e.preventDefault()

        const formData = new FormData(formRef.current);
        const values = Object.fromEntries(formData);
        // console.log(values);
        await socket.emit("client:message", values)

        e.target.reset()


    }

    const onEnterPress = async (e) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();

            sendMessage(e)
            
            e.target.value = ""
        }


    }



    useEffect(() => {
        socket.on("server:sendAll", (data) => {
            // console.log(data);
            setMensajes(data)

        })
        socket.on("server:sendMessage", ([data]) => {
            console.log(data);
            setMensajes([...mensajes, data])

        })

        return () => {
            socket.off("server:sendAll")
        }
    }, [socket, mensajes])

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
                    <ChatList props={mensajes} />
                </div>
                <div className="Send">
                    <form
                        onSubmit={sendMessage}
                        ref={formRef}>
                        <textarea className="Textarea" name="Textarea" id="Textarea" placeholder="Ingrese texto" rows="4" cols="50" maxLength={120} onKeyDown={onEnterPress} />

                        <input type="hidden" name="uuid" id="uuid" value={cookies.get("uuid")} />
                        <input className="submitButton" type="submit" value="Enviar" />
                    </form>

                </div>
            </div>
        </Fragment>
    );
}

export default Chat;
