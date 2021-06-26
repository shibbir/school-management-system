import React from "react";
import { Link } from "react-router-dom";
import { Card, Icon, Label, Feed } from "semantic-ui-react";

export default function Admin() {
    return (
        <Card.Group itemsPerRow={3} stackable>
            <Link className="ui raised card" to="/manage-users">
                <Label color="blue" corner="right" size="small">
                    <Icon name="user"/>
                </Label>
                <Card.Content extra>
                    <Card.Header>User Management</Card.Header>
                </Card.Content>
                <Card.Content>
                    <Feed>
                        <Feed.Event>
                            <Feed.Label icon="users"/>
                            <Feed.Content>
                                <Feed.Date content="Overview of All Users"/>
                                <Feed.Summary>
                                    View all types of users currently registered into the system.
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>

                        <Feed.Event>
                            <Feed.Label icon="sign in"/>
                            <Feed.Content>
                                <Feed.Date content="Manage User Registration"/>
                                <Feed.Summary>
                                    Create new users with roles. Remove existing users.
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>

                        <Feed.Event>
                            <Feed.Label icon="pencil"/>
                            <Feed.Content>
                                <Feed.Date content="Update User Attributes"/>
                                <Feed.Summary>
                                    Modify user attributes such as forename, surname, etc.
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>
                    </Feed>
                </Card.Content>
            </Link>

            <Link className="ui raised card" to="/manage-classes">
                <Label color="blue" corner="right" size="small">
                    <Icon name="certificate"/>
                </Label>
                <Card.Content extra>
                    <Card.Header>Class Management</Card.Header>
                </Card.Content>
                <Card.Content>
                    <Feed>
                        <Feed.Event>
                            <Feed.Label icon="certificate"/>
                            <Feed.Content>
                                <Feed.Date content="Manage Classes"/>
                                <Feed.Summary>
                                    View and export all classes currently in the system. Create, modify, remove classes.
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>

                        <Feed.Event>
                            <Feed.Label icon="book"/>
                            <Feed.Content>
                                <Feed.Date content="Subjects Assignment"/>
                                <Feed.Summary>
                                    Manage bulk assignments or deassignments of subjects into a class.
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>

                        <Feed.Event>
                            <Feed.Label icon="student"/>
                            <Feed.Content>
                                <Feed.Date content="Pupils Enrolment"/>
                                <Feed.Summary>
                                    Manage bulk assignments or deassignments of pupils into a class.
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>
                    </Feed>
                </Card.Content>
            </Link>

            <Link className="ui raised card" to="/manage-subjects">
                <Label color="blue" corner="right" size="small">
                    <Icon name="book"/>
                </Label>
                <Card.Content extra>
                    <Card.Header>Subject Management</Card.Header>
                </Card.Content>
                <Card.Content>
                    <Feed>
                        <Feed.Event>
                            <Feed.Label icon="book"/>
                            <Feed.Content>
                                <Feed.Date content="Manage Subjects"/>
                                <Feed.Summary>
                                    View and export all subjects currently available in the system.
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>

                        <Feed.Event>
                            <Feed.Label icon="pencil"/>
                            <Feed.Content>
                                <Feed.Date content="Manage Subjects"/>
                                <Feed.Summary>
                                    Create, modify, remove, archive subjects. Assign teacher per subject.
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
                <Card.Content extra>
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
                                    Change your sign in password.
                                </Feed.Summary>
                            </Feed.Content>
                        </Feed.Event>
                    </Feed>
                </Card.Content>
            </Link>
        </Card.Group>
    );
}
