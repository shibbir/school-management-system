import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Card, Icon, Segment } from "semantic-ui-react";
import Admin from "./admin.component";
import Teacher from "./teacher.component";
import Pupil from "./pupil.component";

export default function Dashboard() {
    return (
        <>
            <Admin/>
            <Teacher/>
            <Pupil/>
        </>
    );
}
