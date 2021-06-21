import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Divider, Grid, Segment, Breadcrumb } from "semantic-ui-react";

import UserForm from "./user-form.component";
import ChangePassword from "./change-password.component";

export default function Profile() {
    const loggedInUser = useSelector(state => state.userReducer.loggedInUser);

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Section><Link to="/">Dashboard</Link></Breadcrumb.Section>
                <Breadcrumb.Divider>/</Breadcrumb.Divider>
                <Breadcrumb.Section active>My Profile</Breadcrumb.Section>
            </Breadcrumb>

            <Divider hidden clearing/>

            <Segment>
                <Grid columns={2} relaxed="very" stackable>
                    <Grid.Column>
                        <h3>Manage personal attributes</h3>
                        <Divider section/>
                        <UserForm id={loggedInUser.id}/>
                    </Grid.Column>

                    <Grid.Column>
                        <h3>Manage password</h3>
                        <Divider section/>
                        <ChangePassword/>
                    </Grid.Column>
                </Grid>

                <Divider vertical>Or</Divider>
            </Segment>
        </>
    );
}
