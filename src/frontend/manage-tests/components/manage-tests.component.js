import { capitalize } from "lodash";
import { FormattedDate } from "react-intl";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Divider, Segment, Button, Table, Modal, Header, Dropdown, Breadcrumb, Label, Grid } from "semantic-ui-react";

import TestForm from "./test-form.component";
import { getTestsBySubject, deleteTest } from "../test.actions";
import { getSubject } from "../../manage-subjects/subject.actions";
import TestResults from "../../manage-test-results/components/test-results.component";
import ImportTestResultsForm from "../../manage-test-results/components/test-results-import-form.component";

export default function ManageTests() {
    const dispatch = useDispatch();
    const { subject_id } = useParams();

    const [testId, setTestId] = useState(undefined);
    const [testForTestResults, setTestForTestResults] = useState(undefined);
    const [testIdForImportResults, setTestIdForImportResults] = useState(undefined);

    useEffect(() => {
        dispatch(getSubject(subject_id));
        dispatch(getTestsBySubject(subject_id));
    }, [subject_id]);

    const tests = useSelector(state => state.testReducer.tests);
    const subject = useSelector(state => state.subjectReducer.subject);

    const onDeleteTest = function(id) {
        if(confirm("Are you sure you want to remove this test?")) {
            dispatch(deleteTest(id));
        }
    };

    const rows = tests.map(function(test, index) {
        return (
            <Table.Row key={test.id}>
                <Table.Cell>{index+1}</Table.Cell>
                <Table.Cell>{test.name}</Table.Cell>
                <Table.Cell><FormattedDate value={test.date} day="2-digit" month="long" year="numeric"/></Table.Cell>
                <Table.Cell>{capitalize(test.status)}</Table.Cell>
                <Table.Cell><FormattedDate value={test.updated_at} day="2-digit" month="long" year="numeric"/></Table.Cell>
                <Table.Cell>
                    <Dropdown>
                        <Dropdown.Menu>
                            <Dropdown.Item icon="edit" text="Update Attributes" onClick={() => setTestId(test.id)} disabled={test.status === "archived"}/>
                            <Dropdown.Item icon="list" text="Manage Test Results" onClick={() => setTestForTestResults({id: test.id, name: test.name})}/>
                            <Dropdown.Item icon="upload" text="Import Grades" onClick={() => setTestIdForImportResults(test.id)} disabled={test.status === "archived"}/>
                            <Dropdown.Item icon="trash" text="Remove Test" onClick={() => onDeleteTest(test.id)} disabled={test.status === "archived"}/>
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
                        { subject && <Header as="h3">Available tests for<Label color="grey">{subject.name}</Label> subject</Header> }
                    </Grid.Column>

                    <Grid.Column>
                        <Button floated="right" primary onClick={() => setTestId(null)} disabled={subject && subject.status === "archived"}>
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
                            <Table.HeaderCell>Test Status</Table.HeaderCell>
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
                        <TestForm id={testId} subject_id={subject_id}/>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={() => setTestId(undefined)}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>

            {/* Test Results Modal */}
            <Modal dimmer size="small" open={testForTestResults !== undefined}>
                <Modal.Header>Manage test results of <Label color="teal" size="medium">{testForTestResults && testForTestResults.name}</Label> test</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <TestResults test_id={testForTestResults && testForTestResults.id}/>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={() => setTestForTestResults(undefined)}>
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
