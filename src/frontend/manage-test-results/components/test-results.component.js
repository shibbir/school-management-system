import axios from "axios";
import { FormattedDate } from "react-intl";
import fileDownload from "js-file-download";
import iziToast from "izitoast/dist/js/iziToast";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Segment, Button, Table, Modal, Header, Dropdown, Divider, Label } from "semantic-ui-react";

import TestResultForm from "./test-result-form.component";
import { getTestResultsByTest, deleteTestResult } from "../test-result.actions";
import { getTest } from "../../manage-tests/test.actions";

export default function TestResults({ test_id }) {
    const dispatch = useDispatch();

    const [testResultId, setTestResultId] = useState(undefined);

    useEffect(() => {
        dispatch(getTest(test_id));
        dispatch(getTestResultsByTest(test_id));
    }, [test_id]);

    const onDeleteTestResult = function(id) {
        if(confirm("Are you sure you want to remove this grade?")) {
            dispatch(deleteTestResult(id));
        }
    };

    const test = useSelector(state => state.testReducer.test);
    const test_results = useSelector(state => state.testResultReducer.test_results);

    const rows = test_results.map(function(row, index) {
        return (
            <Table.Row key={row.id}>
                <Table.Cell>{index+1}</Table.Cell>
                <Table.Cell>{row.pupil.id}</Table.Cell>
                <Table.Cell>{`${row.pupil.forename} ${row.pupil.surname}`}</Table.Cell>
                <Table.Cell>{row.grade}</Table.Cell>
                <Table.Cell><FormattedDate value={row.updated_at} day="2-digit" month="long" year="numeric"/></Table.Cell>
                <Table.Cell>
                    <Dropdown>
                        <Dropdown.Menu>
                            <Dropdown.Item icon="edit" text="Update Grade" onClick={() => setTestResultId(row.id)} disabled={test.status === "archived"}/>
                            <Dropdown.Item icon="trash" text="Remove Grade" onClick={() => onDeleteTestResult(row.id)} disabled={test.status === "archived"}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
            </Table.Row>
        );
    });

    const exportData = function() {
        axios.get(`/api/tests/${test_id}/export-results`, {
            responseType: "blob",
        }).then(res => {
            fileDownload(res.data, "test-results.csv");
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
            <Button
                primary
                floated="right"
                content="Add a grade"
                onClick={() => setTestResultId(null)}
                disabled={test && test.status === "archived"}
            />

            <Button floated="right" basic onClick={() => exportData()} disabled={test_results.length === 0}>
                <Icon name="download" color="blue"/> Export Data
            </Button>

            <Divider hidden clearing/>

            { test_results.length > 0 &&
                <Table selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>#</Table.HeaderCell>
                            <Table.HeaderCell>Matriculation Number</Table.HeaderCell>
                            <Table.HeaderCell>Pupil</Table.HeaderCell>
                            <Table.HeaderCell>Grade</Table.HeaderCell>
                            <Table.HeaderCell>Updated At</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
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

            <Modal dimmer size="tiny" open={testResultId !== undefined}>
                <Modal.Header>Add a new grade under <Label color="teal" size="medium">{test && test.name}</Label> test</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <TestResultForm id={testResultId} test_id={test_id}/>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={() => setTestResultId(undefined)}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    );
}
