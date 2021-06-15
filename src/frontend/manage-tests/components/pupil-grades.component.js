import { capitalize } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Segment, Header, Button, Table, Dropdown, Modal } from "semantic-ui-react";

import { getAssignedSubjects } from "../../user/user.actions";

export default function PupilGrades({ subject_id }) {
    const dispatch = useDispatch();
    const [subjectIdForGrades, setSubjectIdForGrades] = useState(undefined);
    const [subjectIdForTests, setSubjectIdForTests] = useState(undefined);

    useEffect(() => {
        dispatch(getAssignedSubjects());
    }, [subject_id]);

    const assigned_subjects = useSelector(state => state.userReducer.assigned_subjects);

    const rows = assigned_subjects.map(function(subject, index) {
        return (
            <Table.Row key={subject.id}>
                <Table.Cell>{index+1}</Table.Cell>
                <Table.Cell>{subject.class.name}</Table.Cell>
                <Table.Cell>{subject.name}</Table.Cell>
                <Table.Cell>{subject.credit_point}</Table.Cell>
                <Table.Cell>{capitalize(subject.status)}</Table.Cell>
                <Table.Cell>
                    <Dropdown>
                        <Dropdown.Menu>
                            <Dropdown.Item icon="edit" text="View Grades" onClick={() => setSubjectIdForGrades(subject.id)}/>
                            <Dropdown.Item icon="archive" text="Manage Tests" onClick={() => setSubjectIdForTests(subject.id)}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
            </Table.Row>
        );
    });

    return (
        <>
            <Modal dimmer size="tiny" open={subjectIdForGrades !== undefined}>
                <Modal.Header>Pupil Grades</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        { assigned_subjects.length > 0 &&
                            <Table selectable>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>#</Table.HeaderCell>
                                        <Table.HeaderCell>Class Name</Table.HeaderCell>
                                        <Table.HeaderCell>Subject Name</Table.HeaderCell>
                                        <Table.HeaderCell>Credit Point</Table.HeaderCell>
                                        <Table.HeaderCell>Status</Table.HeaderCell>
                                        <Table.HeaderCell>Actions</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {rows}
                                </Table.Body>
                            </Table>
                        }

                        { assigned_subjects.length === 0 &&
                            <Segment placeholder raised>
                                <Header icon>
                                    <Icon name="book"/>
                                    No data found.
                                </Header>
                            </Segment>
                        }
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={() => subjectIdForGrades(undefined)}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    );
}
