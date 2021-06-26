import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";

import Subjects from "./components/subjects.component";
import PrivateRoute from "../core/components/private-route.component";

export default function ClassRoutes() {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <PrivateRoute exact path={path} component={Subjects} roles={["admin"]}/>
        </Switch>
    );
}
