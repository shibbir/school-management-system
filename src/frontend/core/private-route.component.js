import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { Container, Divider } from "semantic-ui-react";

export default function PrivateRoute({ component: Component, ...rest }) {
    const loggedInUser = useSelector(state => state.userReducer.loggedInUser);

    return (
        <Route {...rest} render={props => {
            return (
                loggedInUser ? (
                    <>
                        <Container>
                            <Component {...props}/>
                            <Divider hidden/>
                        </Container>
                    </>
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
