import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";

import TeacherSubjects from "./teacher-subjects.component";
import PrivateRoute from "../../core/components/private-route.component";
import PupilGrades from "../../manage-tests/components/pupil-grades.component";
import ManageTests from "../../manage-tests/components/manage-tests.component";

export default function TestRoutes() {
    const { path } = useRouteMatch();

    return (
        <Switch>
            <PrivateRoute exact path={path} component={TeacherSubjects} roles={["teacher"]}/>
            <PrivateRoute exact path={`${path}/:subject_id/pupil-grades`} component={PupilGrades} roles={["teacher"]}/>
            <PrivateRoute exact path={`${path}/:subject_id/manage-tests`} component={ManageTests} roles={["teacher"]}/>
        </Switch>
    );
}
