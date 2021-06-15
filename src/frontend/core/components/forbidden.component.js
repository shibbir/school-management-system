import React from "react";
import { Container, Icon, Header, Divider, Segment, Button, Statistic } from "semantic-ui-react";

export default function Forbidden() {
    return (
        <Container>
            <Divider hidden/>
            <Segment placeholder>
                <Header icon>
                    <Icon name="ban" color="red" size="massive"/>
                </Header>
                <Statistic color="red" size="huge">
                    <Statistic.Value text>Access Forbidden!</Statistic.Value>
                    <Statistic.Label>Sorry, the page you are trying to access has restrictions.</Statistic.Label>
                </Statistic>
                <Segment.Inline>
                    <Button primary href="/">GO HOME</Button>
                </Segment.Inline>
            </Segment>
        </Container>
    );
}
