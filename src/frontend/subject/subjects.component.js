import { capitalize } from "lodash"
import { FormattedDate } from "react-intl";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Divider, Segment, Button, Table, Modal, Header, Dropdown } from "semantic-ui-react";

import SubjectForm from "./subject-form.component";
import { getSubjects, deleteSubject, archiveSubject } from "./subject.actions";

export default function SubjectList({ class_id } = props) {
    const dispatch = useDispatch();
    const [subjectId, setSubjectId] = useState(undefined);

    useEffect(() => {
        if(class_id) {
            dispatch(getSubjects(class_id));
        }
    }, [class_id]);

    const subjects = useSelector(state => state.subjectReducer.subjects);

    const onArchiveSubject = function(suhbject_id) {
        if(confirm("Are you sure you want to archive the subject?")) {
            dispatch(archiveSubject(class_id, suhbject_id, "archived"));
        }
    };

    const onDeleteSubject = function(suhbject_id) {
        if(confirm("Are you sure you want to remove the subject?")) {
            dispatch(deleteSubject(class_id, suhbject_id));
        }
    };

    const rows = subjects.map(function(subject, index) {
        return (
            <Table.Row key={subject._id}>
                <Table.Cell>{index+1}</Table.Cell>
                <Table.Cell>{subject.name}</Table.Cell>
                <Table.Cell>{`${subject.teacher.forename} ${subject.teacher.surname}`}</Table.Cell>
                <Table.Cell>{capitalize(subject.status)}</Table.Cell>
                <Table.Cell><FormattedDate value={subject.updated_at} day="2-digit" month="long" year="numeric"/></Table.Cell>
                <Table.Cell>
                    <Dropdown>
                        <Dropdown.Menu>
                            { subject.status !== "archived" &&
                                <>
                                    <Dropdown.Item icon="edit" text="Update Attributes" onClick={() => setSubjectId(subject._id)}/>
                                    { subject.tests.length > 0 && <Dropdown.Item icon="archive" text="Archive Subject" onClick={() => onArchiveSubject(subject._id)}/> }
                                    { subject.tests.length === 0 && <Dropdown.Item icon="trash" text="Remove Subject" onClick={() => onDeleteSubject(subject._id)}/> }
                                </>
                            }
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

            <Modal dimmer size="tiny" open={subjectId !== undefined}>
                <Modal.Header>Subject Form</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <SubjectForm class_id={class_id} subject_id={subjectId}/>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={() => setSubjectId(undefined)}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>

            <Divider hidden clearing/>
            { subjects.length > 0 &&
                <>
                    <Table selectable compact>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>#</Table.HeaderCell>
                                <Table.HeaderCell>Subject Name</Table.HeaderCell>
                                <Table.HeaderCell>Teacher</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
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
