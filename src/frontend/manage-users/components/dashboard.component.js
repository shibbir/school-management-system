import React from "react";
import { useSelector } from "react-redux";
import { Message, Divider } from "semantic-ui-react";

import Admin from "./admin.component";
import Pupil from "./pupil.component";
import Teacher from "./teacher.component";

export default function Dashboard() {
    const loggedInUser = useSelector(state => state.userReducer.loggedInUser);

    return (
        <>
            <Message
                info
                icon="info"
                header="Welcome to the School Management System v0.1.0"
                content="Select any of the below services to get started. These services are curated based on your role."
            />

            <Divider hidden/>

            { loggedInUser && loggedInUser.role === "admin" && <Admin/> }

            { loggedInUser && loggedInUser.role === "teacher" && <Teacher/> }

            { loggedInUser && loggedInUser.role === "pupil" && <Pupil/> }
        </>
    );
}
