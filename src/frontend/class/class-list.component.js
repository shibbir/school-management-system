import { FormattedDate } from "react-intl";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Divider, Segment, Button, Table, Modal, Header, TransitionablePortal, Dropdown, Label } from "semantic-ui-react";

import ClassForm from "./class-form.component";
import { getClasses } from "./class.actions";

import Subjects from "../subject/subjects.component";

export default function ClassList() {
    const dispatch = useDispatch();
    const [classId, setClassId] = useState(undefined);
    const [program, setProgram] = useState(undefined);

    useEffect(() => {
        dispatch(getClasses());
    }, []);

    const classes = useSelector(state => state.classReducer.classes);

    const rows = classes.map(function(row, index) {
        return (
            <Table.Row key={row._id}>
                <Table.Cell>{index+1}</Table.Cell>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.subjects.length}</Table.Cell>
                <Table.Cell>{row.pupils.length}</Table.Cell>
                <Table.Cell>{`${row.updated_by.forename} ${row.updated_by.surname}`}</Table.Cell>
                <Table.Cell><FormattedDate value={row.updated_at} day="2-digit" month="long" year="numeric"/></Table.Cell>
                <Table.Cell>
                    <Dropdown>
                        <Dropdown.Menu>
                            <Dropdown.Item icon="edit" text="Update Attributes" onClick={() => setClassId(row._id)}/>
                            <Dropdown.Item icon="book" text="Manage Subjects" onClick={() => setProgram({_id: row._id, name: row.name})}/>
                            <Dropdown.Item icon="users" text="Assign Pupils"/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
            </Table.Row>
        );
    });

    return (
        <>
            <Button floated="right" primary size="small" onClick={() => setClassId(null)}>
                Create a new class
            </Button>

            <TransitionablePortal open={classId !== undefined} transition={{ animation: "scale", duration: 400 }}>
                <Modal dimmer size="tiny" open={true}>
                    <Modal.Header>Class Form</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <ClassForm id={classId}/>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={() => setClassId(undefined)}>
                            Close
                        </Button>
                    </Modal.Actions>
                </Modal>
            </TransitionablePortal>

            <TransitionablePortal open={program !== undefined} transition={{ animation: "scale", duration: 400 }}>
                <Modal dimmer size="small" open={true}>
                    <Modal.Header>Manage subjects of  <Label color="teal" size="medium">{program && program.name}</Label> class</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Subjects class_id={program && program._id}/>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={() => setProgram(undefined)}>
                            Close
                        </Button>
                    </Modal.Actions>
                </Modal>
            </TransitionablePortal>

            <Divider hidden clearing/>
            { classes.length > 0 &&
                <>
                    <Table selectable compact>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>#</Table.HeaderCell>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Subjects</Table.HeaderCell>
                                <Table.HeaderCell>Pupils</Table.HeaderCell>
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

            { classes.length === 0 &&
                <Segment placeholder raised>
                    <Header icon>
                        <Icon name="warning sign"/>
                        No classes are available!
                    </Header>
                </Segment>
            }
        </>
    );
}
