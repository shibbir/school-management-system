import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { Container, Divider } from "semantic-ui-react";

import Navbar from "./navbar.component";
import Footer from "./footer.component";

export default function PrivateRoute({ component: Component, roles, ...rest }) {
    const loggedInUser = useSelector(state => state.userReducer.loggedInUser);

    return (
        <Route {...rest} render={props => {
            return (
                loggedInUser && (!roles || roles.includes(loggedInUser.role)) ? (
                    <>
                        <Navbar/>
                        <Container>
                            <Component {...props}/>
                            <Divider hidden/>
                        </Container>
                        <Footer/>
                    </>
                ) : loggedInUser ? (
                    <Redirect push to={{
                        pathname: "/forbidden",
                        state: { from: props.location }
                    }}/>
                ) : (
                    <Redirect push to={{
                        pathname: "/login",
                        state: { from: props.location }
                    }}/>
                )
            )
        }}/>
    );
}
