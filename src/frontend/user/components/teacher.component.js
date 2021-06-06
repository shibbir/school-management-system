import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Card, Icon, Segment } from "semantic-ui-react";

export default function Teacher() {
    return (
        <>
            <Card.Group itemsPerRow={5} stackable>
                <Link className="ui raised card" to={`/items/2`}>
                    <Card.Content className="ui center aligned">
                        <Card.Header>Manage Tests</Card.Header>
                        <Card.Description>
                            Manage tests of assigned subjects.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Icon name='user' />
                        22 Friends
                    </Card.Content>
                </Link>
            </Card.Group>
        </>
    );
}
