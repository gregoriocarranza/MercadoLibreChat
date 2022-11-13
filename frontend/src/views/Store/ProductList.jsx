import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import "./App.css";

import Cards from "./Cards.jsx";


function ProductList({props}) {
    // console.log(props);

    return (
        <Fragment>
            {props?.map((u) => (
                <Fragment>
                    {/* {console.log(u)} */}
                    <Cards key={u.id} prod={u} />
                </Fragment>
            ))}
        </Fragment>
    )
}

export default ProductList;
