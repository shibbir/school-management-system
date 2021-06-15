import { capitalize } from "lodash";
import queryString from "query-string";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Divider, Segment, Header, Breadcrumb, Table } from "semantic-ui-react";

import { getSubject, getPupilGrades } from "../../subject/subject.actions";

export default function PupilGrades() {
    const location = useLocation();
    const dispatch = useDispatch();

    const [subjectIdForTests, setSubjectIdForTests] = useState(undefined);

    useEffect(() => {
        const params = queryString.parse(location.search);

        dispatch(getSubject(params.subject_id));
        dispatch(getPupilGrades(params.subject_id));
    }, [location.search]);

    const subject = useSelector(state => state.subjectReducer.subject);
    const pupil_grades = useSelector(state => state.subjectReducer.pupil_grades);

    const rows = pupil_grades.map(function(row, index) {
        return (
            <Table.Row key={row.id}>
                <Table.Cell>{index+1}</Table.Cell>
                <Table.Cell>{`${row.forename} ${row.surname}`}</Table.Cell>
                <Table.Cell>{row.grade}</Table.Cell>
            </Table.Row>
        );
    });

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Section><Link to="/">Dashboard</Link></Breadcrumb.Section>
                <Breadcrumb.Divider>/</Breadcrumb.Divider>
                <Breadcrumb.Section><Link to="/assigned-subjects">Assigned Subjects</Link></Breadcrumb.Section>
                <Breadcrumb.Divider>/</Breadcrumb.Divider>
                <Breadcrumb.Section active>Average Grades { subject && `for ${subject.name}`}</Breadcrumb.Section>
            </Breadcrumb>

            <Divider hidden clearing/>

            { pupil_grades.length > 0 &&
                <Table selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>#</Table.HeaderCell>
                            <Table.HeaderCell>Pupil Name</Table.HeaderCell>
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
