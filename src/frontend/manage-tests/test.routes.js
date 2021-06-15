import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";

import PupilGrades from "./components/pupil-grades.component";
import ManageTests from "./components/manage-tests.component";
import AssignedSubjects from "./components/assigned-subjects.component";
import PrivateRoute from "../core/components/private-route.component";

export default function TestRoutes() {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <PrivateRoute exact path={path} component={AssignedSubjects} roles={["teacher"]}/>
            <PrivateRoute exact path={`${path}/pupil-grades`} component={PupilGrades} roles={["teacher"]}/>
            <PrivateRoute exact path={`${path}/manage-tests`} component={ManageTests} roles={["teacher"]}/>
        </Switch>
    );
}
