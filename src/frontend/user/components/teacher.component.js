import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Card, Icon, Segment, Label } from "semantic-ui-react";

export default function Teacher() {
    return (
        <>
            <Card.Group stackable>
                <Link className="ui raised card" to="/assigned-subjects">
                    <Label color="teal" corner="right" size="small">
                        <Icon name="book"/>
                    </Label>
                    <Card.Content>
                        <Card.Header>Manage Assigned Subjects</Card.Header>
                        <Card.Meta>subject.class.name</Card.Meta>
                        <Card.Description>subject.content</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Icon name='user'/>
                        22 Friends
                    </Card.Content>
                </Link>
            </Card.Group>
        </>
    );
}
