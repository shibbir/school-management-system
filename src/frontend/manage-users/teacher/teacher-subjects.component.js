import axios from "axios";
import { capitalize } from "lodash";
import { FormattedDate } from "react-intl";
import fileDownload from "js-file-download";
import iziToast from "izitoast/dist/js/iziToast";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Divider, Segment, Header, Breadcrumb, Table, Dropdown, List, Button } from "semantic-ui-react";

import { getAssignedSubjects } from "../user.actions";

export default function AssignedSubjects() {
    const history = useHistory();
    const dispatch = useDispatch();

    const [subjectIdForPupilGrades, setSubjectIdForPupilGrades] = useState(undefined);
    const [subjectIdForTests, setSubjectIdForTests] = useState(undefined);

    useEffect(() => {
        dispatch(getAssignedSubjects(logged_in_user.id));
    }, [logged_in_user]);

    useEffect(() => {
        if(subjectIdForPupilGrades) {
            history.push(`/assigned-subjects/${subjectIdForPupilGrades}/pupil-grades`);
        }
    }, [subjectIdForPupilGrades]);

    useEffect(() => {
        if(subjectIdForTests) {
            history.push(`/assigned-subjects/${subjectIdForTests}/manage-tests`);
        }
    }, [subjectIdForTests]);

    const exportData = function() {
        axios.get(`/api/teachers/${logged_in_user.id}/export-subjects`, {
            responseType: "blob",
        }).then(res => {
            fileDownload(res.data, "assigned-subjects.csv");
        }).catch(err => {
            iziToast["error"]({
                timeout: 3000,
                message: "An error occurred. Please try again.",
                position: "topRight"
            });
        });
    };

    const logged_in_user = useSelector(state => state.userReducer.loggedInUser);
    const subjects = useSelector(state => state.userReducer.subjects);

    const rows = subjects.map(function(subject, index) {
        return (
            <Table.Row key={subject.id}>
                <Table.Cell>{index+1}</Table.Cell>
                <Table.Cell>{subject.name}</Table.Cell>
                <Table.Cell>{capitalize(subject.status)}</Table.Cell>
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
                    <Dropdown>
                        <Dropdown.Menu>
                            <Dropdown.Item icon="edit" text="View Grades" onClick={() => setSubjectIdForPupilGrades(subject.id)}/>
                            <Dropdown.Item icon="archive" text="Manage Tests" onClick={() => setSubjectIdForTests(subject.id)}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
            </Table.Row>
        );
    });

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Section><Link to="/">Dashboard</Link></Breadcrumb.Section>
                <Breadcrumb.Divider>/</Breadcrumb.Divider>
                <Breadcrumb.Section active>Assigned Subjects</Breadcrumb.Section>
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
                            <Table.HeaderCell>Status</Table.HeaderCell>
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
                <Segment placeholder raised>
                    <Header icon>
                        <Icon name="book"/>
                        No data found.
                    </Header>
                </Segment>
            }
        </>
    );
}
