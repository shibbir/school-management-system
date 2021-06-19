import { Link } from "react-router-dom";
import { Card, Icon } from "semantic-ui-react";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getUsers } from "../user.actions";

export default function Admin() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUsers());
    }, []);

    const users = useSelector(state => state.userReducer.users);

    return (
        <div id="dashboard">
            <Card.Group itemsPerRow={5} stackable>
                <Link className="ui raised card" to="/manage-users" disabled={false}>
                    <Card.Content className="ui center aligned">
                        <Card.Header>Manage Users</Card.Header>
                        <Card.Description>
                            Manage different types of users in the system.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Icon name="user"/>
                        {users.length} Users
                    </Card.Content>
                </Link>

                <Link className="ui raised card" to="/manage-classes">
                    <Card.Content className="ui center aligned">
                        <Card.Header>Manage Classes</Card.Header>
                        <Card.Description>
                            Matthew is a musician living in Nashville.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Icon name="certificate"/>
                        22 Classes
                    </Card.Content>
                </Link>
            </Card.Group>
        </div>
    );
}
