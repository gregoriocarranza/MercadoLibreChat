import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRedirect, useTheme, useTimeout } from "react-admin";

import Cookies from "universal-cookie";

import { getDataUser, ChangePicture, ChangePhoneNumber, EnviarMensaje } from "../Api.jsx";

import "./App.css";

import NavBar from "../../components/NavBar.jsx"
const base = "http://localhost:3005/";

function Chat() {
  const cookies = new Cookies();
  const redirect = useRedirect();

  const [user, setUser] = useState({});
  const [reload, setReload] = useState(false);


  const formRef = React.useRef();

  useEffect(() => {
    const UserUuid = cookies.get("uuid");
    const UserName = cookies.get("nombre");
    const UserMail = cookies.get("email");
    const UserProfile = cookies.get("perfil");
    let respu = getDataUserFunct()
    // let userSaldo = respu.saldo
    // let userTimeStamp = respu.timestamp

    setUser({
      uuid: UserUuid,
      username: UserName,
      useremail: UserMail,
      profile: UserProfile,
      // saldo: userSaldo,
      // timeStamp: userTimeStamp
    });
    if (
      user.uuid === undefined ||
      user.username === undefined ||
      user.useremail === undefined
    ) {
      console.log("user Not loged");
      // setReload(true);
    } else {
      console.log("user loged");
      // console.log(user);
      setReload(true);
    }
  }, [reload]);

  const getDataUserFunct = async () => {
    // console.log("Trayendo data del usuario...");
    const res = await getDataUser(user.uuid)
    console.log(user.uuid);
    setUser({
      uuid: user.uuid,
      username: user.username,
      useremail: user.useremail,
      profile: res.data.perfil,
      phone: res.data.telefono,
      saldo: res.data.saldo,
      timeStamp: res.data.create_at,
      edad: res.data.edad
    });
  };

  const CambiatFoto = async (e) => {
    e.preventDefault()
    const formData = new FormData(formRef.current);
    let resp = await (await ChangePicture(formData)).data.data.perfil

    cookies.set("perfil", resp, { path: "/" });
    setTimeout(() => {
      setReload(!reload);
    }, 2000);


  };

  const AgregarTelefono = (e) => {
    cookies.set("Phone", e.target[0].value, { path: "/" });
    setReload(false);

    e.preventDefault()
    ChangePhoneNumber({ user, phone: e.target[0].value })

  };
  const EnviarMensajetel = () => {
    // setReload(false);
    EnviarMensaje(user)

  };

  return (
    <Fragment>
      {user.username === undefined ? (
        <Fragment>
          <section className="popup">
            <h1>Usted no esta logueado en esta pagina </h1>
            <h3>
              porfavor haga click en el boton de ingreso para hacerlo o
              registrese si no lo a hecho aun!
            </h3>
            <section>
              <Link to="/ingreso" className="nav-link">
                ingreso
              </Link>
              <Link to="/registro" className="nav-link">
                Registro
              </Link>
            </section>
          </section>
        </Fragment>
      ) : (
        <Fragment>
          <section className="SecUser" id="SecUser">
            <NavBar />
            <div className="UsuariioGrid" id="UsuariioGrid">
              <div className="UsuarioName">
                <div>
                  <section className="Photoss" id="Photos">
                    <img src={user.profile} alt="" />
                  </section>

                  <section className="info" id="info">
                    <h2 id="H2User">{user.username}</h2>
                    <small>{user.useremail}</small>
                    <p>usuario desde: 25/7/2021</p>
                  </section>
                </div>

                <form
                  onSubmit={CambiatFoto}
                  ref={formRef}>
                  <input type="file" accept="image/*" name="File" id="File" />
                  <input type="hidden" name="uuid" id="uuid" value={user.uuid} />
                  {/* <input type="hidden" name="Estotienequequedaraca" /> */}
                  <input type="submit" id="CambiarFoto" value="Cambiar Foto" />
                </form>
              </div>
              <div className="UsuarioWallet">
                <h3>Cartera De Usuario</h3>
                <h4>Divisa: Pesos Argentinos</h4>
                <p>Billetera: ${user.saldo}</p>
                <p>Telefono +{user.phone}</p>
                <a href=""
                  onClick={() => {
                    EnviarMensajetel()
                  }}>Enviar Mensaje De Prueba</a>
              </div>
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
}

export default Chat;
