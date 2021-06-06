import { Link } from "react-router-dom";
import { FormattedDate } from "react-intl";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Divider, Segment, Button, Table, Modal, Header, TransitionablePortal, Dropdown } from "semantic-ui-react";

import SubjectForm from "./subject-form.component";
import { getSubjects } from "./subject.actions";

export default function SubjectList({ class_id } = props) {
    const dispatch = useDispatch();
    const [subjectId, setSubjectId] = useState(undefined);

    useEffect(() => {
        if(class_id) {
            dispatch(getSubjects(`?class_id=${class_id}`));
        }
    }, [class_id]);

    const subjects = useSelector(state => state.subjectReducer.subjects);

    const rows = subjects.map(function(row, index) {
        return (
            <Table.Row key={row._id}>
                <Table.Cell>{index+1}</Table.Cell>
                <Table.Cell>{row.class.name}</Table.Cell>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.status}</Table.Cell>
                <Table.Cell>{row.teacher.name}</Table.Cell>
                <Table.Cell>{row.updated_by}</Table.Cell>
                <Table.Cell><FormattedDate value={row.updated_at} day="2-digit" month="long" year="numeric"/></Table.Cell>
                <Table.Cell>
                    <Dropdown>
                        <Dropdown.Menu>
                            <Dropdown.Item icon="edit" text="Update Attributes" onClick={() => setSubjectId(row._id)}/>
                            <Dropdown.Item icon="users" text="Assign Pupils"/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
            </Table.Row>
        );
    });

    return (
        <>
            <Button
                primary
                icon="arrow right"
                labelPosition="right"
                floated="right"
                content="Create a new subject"
                onClick={() => setSubjectId(null)}
            />

            <TransitionablePortal open={subjectId !== undefined} transition={{ animation: "scale", duration: 400 }}>
                <Modal dimmer size="tiny" open={true}>
                    <Modal.Header>Subject Form</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <SubjectForm id={subjectId}/>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={() => setSubjectId(undefined)}>
                            Close
                        </Button>
                    </Modal.Actions>
                </Modal>
            </TransitionablePortal>

            <Divider hidden clearing/>
            { subjects.length > 0 &&
                <>
                    <Table selectable compact>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>#</Table.HeaderCell>
                                <Table.HeaderCell>Class Name</Table.HeaderCell>
                                <Table.HeaderCell>Subject Name</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell>Teacher</Table.HeaderCell>
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

            { subjects.length === 0 &&
                <Segment placeholder>
                    <Header icon>
                        <Icon name="book"/>
                        No subjects are available to assign to the class.
                    </Header>
                </Segment>
            }
        </>
    );
}
