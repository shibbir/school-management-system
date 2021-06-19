import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";

import "fomantic-ui-css/semantic.css";
import "izitoast/dist/css/iziToast.css";
import "./app.component.css";

import Forbidden from "./components/forbidden.component";
import NoMatch from "./components/nomatch-route.component";
import PublicRoute from "./components/public-route.component";
import PrivateRoute from "./components/private-route.component";
import Login from "../manage-users/components/login.component";
import Profile from "../manage-users/components/profile.component";
import Dashboard from "../manage-users/components/dashboard.component";

import UserRoutes from "../manage-users/user.routes";
import ClassRoutes from "../manage-classes/class.routes";
import AssignedSubjectsRoutes from "../manage-tests/test.routes";

import { getSignedInUserProfile } from "../manage-users/user.actions";

let refCount = 0;

function setLoading(isLoading) {
    if (isLoading) {
        refCount++;
        document.getElementById("loader").style = "display: block";
    } else if (refCount > 0) {
        refCount--;
        if(refCount > 0) document.getElementById("loader").style = "display: block";
        else document.getElementById("loader").style = "display: none";
    }
}

axios.interceptors.request.use(config => {
    setLoading(true);
    return config;
}, error => {
    setLoading(false);
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    setLoading(false);
    return response;
}, error => {
    setLoading(false);
    return Promise.reject(error);
});

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSignedInUserProfile());
    }, [dispatch]);

    return (
        <Switch>
            <PublicRoute path="/login" component={Login}/>

            <PrivateRoute exact path="/" component={Dashboard}/>

            <PrivateRoute path="/profile" component={Profile}/>

            <Route path="/manage-users" component={UserRoutes}/>

            <Route path="/manage-classes" component={ClassRoutes}/>

            <Route path="/assigned-subjects" component={AssignedSubjectsRoutes}/>

            <Route path="/forbidden" component={Forbidden}/>

            <Route component={NoMatch}/>
        </Switch>
    );
}
