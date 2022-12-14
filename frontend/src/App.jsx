import { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Inicio from "./views/Inicio/Inicio.jsx";
import Register from "./views/Register/Register.jsx";
import Login from "./views/Login/Login.jsx";
import Store from "./views/Store/Store.jsx";
import ChatV from "./views/Chat/Chat.jsx";
import Delog from "./components/deslogueo.jsx"

import { SocketContext, socket } from './Context/socket';

function App() {
  return (
    <Fragment>
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/ingreso" element={<Login />} />
            <Route path="/store" element={<Store />} />
            <Route path="/chat" element={<ChatV />} />
            <Route path="/delog" element={<Delog />} />

          </Routes>
        </BrowserRouter>
      </SocketContext.Provider>
    </Fragment>
  );
}

export default App;
