import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";

import "fomantic-ui-css/semantic.css";
import "izitoast/dist/css/iziToast.css";
import "./app.component.css";

//import NoMatch from "./NoMatch";
import PublicRoute from "./public-route.component";
import PrivateRoute from "./private-route.component";
import Login from "../user/components/login.component";
//import Profile from "../../user/client/components/profile.component";
import Dashboard from "../user/components/dashboard.component";
import { getSignedInUserProfile } from "../user/user.actions";

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
            {/* <PrivateRoute path="/profile" component={Profile}/> */}

            {/* <Route component={NoMatch}/> */}
        </Switch>
    );
}
