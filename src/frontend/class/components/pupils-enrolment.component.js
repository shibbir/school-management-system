import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Divider, Segment, Button, Table, Header, Form as SemanticUIForm, Checkbox } from "semantic-ui-react";

import { getUsers } from "../../user/user.actions";
import { getClass, batchEnrolment } from "../class.actions";

export default function PupilsEnrolment({ id } = props) {
    const dispatch = useDispatch();
    const [selectedPupils, setSelectedPupils] = useState([]);
    const [allPupilsSelected, setAllPupilsSelected] = useState(false);

    const program = useSelector(state => state.classReducer.program);
    const pupils = useSelector(state => state.userReducer.users);

    useEffect(() => {
        dispatch(getUsers("?role=pupil"));
    }, []);

    useEffect(() => {
        if(id) {
            dispatch(getClass(id));
        }
    }, [id]);

    useEffect(() => {
        const enrolled_pupils = [];
        pupils.forEach(pupil => {
            if(program && program.pupils.includes(pupil._id)) {
                enrolled_pupils.push(pupil._id);
            }
        });
        setSelectedPupils(enrolled_pupils);
    }, [program, pupils]);

    useEffect(() => {
        setAllPupilsSelected(selectedPupils.length === pupils.length);
    }, [selectedPupils, pupils]);

    const togglePupilsSelection = function() {
        if(allPupilsSelected) {
            setSelectedPupils([]);
        } else {
            setSelectedPupils(pupils.map(pupil => pupil._id));
        }
    };

    const togglePupilSelection = function(pupil_id) {
        if(selectedPupils.includes(pupil_id)) {
            setSelectedPupils([..._.pull(selectedPupils, pupil_id)]);
        } else {
            setSelectedPupils([..._.concat(selectedPupils, pupil_id)]);
        }
    };

    const onBatchEnrolment = function() {
        if(confirm("Are you sure you want to assign the selected pupils in this class?")) {
            dispatch(batchEnrolment(id, { pupils: selectedPupils }));
        }
    };

    const rows = pupils.map(function(pupil) {
        return (
            <Table.Row key={pupil._id}>
                <Table.Cell>
                    <SemanticUIForm.Field>
                        <Checkbox onClick={() => togglePupilSelection(pupil._id)} checked={selectedPupils.includes(pupil._id)}/>
                    </SemanticUIForm.Field>
                </Table.Cell>
                <Table.Cell>{pupil.forename}</Table.Cell>
                <Table.Cell>{pupil.surname}</Table.Cell>
                <Table.Cell>{pupil.username}</Table.Cell>
            </Table.Row>
        );
    });

    return (
        <>
            {`${selectedPupils.length} pupil(s) are selected.`}

            <Button floated="right" positive size="small" onClick={() => onBatchEnrolment()} disabled={!selectedPupils.length}>
                Enrol selected pupils
            </Button>

            <Divider hidden clearing/>

            { pupils.length > 0 &&
                <Table selectable compact>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell><Checkbox onClick={() => togglePupilsSelection()} checked={allPupilsSelected}/></Table.HeaderCell>
                            <Table.HeaderCell>Forename</Table.HeaderCell>
                            <Table.HeaderCell>Surname</Table.HeaderCell>
                            <Table.HeaderCell>Username</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
            }

            { pupils.length === 0 &&
                <Segment placeholder>
                    <Header icon>
                        <Icon name="user"/>
                        No pupils are available.
                    </Header>
                </Segment>
            }
        </>
    );
}
