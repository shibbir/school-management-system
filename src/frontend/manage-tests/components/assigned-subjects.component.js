import { capitalize } from "lodash";
import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Divider, Segment, Header, Breadcrumb, Table, Dropdown } from "semantic-ui-react";

import { getAssignedSubjects } from "../../user/user.actions";

export default function AssignedSubjects() {
    const history = useHistory();
    const dispatch = useDispatch();

    const [subjectIdForPupilGrades, setSubjectIdForPupilGrades] = useState(undefined);
    const [subjectIdForTests, setSubjectIdForTests] = useState(undefined);

    useEffect(() => {
        dispatch(getAssignedSubjects());
    }, []);

    useEffect(() => {
        if(subjectIdForPupilGrades) {
            history.push(`/assigned-subjects/pupil-grades?subject_id=${subjectIdForPupilGrades}`);
        }
    }, [subjectIdForPupilGrades]);

    useEffect(() => {
        if(subjectIdForTests) {
            history.push(`/assigned-subjects/manage-tests?subject_id=${subjectIdForTests}`);
        }
    }, [subjectIdForTests]);

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

            <Divider hidden clearing/>

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
        </>
    );
}
