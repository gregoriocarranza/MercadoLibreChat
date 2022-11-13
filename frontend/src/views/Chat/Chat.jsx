import { Fragment, useState, useEffect } from "react";
import { useRedirect } from "react-admin";
import Cookies from "universal-cookie";
import io from 'socket.io-client';
import "./App.css";

const socket = io("http://localhost:3005/")


function Chat() {
    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
    const cookies = new Cookies();
    const redirect = useRedirect();

    const [reload, setReload] = useState(false);
    const UserName = cookies.get("nombre");

    useEffect(() => {
        setTimeout(() => {
        }, 6000);
    }, [reload]);

    return (
        <Fragment>
            <h1 className="saludo">Bienvenido al chat {UserName}!!</h1>
            <div class="chatArea">
                <div class="UserArea"></div>
                <div class="Chat"></div>
                <div class="Send">
                    <textarea className="Textarea" name="Textarea" id="Textarea" placeholder="Ingrese texto"></textarea>
                    <input className="submitButton" type="submit" value="Enviar" />
                </div>
            </div>
        </Fragment>
    );
}

export default Chat;
