import { FormattedDate } from "react-intl";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Divider, Segment, Button, Table, Modal, Header, Dropdown } from "semantic-ui-react";

import { getTestResultsByTest } from "../test.actions";

export default function TestResults() {
    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTestResultsByTest(id));
    }, [id]);

    const test_results = useSelector(state => state.testReducer.test_results);

    const rows = test_results.map(function(row, index) {
        return (
            <Table.Row key={row.id}>
                <Table.Cell>{index+1}</Table.Cell>
                <Table.Cell>{`${row.pupil.forename} ${row.pupil.surname}`}</Table.Cell>
                <Table.Cell>{row.grade}</Table.Cell>
                <Table.Cell><FormattedDate value={row.updated_at} day="2-digit" month="long" year="numeric"/></Table.Cell>
                <Table.Cell>{`${row.modifier.forename} ${row.modifier.surname}`}</Table.Cell>
            </Table.Row>
        );
    });

    return (
        <>
            { test_results.length > 0 &&
                <Table selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>#</Table.HeaderCell>
                            <Table.HeaderCell>Pupil</Table.HeaderCell>
                            <Table.HeaderCell>Grade</Table.HeaderCell>
                            <Table.HeaderCell>Updated At</Table.HeaderCell>
                            <Table.HeaderCell>Updated By</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
            }

            { test_results.length === 0 &&
                <Segment placeholder>
                    <Header icon>
                        <Icon name="user"/>
                        No test results are found.
                    </Header>
                </Segment>
            }
        </>
    );
}
