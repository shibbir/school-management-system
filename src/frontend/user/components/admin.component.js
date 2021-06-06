import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Card, Icon, Segment } from "semantic-ui-react";

export default function Admin() {
    return (
        <div id="dashboard">
            <Card.Group itemsPerRow={5} stackable>
                <Link className="ui raised card" to="/manage-users">
                    <Card.Content className="ui center aligned">
                        <Card.Header>Manage Users</Card.Header>
                        <Card.Description>
                            Manage different types of users in the system.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Icon name="user"/>
                        22 Users
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

                <Link className="ui raised card" to={`/items/2`}>
                    <Card.Content className="ui center aligned">
                        <Card.Header>Manage Subjects</Card.Header>
                        <Card.Description>
                            Matthew is a musician living in Nashville.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Icon name="book"/>
                        22 Friends
                    </Card.Content>
                </Link>
            </Card.Group>
        </div>
    );
}
