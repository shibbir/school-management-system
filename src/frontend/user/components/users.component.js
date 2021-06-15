import { capitalize } from "lodash";
import { FormattedDate } from "react-intl";
import iziToast from "izitoast/dist/js/iziToast";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Divider, Segment, Button, Table, Modal, Header, TransitionablePortal, Dropdown } from "semantic-ui-react";

import UserForm from "./user-form.component";
import { getUsers, deleteUser } from "../user.actions";

export default function ClassList() {
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(undefined);

    useEffect(() => {
        dispatch(getUsers());
    }, []);

    const users = useSelector(state => state.userReducer.users);

    const rows = users.map(function(row, index) {
        return (
            <Table.Row key={row.id}>
                <Table.Cell>{index+1}</Table.Cell>
                <Table.Cell>{row.forename}</Table.Cell>
                <Table.Cell>{row.surname}</Table.Cell>
                <Table.Cell>{row.username}</Table.Cell>
                <Table.Cell>{capitalize(row.role)}</Table.Cell>
                <Table.Cell>{`${row.modifier.forename} ${row.modifier.surname}`}</Table.Cell>
                <Table.Cell><FormattedDate value={row.updated_at} day="2-digit" month="long" year="numeric"/></Table.Cell>
                <Table.Cell>
                    <Dropdown>
                        <Dropdown.Menu>
                            <Dropdown.Item icon="edit" text="Update Attributes" onClick={() => setUserId(row.id)}/>
                            <Dropdown.Item icon="trash" text="Remove User" onClick={() => onDeleteUser(row.id)}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
            </Table.Row>
        );
    });

    const onDeleteUser = id => {
        if(confirm("Are you sure you want to remove the user?")) {
            dispatch(deleteUser(id)).then(function() {
                iziToast["success"]({
                    timeout: 3000,
                    message: "Your changes are saved.",
                    position: "topRight"
                });
            }).catch(function(err) {
                iziToast["error"]({
                    timeout: 3000,
                    message: err ? err.response.data : "An error occurred. Please try again.",
                    position: "topRight"
                });
            });
        }
    };

    return (
        <>
            <Button floated="right" primary size="small" onClick={() => setUserId(null)}>
                Create new user
            </Button>

            <TransitionablePortal open={userId !== undefined} transition={{ animation: "scale", duration: 400 }}>
                <Modal dimmer size="tiny" open={true}>
                    <Modal.Header>User Form</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <UserForm id={userId}/>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={() => setUserId(undefined)}>
                            Close
                        </Button>
                    </Modal.Actions>
                </Modal>
            </TransitionablePortal>

            <Divider hidden clearing/>
            { users.length > 0 &&
                <>
                    <Table selectable compact>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>#</Table.HeaderCell>
                                <Table.HeaderCell>Forename</Table.HeaderCell>
                                <Table.HeaderCell>Surname</Table.HeaderCell>
                                <Table.HeaderCell>Username</Table.HeaderCell>
                                <Table.HeaderCell>Role</Table.HeaderCell>
                                <Table.HeaderCell>Updated By</Table.HeaderCell>
                                <Table.HeaderCell>Updated At</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {rows}
                        </Table.Body>
                    </Table>
                </>
            }

            { users.length === 0 &&
                <Segment placeholder raised>
                    <Header icon>
                        <Icon name="user"/>
                        No users are available!
                    </Header>
                </Segment>
            }
        </>
    );
}
