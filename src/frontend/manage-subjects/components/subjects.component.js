import axios from "axios";
import { capitalize } from "lodash";
import { Link } from "react-router-dom";
import { FormattedDate } from "react-intl";
import fileDownload from "js-file-download";
import iziToast from "izitoast/dist/js/iziToast";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Divider, Segment, Button, Table, Modal, Header, Dropdown, Breadcrumb, List } from "semantic-ui-react";

import SubjectForm from "./subject-form.component";
import { getSubjects, deleteSubject, updateSubject } from "../subject.actions";

export default function SubjectList() {
    const dispatch = useDispatch();
    const [subjectId, setSubjectId] = useState(undefined);

    useEffect(() => {
        dispatch(getSubjects());
    }, []);

    const subjects = useSelector(state => state.subjectReducer.subjects);

    const onArchiveSubject = function(id) {
        if(confirm("Are you sure you want to archive this subject?")) {
            dispatch(updateSubject(id, { status: "archived" }));
        }
    };

    const onDeleteSubject = function(id) {
        if(confirm("Are you sure you want to remove the subject?")) {
            dispatch(deleteSubject(id));
        }
    };

    const exportData = function() {
        axios.get("/api/subjects/export", {
            responseType: "blob",
        }).then(res => {
            fileDownload(res.data, "subjects.csv");
        }).catch(err => {
            iziToast["error"]({
                timeout: 3000,
                message: "An error occurred. Please try again.",
                position: "topRight"
            });
        });
    };

    const rows = subjects.map(function(subject, index) {
        return (
            <Table.Row key={subject.id}>
                <Table.Cell>{index+1}</Table.Cell>
                <Table.Cell>{subject.name}</Table.Cell>
                <Table.Cell>{capitalize(subject.status)}</Table.Cell>
                <Table.Cell>{`${subject.teacher.forename} ${subject.teacher.surname}`}</Table.Cell>
                <Table.Cell>
                    <List>
                        { subject.classes && subject.classes.map(function(program) {
                            return (
                                <List.Item key={program.id}>
                                    <Icon name="certificate"/>
                                    {program.name}
                                </List.Item>
                            );
                        })}

                        { subject.classes && subject.classes.length === 0 && <>--</> }
                    </List>
                </Table.Cell>
                <Table.Cell><FormattedDate value={subject.updated_at} day="2-digit" month="long" year="numeric"/></Table.Cell>
                <Table.Cell>
                    { subject.status === "archived" &&
                        <Icon name="lock"/>
                    }
                    { subject.status !== "archived" &&
                        <Dropdown>
                            <Dropdown.Menu>
                                <Dropdown.Item icon="edit" text="Update Attributes" onClick={() => setSubjectId(subject.id)}/>
                                { subject.tests && subject.tests.length > 0 && <Dropdown.Item icon="archive" text="Archive Subject" onClick={() => onArchiveSubject(subject.id)}/> }
                                { !subject.tests || subject.tests && subject.tests.length === 0 && <Dropdown.Item icon="trash" text="Remove Subject" onClick={() => onDeleteSubject(subject.id)}/> }
                            </Dropdown.Menu>
                        </Dropdown>
                    }

                </Table.Cell>
            </Table.Row>
        );
    });

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Section><Link to="/">Dashboard</Link></Breadcrumb.Section>
                <Breadcrumb.Divider>/</Breadcrumb.Divider>
                <Breadcrumb.Section active>Available subjects</Breadcrumb.Section>
            </Breadcrumb>

            <Button
                primary
                floated="right"
                content="Create a new subject"
                onClick={() => setSubjectId(null)}
            />

            <Button floated="right" basic onClick={() => exportData()} disabled={subjects.length === 0}>
                <Icon name="download" color="blue"/> Export Data
            </Button>

            <Divider hidden clearing/>

            { subjects.length > 0 &&
                <Table selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>#</Table.HeaderCell>
                            <Table.HeaderCell>Subject Name</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Assigned Teacher</Table.HeaderCell>
                            <Table.HeaderCell>Assigned Classes</Table.HeaderCell>
                            <Table.HeaderCell>Updated At</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
            }

            { subjects.length === 0 &&
                <Segment placeholder>
                    <Header icon>
                        <Icon name="book"/>
                        No subjects are available to assign to the class.
                    </Header>
                </Segment>
            }

            <Modal dimmer size="tiny" open={subjectId !== undefined}>
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
        </>
    );
}
