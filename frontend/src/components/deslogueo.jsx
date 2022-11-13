import { Fragment, useState, useEffect } from "react";
import { useRedirect } from "react-admin";
import Cookies from "universal-cookie";

import "./App.css";

function Delog() {
  const cookies = new Cookies();

  const redirect = useRedirect();
  const [reload, setReload] = useState(false);
  const UserName = cookies.get("nombre");

  useEffect(() => {
    setTimeout(() => {
      cookies.remove("uuid");
      cookies.remove("id");
      cookies.remove("nombre");
      cookies.remove("email");
      cookies.remove("edad");
      cookies.remove("admin");
      cookies.remove("contraseña");
      cookies.remove("telefono");
      cookies.remove("perfil");

      redirect("/");
    }, 6000);
  }, [reload]);

  return (
    <Fragment>
      <h1 className="saludo">Hasta la proxima {UserName}!!</h1>
    </Fragment>
  );
}

export default Delog;
