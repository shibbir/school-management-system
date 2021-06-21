import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";

import PupilSubjectsOverview from "./pupil-subjects.component";
import PrivateRoute from "../../core/components/private-route.component";

export default function UserRoutes() {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <PrivateRoute exact path={path} component={PupilSubjectsOverview} roles={["pupil"]}/>
        </Switch>
    );
}
