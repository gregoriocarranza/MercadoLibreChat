import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRedirect } from "react-admin";

import Cookies from "universal-cookie";

import { CheckUser } from "../Api.jsx";

import "./App.css";

function Login() {
  const cookies = new Cookies();
  const redirect = useRedirect();

  const [loggued, setLoggued] = useState(true);
  const [reload, setReload] = useState(false);
  const [incorrect, setIncorrect] = useState(false);

  useEffect(() => {
    const UserUuid = cookies.get("uuid");
    if (UserUuid === undefined) {
      console.log("user Not loged");
      setLoggued(true);
      setReload(true);
    } else {
      console.log("user loged");
      setLoggued(false);
      setReload(true);
    }
  }, [reload]);
  const formRef = React.useRef();

  const EnviarForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const values = Object.fromEntries(formData);

    if (values.NAME === "" || values.PASSWORD === "") {
      console.log("Todos los datos deben estar completados");
      return;
    }
    const res = await CheckUser(values);
    const UserData = res.data.data;
    console.log(res.data);
    console.log(UserData);

    if (res.data.CODE === "CONTRASENIAINCORRECTA") {
      // console.log("La combinacion de mail + contraseña no a sido efectiva");
      setIncorrect(true);
    } else {
      Object.keys(UserData).map((u) => {
        // console.log(UserData[u]);
        cookies.set(u, UserData[u], { path: "/" });
      });
      setLoggued(false);
      setReload(!reload);
    }
  };

  if (incorrect) {
    return (
      <Fragment>
        <section className="reg2">
          <h1>La combinacion de mail y contraseña no a sido correcta</h1>
          <h3>
            Porfavor asegurese de que sus credenciales esten bien escritas
          </h3>
          <a
            to="/ingreso"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              setIncorrect(false);
            }}
          >
            Intentelo nuevamente
          </a>
        </section>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        {loggued ? (
          <Fragment>
            <Link to="/registro" className="nav-link">
              Register
            </Link>
            <section className="registro">
              <h1>Seccion de Logueo</h1>
              <form action="" method="" onSubmit={EnviarForm} ref={formRef}>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Ingrese un Email"
                />
                <input
                  type="contraseña"
                  name="contraseña"
                  id="contraseña"
                  placeholder="Ingrese una Contraseña"
                />
                <input type="submit" id="submit" value="Loguear" />
              </form>
            </section>
          </Fragment>
        ) : (
          <section className="reg2">
            <h1>Ya se encuentra logueado</h1>
            {redirect("/")}
            <Link to="/" className="nav-link">
              ingreso
            </Link>
          </section>
        )}
      </Fragment>
    );
  }
}

export default Login;
