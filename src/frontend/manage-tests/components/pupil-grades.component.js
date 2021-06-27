import axios from "axios";
import React, { useEffect } from "react";
import fileDownload from "js-file-download";
import iziToast from "izitoast/dist/js/iziToast";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Divider, Segment, Header, Breadcrumb, Table, Button } from "semantic-ui-react";

import { getSubject, getPupilGrades } from "../../manage-subjects/subject.actions";

export default function PupilGrades() {
    const { subject_id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSubject(subject_id));
        dispatch(getPupilGrades(subject_id));
    }, [subject_id]);

    const subject = useSelector(state => state.subjectReducer.subject);
    const pupil_grades = useSelector(state => state.subjectReducer.pupil_grades);

    const rows = pupil_grades.map(function(row, index) {
        return (
            <Table.Row key={row.pupil_id}>
                <Table.Cell>{index+1}</Table.Cell>
                <Table.Cell>{row.pupil_id}</Table.Cell>
                <Table.Cell>{row.pupil_name}</Table.Cell>
                <Table.Cell>{row.subject_name}</Table.Cell>
                <Table.Cell>{row.grade}</Table.Cell>
            </Table.Row>
        );
    });

    const exportData = function() {
        axios.get(`/api/subjects/${subject_id}/export-grades`, {
            responseType: "blob",
        }).then(res => {
            fileDownload(res.data, "pupil-grades.csv");
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
                <Breadcrumb.Section><Link to="/assigned-subjects">Assigned Subjects</Link></Breadcrumb.Section>
                <Breadcrumb.Divider>/</Breadcrumb.Divider>
                <Breadcrumb.Section active>Pupil Grades { subject && `for ${subject.name}`}</Breadcrumb.Section>
            </Breadcrumb>

            <Button floated="right" basic onClick={() => exportData()} disabled={pupil_grades.length === 0}>
                <Icon name="download" color="blue"/> Export Data
            </Button>

            <Divider hidden clearing/>

            { pupil_grades.length > 0 &&
                <Table selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>#</Table.HeaderCell>
                            <Table.HeaderCell>Matriculation Number</Table.HeaderCell>
                            <Table.HeaderCell>Pupil Name</Table.HeaderCell>
                            <Table.HeaderCell>Subject</Table.HeaderCell>
                            <Table.HeaderCell>Average Grade</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
            }

            { pupil_grades.length === 0 &&
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
