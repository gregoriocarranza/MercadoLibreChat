import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRedirect } from "react-admin";
import Cookies from "universal-cookie";

import { CrearUsuario } from "../Api.jsx";

import "./App.css";

function Register() {
  const redirect = useRedirect();
  const cookies = new Cookies();
  const formRef = React.useRef();

  const [loggued, setLoggued] = useState(true);
  const [reload, setReload] = useState(false);
  const [existing, setExisting] = useState(false);

  // cookies.set("UserName", "Pacman", { path: "/" /*, maxAge: 10000  */ });
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



  const EnviarForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const values = Object.fromEntries(formData);

    if (values.contraseña !== values.contraseña2) {
      console.log("Las contraseñas no coinciden");
      return;
    }
    if (
      values.nombre === "" ||
      values.contraseña === "" ||
      values.edad === "" ||
      values.contraseña === "" ||
      values.contraseña2 === ""
    ) {
      console.log("Todos los datos deben estar completados");
      return;
    }
    if (values.AGE < 18) {
      console.log("Debes ser mayor de edad para poder registrarte");
      return;
    }
    console.log(values);
    const res = await CrearUsuario(values);
    const UserData = res.data;
    // console.log(UserData);

    if (res.data.CODE === "EMAILEXISTENTE") {
      console.log("este mail ya se encuentra logueado");
      setExisting(true);
    } else {
      Object.keys(UserData).map((u) => {
        // console.log(UserData[u]);
        cookies.set(u, UserData[u], { path: "/" });
      });
      setLoggued(false);
      setReload(true);
    }
  };
  if (existing) {
    return (
      <Fragment>
        <section className="reg2">
          <h1>
            El usuario que intenta registrar y se encuentra en nuestro sistema,
            porfavor inicie sesión
          </h1>
          <Link to="/" className="nav-link">
            ingreso
          </Link>
        </section>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        {loggued ? (
          <Fragment>
            <Link to="/ingreso" className="nav-link">
              Login
            </Link>
            <section className="registro">
              <h1>Seccion de registro</h1>
              <form action="" method="" onSubmit={EnviarForm} ref={formRef}>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  placeholder="Ingrese un nombre"
                />
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Ingrese un Email"
                />
                <input
                  type="password"
                  name="contraseña"
                  id="contraseña"
                  placeholder="Ingrese una Contraseña"
                />
                <input
                  type="password"
                  name="contraseña2"
                  id="contraseña2"
                  placeholder="repita la Contraseña"
                />
                <input
                  type="number"
                  name="edad"
                  id="edad"
                  min="18"
                  max="100"
                  placeholder="Ingrese su edad"
                />
                 <input
                  type="number"
                  name="telefono"
                  id="telefono"
                  placeholder="Ingrese su telefono"
                />
                <input type="submit" id="submit" value="Registrarse" />
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

export default Register;
