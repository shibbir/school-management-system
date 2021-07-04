import iziToast from "izitoast/dist/js/iziToast";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Divider, Segment, Button, Table, Header, Form as SemanticUIForm, Checkbox } from "semantic-ui-react";

import { getClasses, bulkSubjectsSelection } from "../class.actions";
import { getSubjects } from "../../manage-subjects/subject.actions";

export default function SubjectsSelection({ id } = props) {
    const dispatch = useDispatch();
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [allSubjectsSelected, setAllSubjectsSelected] = useState(false);

    const subjects = useSelector(state => state.subjectReducer.subjects);

    useEffect(() => {
        dispatch(getSubjects());
    }, []);

    useEffect(() => {
        const selected_subjects = [];

        subjects.forEach(subject => {
            if(!selected_subjects.find(x => x.id === subject.id)) {
                subject.classes.forEach(program => {
                    if(program.id === id) {
                        selected_subjects.push(subject);
                    }
                });
            }
        });

        setSelectedSubjects(selected_subjects);
    }, [subjects]);

    useEffect(() => {
        setAllSubjectsSelected(selectedSubjects.length === subjects.length);
    }, [selectedSubjects, subjects]);

    const toggleSubjectsSelection = function() {
        if(allSubjectsSelected) {
            setSelectedSubjects([]);
        } else {
            setSelectedSubjects(subjects);
        }
    };

    const toggleSubjectSelection = function(subject) {
        if(selectedSubjects.includes(subject)) {
            setSelectedSubjects([..._.pull(selectedSubjects, subject)]);
        } else {
            setSelectedSubjects([..._.concat(selectedSubjects, subject)]);
        }
    };

    const onBulkSelection = function() {
        if(confirm("Are you sure you want to assign the selected subjects in this class?")) {
            dispatch(bulkSubjectsSelection(id, { subjects: selectedSubjects.map((x => x.id )) })).then(function() {
                dispatch(getClasses());

                iziToast["success"]({
                    timeout: 3000,
                    message: "Your changes are saved.",
                    position: "topRight"
                });
            });
        }
    };

    const rows = subjects.map(function(subject) {
        return (
            <Table.Row key={subject.id}>
                <Table.Cell>
                    <SemanticUIForm.Field>
                        <Checkbox onClick={() => toggleSubjectSelection(subject)} checked={selectedSubjects.includes(subject)}/>
                    </SemanticUIForm.Field>
                </Table.Cell>
                <Table.Cell>{subject.name}</Table.Cell>
                <Table.Cell>{subject.teacher ? `${subject.teacher.forename} ${subject.teacher.surname}` : "--"}</Table.Cell>
            </Table.Row>
        );
    });

    return (
        <>
            <Button floated="right" positive size="small" onClick={() => onBulkSelection()}>
                Save changes
            </Button>

            <Divider hidden clearing/>

            { subjects.length > 0 &&
                <Table selectable compact>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell><Checkbox onClick={() => toggleSubjectsSelection()} checked={allSubjectsSelected}/></Table.HeaderCell>
                            <Table.HeaderCell>Subject Name</Table.HeaderCell>
                            <Table.HeaderCell>Assigned Teacher</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
            }

            { subjects.length === 0 &&
                <Segment placeholder>
                    <Header icon>
                        <Icon name="book"/>
                        No subjects are available.
                    </Header>
                </Segment>
            }
        </>
    );
}
