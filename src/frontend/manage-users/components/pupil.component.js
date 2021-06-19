import React from "react";
import { Link } from "react-router-dom";
import { Card, Icon } from "semantic-ui-react";

export default function Admin() {
    return (
        <div id="dashboard">
            <Card.Group itemsPerRow={5} stackable>
                <Link className="ui raised card" to={`/items/2`}>
                    <Card.Content className="ui center aligned">
                        <Card.Header>Subjects Overview</Card.Header>
                        <Card.Meta>
                            <span className='date'>Joined in 2015</span>
                        </Card.Meta>
                        <Card.Description>
                            Matthew is a musician living in Nashville.
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Icon name='user' />
                        22 Friends
                    </Card.Content>
                </Link>
            </Card.Group>
        </div>
    );
}
