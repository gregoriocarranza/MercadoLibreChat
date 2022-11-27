import React, { Fragment, useRef } from "react";
import { useEffect } from "react";

import "./App.css";
import Card from "./Card.jsx";




function ChatList({ props }) {
    console.log(props);

    const bottomRef = useRef(null);

    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [props]);

    return (
        <Fragment>
            {props?.map((u) => ((
                // console.log(u);

                <Card key={u.id} props={u} />

            )))}
            <div ref={bottomRef} />
        </Fragment>
    )
}

export default ChatList;
