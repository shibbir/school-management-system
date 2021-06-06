import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Menu, Container, Icon, Label } from "semantic-ui-react";

export default function Navbar() {
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
                    <a href="/api/logout" className="ui button black" style={{marginLeft: '5px'}}><Icon name="sign out"/> Sign Out</a>
                </div>
            </Container>
        </Menu>
    );
}
