import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import ClassList from "./class-list.component";
import PrivateRoute from "../core/components/private-route.component";

export default function ClassRoutes() {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <PrivateRoute exact path={path} component={ClassList}/>
        </Switch>
    );
}
