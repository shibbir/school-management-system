import React from "react";
import { Link } from "react-router-dom";
import { Card, Icon, Feed, Label } from "semantic-ui-react";

export default function Admin() {
    return (
        <Card.Group itemsPerRow={3} stackable>
            <Link className="ui raised card" to="/assigned-subjects">
                <Label color="blue" corner="right" size="small">
                    <Icon name="book"/>
                </Label>
                <Card.Content>
                    <Card.Header>Assigned Subjects Management</Card.Header>
                </Card.Content>
                <Card.Content>
                    <Feed>
                        <Feed.Event>
                            <Feed.Label icon="book"/>
                            <Feed.Content>
                                <Feed.Date content="Overview of All Assigned Subjects"/>
                                <Feed.Summary>
                                    View all the subejcts that are assigned to you.
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>

                        <Feed.Event>
                            <Feed.Label icon="student"/>
                            <Feed.Content>
                                <Feed.Date content="Overview of Pupil Grades"/>
                                <Feed.Summary>
                                    List all the pupils along with their average grades.
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>

                        <Feed.Event>
                            <Feed.Label icon="lab"/>
                            <Feed.Content>
                                <Feed.Date content="Manage Tests"/>
                                <Feed.Summary>
                                    List, create, modify, remove test. Manage test results of each test.
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>
                    </Feed>
                </Card.Content>
            </Link>

            <Link className="ui raised card" to="/profile">
                <Label color="blue" corner="right" size="small">
                    <Icon name="id badge"/>
                </Label>
                <Card.Content>
                    <Card.Header>Profile Management</Card.Header>
                </Card.Content>
                <Card.Content>
                    <Feed>
                        <Feed.Event>
                            <Feed.Label icon="info"/>
                            <Feed.Content>
                                <Feed.Date content="Manage Personal Attributes"/>
                                <Feed.Summary>
                                    Modify personal attributes such as forename, surname, username, etc.
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>

                        <Feed.Event>
                            <Feed.Label icon="key"/>
                            <Feed.Content>
                                <Feed.Date content="Change Password"/>
                                <Feed.Summary>
                                    Create, modify, remove, archive subjects. Assign teacher per subject.
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>

                        <Feed.Event>
                            <Feed.Label icon="mail"/>
                            <Feed.Content>
                                <Feed.Date content="Pupils Enrolment"/>
                                <Feed.Summary>
                                    Perform bulk assignments or deassignments of pupils into a class.
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>
                    </Feed>
                </Card.Content>
            </Link>
        </Card.Group>
    );
}
