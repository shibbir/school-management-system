import axios from "axios";
import { Link } from "react-router-dom";
import { FormattedDate } from "react-intl";
import fileDownload from "js-file-download";
import iziToast from "izitoast/dist/js/iziToast";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Divider, Segment, Header, Breadcrumb, Table, Dropdown, Modal, Button, Label } from "semantic-ui-react";

import { getPupilSubjects, getPupilSubject } from "../user.actions";

export default function SubjectsOverview() {
    const dispatch = useDispatch();

    const [subjectId, setSubjectId] = useState(undefined);

    useEffect(() => {
        if(logged_in_user && logged_in_user.id) {
            dispatch(getPupilSubjects(logged_in_user.id));
        }
    }, [logged_in_user]);

    useEffect(() => {
        if(logged_in_user && logged_in_user.id && subjectId) {
            dispatch(getPupilSubject(logged_in_user.id, subjectId));
        }
    }, [logged_in_user, subjectId]);

    const subject = useSelector(state => state.userReducer.subject);
    const subjects = useSelector(state => state.userReducer.subjects);
    const logged_in_user = useSelector(state => state.userReducer.loggedInUser);

    const rows = subjects.map(function(subject, index) {
        return (
            <Table.Row key={subject.subject_id}>
                <Table.Cell>{index+1}</Table.Cell>
                <Table.Cell>{subject.subject_name}</Table.Cell>
                <Table.Cell>{subject.grade}</Table.Cell>
                <Table.Cell>{subject.teacher_name}</Table.Cell>
                <Table.Cell>
                    <Dropdown>
                        <Dropdown.Menu>
                            <Dropdown.Item icon="eye" text="View All Tests" onClick={() => setSubjectId(subject.subject_id)}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
            </Table.Row>
        );
    });

    const subject_test_rows = subject && subject.tests.map(function(test, index) {
        return (
            <Table.Row key={test.id}>
                <Table.Cell>{index+1}</Table.Cell>
                <Table.Cell>{test.name}</Table.Cell>
                <Table.Cell><FormattedDate value={test.date} day="2-digit" month="long" year="numeric"/></Table.Cell>
                <Table.Cell>
                    {test.test_results.find(x => x.pupil_id === logged_in_user.id) ? test.test_results.find(x => x.pupil_id === logged_in_user.id).grade : Number.parseFloat(0).toFixed(2)}
                </Table.Cell>
            </Table.Row>
        );
    });

    const exportData = function() {
        axios.get(`/api/pupils/${logged_in_user.id}/export-subjects`, {
            responseType: "blob",
        }).then(res => {
            fileDownload(res.data, "subjects-overview.csv");
        }).catch(err => {
            iziToast["error"]({
                timeout: 3000,
                message: "An error occurred. Please try again.",
                position: "topRight"
            });
        });
    };

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Section><Link to="/">Dashboard</Link></Breadcrumb.Section>
                <Breadcrumb.Divider>/</Breadcrumb.Divider>
                <Breadcrumb.Section active>My Subjects Overview</Breadcrumb.Section>
            </Breadcrumb>

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
                            <Table.HeaderCell>Average Test Grade</Table.HeaderCell>
                            <Table.HeaderCell>Teacher Name</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
            }

            { subjects.length === 0 &&
                <Segment placeholder raised>
                    <Header icon>
                        <Icon name="book"/>
                        No data found.
                    </Header>
                </Segment>
            }

            <Modal dimmer size="tiny" open={subjectId !== undefined}>
                <Modal.Header>Tests Overview of <Label color="grey" size="medium">{subject && subject.name}</Label> subject</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        { subject && subject.tests.length > 0 &&
                            <Table selectable>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>#</Table.HeaderCell>
                                        <Table.HeaderCell>Test Name</Table.HeaderCell>
                                        <Table.HeaderCell>Test Date</Table.HeaderCell>
                                        <Table.HeaderCell>Grade</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {subject_test_rows}
                                </Table.Body>
                            </Table>
                        }

                        { subject && subject.tests.length === 0 &&
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
                    <Button color="black" onClick={() => setSubjectId(undefined)}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    );
}
