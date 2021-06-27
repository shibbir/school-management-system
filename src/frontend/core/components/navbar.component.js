import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Container, Icon, Label, Button } from "semantic-ui-react";

import { logout } from "../../manage-users/user.actions";

export default function Navbar() {
    const dispatch = useDispatch();
    const loggedInUser = useSelector(state => state.userReducer.loggedInUser);

    return (
        <Menu stackable borderless>
            <Container>
                <Menu.Item header style={{paddingLeft: 0, paddingRight: 0}}>
                    <Icon name="graduation cap" size="big"/>
                </Menu.Item>
                <Menu.Item header style={{paddingLeft: 0}}>
                    School Management System
                    <div style={{paddingLeft: "5px"}}>
                        <Label color="teal" tag>Version 0.1.0</Label>
                    </div>
                </Menu.Item>
                <div className="right item" style={{paddingRight: 0}}>
                    <NavLink to="/profile" className="ui button teal"><Icon name="user"/> {`${loggedInUser.forename} ${loggedInUser.surname}`}</NavLink>
                    <Button onClick={() => dispatch(logout())} color="black" style={{marginLeft: '5px'}}><Icon name="sign out"/> Sign Out</Button>
                </div>
            </Container>
        </Menu>
    );
}
