import queryString from "query-string";
import { FormattedDate } from "react-intl";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Divider, Segment, Button, Table, Modal, Header, Dropdown, Breadcrumb, Label, Grid } from "semantic-ui-react";

import TestForm from "./test-form.component";
import { getTestsBySubject, deleteTest } from "../test.actions";
import { getSubject } from "../../subject/subject.actions";
import TestResults from "../../manage-test-results/components/test-results.component";
import ImportTestResultsForm from "../../manage-test-results/components/test-results-import-form.component";

export default function ManageTests() {
    const dispatch = useDispatch();
    const location = useLocation();
    const params = queryString.parse(location.search);

    const [testId, setTestId] = useState(undefined);
    const [testIdForResults, setTestIdForResults] = useState(undefined);
    const [testIdForImportResults, setTestIdForImportResults] = useState(undefined);

    useEffect(() => {
        dispatch(getSubject(params.subject_id));
        dispatch(getTestsBySubject(params.subject_id));
    }, [location.search]);

    const tests = useSelector(state => state.testReducer.tests);
    const subject = useSelector(state => state.subjectReducer.subject);

    const onDeleteTest = function(id) {
        if(confirm("Are you sure you want to remove this test?")) {
            dispatch(deleteTest(id));
        }
    };

    const rows = tests.map(function(row, index) {
        return (
            <Table.Row key={row.id}>
                <Table.Cell>{index+1}</Table.Cell>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell><FormattedDate value={row.date} day="2-digit" month="long" year="numeric"/></Table.Cell>
                <Table.Cell>{`${row.modifier.forename} ${row.modifier.surname}`}</Table.Cell>
                <Table.Cell><FormattedDate value={row.updated_at} day="2-digit" month="long" year="numeric"/></Table.Cell>
                <Table.Cell>
                    <Dropdown>
                        <Dropdown.Menu>
                            <Dropdown.Item icon="edit" text="Update Attributes" onClick={() => setTestId(row.id)}/>
                            <Dropdown.Item icon="list" text="Manage Test Results" onClick={() => setTestIdForResults(row.id)}/>
                            <Dropdown.Item icon="upload" text="Import Test Results" onClick={() => setTestIdForImportResults(row.id)}/>
                            <Dropdown.Item icon="trash" text="Remove Test" onClick={() => onDeleteTest(row.id)}/>
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
                <Breadcrumb.Section><Link to="/assigned-subjects">Assigned Subjects</Link></Breadcrumb.Section>
                <Breadcrumb.Divider>/</Breadcrumb.Divider>
                <Breadcrumb.Section active>Manage Tests { subject && `for ${subject.name}`}</Breadcrumb.Section>
            </Breadcrumb>

            <Divider hidden clearing/>

            <Grid columns={2}>
                <Grid.Row>
                    <Grid.Column>
                        { subject && <Header as="h3">Available tests for <Label color="blue">{subject.name}</Label> subject</Header> }
                    </Grid.Column>

                    <Grid.Column>
                        <Button floated="right" primary size="small" onClick={() => setTestId(null)}>
                            Create new test
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            { tests.length > 0 &&
                <Table selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>#</Table.HeaderCell>
                            <Table.HeaderCell>Test Name</Table.HeaderCell>
                            <Table.HeaderCell>Test Date</Table.HeaderCell>
                            <Table.HeaderCell>Updated By</Table.HeaderCell>
                            <Table.HeaderCell>Updated At</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
            }

            { tests.length === 0 &&
                <Segment placeholder>
                    <Header icon>
                        <Icon name="user"/>
                        No tests are found.
                    </Header>
                </Segment>
            }

            {/* Test Form Modal */}
            <Modal dimmer size="tiny" open={testId !== undefined}>
                <Modal.Header>Test Form</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <TestForm id={testId} subject_id={params.subject_id}/>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={() => setTestId(undefined)}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>

            {/* Test Results Modal */}
            <Modal dimmer size="small" open={testIdForResults !== undefined}>
                <Modal.Header>Test Results</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <TestResults test_id={testIdForResults}/>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={() => setTestIdForResults(undefined)}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>

            {/* Test Results Import Modal */}
            <Modal dimmer size="tiny" open={testIdForImportResults !== undefined}>
                <Modal.Header>Batch Grading</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <ImportTestResultsForm test_id={testIdForImportResults}/>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={() => setTestIdForImportResults(undefined)}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    );
}
