
import socketio from "socket.io-client";
import React from "react";

export const socket = socketio.connect("http://localhost:3005/");
export const SocketContext = React.createContext();