import axios from "axios";
import { Link } from "react-router-dom";
import { FormattedDate } from "react-intl";
import fileDownload from "js-file-download";
import iziToast from "izitoast/dist/js/iziToast";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Divider, Segment, Button, Table, Modal, Header, Dropdown, Label, Breadcrumb } from "semantic-ui-react";

import { getClasses, deleteClass } from "../class.actions";
import ClassForm from "./class-form.component";
import PupilsEnrolment from "./pupils-enrolment.component";
import Subjects from "../../manage-subjects/components/subjects.component";

export default function ClassList() {
    const dispatch = useDispatch();
    const [classId, setClassId] = useState(undefined);
    const [program, setProgram] = useState(undefined);
    const [classToAssignPupils, setClassToAssignPupils] = useState(undefined);

    useEffect(() => {
        dispatch(getClasses());
    }, []);

    const classes = useSelector(state => state.classReducer.classes);

    const onDeleteClass = function(id) {
        if(confirm("Are you sure you want to remove this class?")) {
            dispatch(deleteClass(id));
        }
    };

    const rows = classes.map(function(row, index) {
        return (
            <Table.Row key={row.id}>
                <Table.Cell>{index+1}</Table.Cell>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.subjects ? row.subjects.length : 0}</Table.Cell>
                <Table.Cell>{row.pupils ? row.pupils.length : 0}</Table.Cell>
                <Table.Cell><FormattedDate value={row.created_at} day="2-digit" month="long" year="numeric"/></Table.Cell>
                <Table.Cell><FormattedDate value={row.updated_at} day="2-digit" month="long" year="numeric"/></Table.Cell>
                <Table.Cell>
                    <Dropdown>
                        <Dropdown.Menu>
                            <Dropdown.Item icon="edit" text="Update Attributes" onClick={() => setClassId(row.id)}/>
                            <Dropdown.Item icon="book" text="Manage Subjects" onClick={() => setProgram({id: row.id, name: row.name})}/>
                            <Dropdown.Item icon="users" text="Assign Pupils" onClick={() => setClassToAssignPupils(row)}/>
                            <Dropdown.Item icon="trash" text="Remove Class" onClick={() => onDeleteClass(row.id)}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Table.Cell>
            </Table.Row>
        );
    });

    const exportData = function() {
        axios.get(`/api/classes/export`, {
            responseType: "blob",
        }).then(res => {
            fileDownload(res.data, "classes.csv");
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
                <Breadcrumb.Section active>Available classes</Breadcrumb.Section>
            </Breadcrumb>

            <Button floated="right" primary onClick={() => setClassId(null)}>
                Create a new class
            </Button>

            <Button floated="right" basic onClick={() => exportData()} disabled={classes.length === 0}>
                <Icon name="download" color="blue"/> Export Data
            </Button>

            <Modal dimmer size="tiny" open={classId !== undefined}>
                <Modal.Header>Class Form</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <ClassForm id={classId}/>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={() => setClassId(undefined)}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>

            <Modal dimmer size="small" open={program !== undefined}>
                <Modal.Header>Manage subjects of <Label color="teal" size="medium">{program && program.name}</Label> class</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Subjects class_id={program && program.id}/>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={() => setProgram(undefined)}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>

            <Modal dimmer size="large" open={classToAssignPupils !== undefined}>
                <Modal.Header>Manage pupils in <Label color="teal" size="medium">{classToAssignPupils && classToAssignPupils.name}</Label> class</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <PupilsEnrolment id={classToAssignPupils && classToAssignPupils.id}/>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={() => setClassToAssignPupils(undefined)}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>

            <Divider hidden clearing/>

            { classes.length > 0 &&
                <Table selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>#</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Total Subjects</Table.HeaderCell>
                            <Table.HeaderCell>Total Pupils</Table.HeaderCell>
                            <Table.HeaderCell>Created At</Table.HeaderCell>
                            <Table.HeaderCell>Updated At</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
            }

            { classes.length === 0 &&
                <Segment placeholder raised>
                    <Header icon>
                        <Icon name="warning sign"/>
                        No classes are available!
                    </Header>
                </Segment>
            }
        </>
    );
}
