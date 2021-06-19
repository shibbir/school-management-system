import iziToast from "izitoast/dist/js/iziToast";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Divider, Segment, Button, Table, Header, Form as SemanticUIForm, Checkbox } from "semantic-ui-react";

import { getClasses, bulkEnrolment } from "../class.actions";
import { getUsers } from "../../manage-users/user.actions";

export default function PupilsEnrolment({ id } = props) {
    const dispatch = useDispatch();
    const [selectedPupils, setSelectedPupils] = useState([]);
    const [allPupilsSelected, setAllPupilsSelected] = useState(false);

    const pupils = useSelector(state => state.userReducer.users);

    useEffect(() => {
        dispatch(getUsers("?role=pupil"));
    }, []);

    useEffect(() => {
        const enrolled_pupils = pupils.filter(function(pupil) {
            return pupil.class_id === id;
        });

        setSelectedPupils(enrolled_pupils);
    }, [pupils]);

    useEffect(() => {
        setAllPupilsSelected(selectedPupils.length === pupils.length);
    }, [selectedPupils, pupils]);

    const togglePupilsSelection = function() {
        if(allPupilsSelected) {
            setSelectedPupils([]);
        } else {
            setSelectedPupils(pupils);
        }
    };

    const togglePupilSelection = function(pupil) {
        if(selectedPupils.includes(pupil)) {
            setSelectedPupils([..._.pull(selectedPupils, pupil)]);
        } else {
            setSelectedPupils([..._.concat(selectedPupils, pupil)]);
        }
    };

    const onBulkEnrolment = function() {
        if(confirm("Are you sure you want to assign the selected pupils in this class? Assigning them to a new class automatically deassigns them from the previous class.")) {
            dispatch(bulkEnrolment(id, { pupils: selectedPupils.map((x => x.id )) })).then(function() {
                dispatch(getUsers("?role=pupil"));
                dispatch(getClasses());

                iziToast["success"]({
                    timeout: 3000,
                    message: "Your changes are saved.",
                    position: "topRight"
                });
            });
        }
    };

    const rows = pupils.map(function(pupil) {
        return (
            <Table.Row key={pupil.id}>
                <Table.Cell>
                    <SemanticUIForm.Field>
                        <Checkbox onClick={() => togglePupilSelection(pupil)} checked={selectedPupils.includes(pupil)}/>
                    </SemanticUIForm.Field>
                </Table.Cell>
                <Table.Cell>{pupil.id}</Table.Cell>
                <Table.Cell>{pupil.forename}</Table.Cell>
                <Table.Cell>{pupil.surname}</Table.Cell>
                <Table.Cell>{pupil.class ? pupil.class.name : '--'}</Table.Cell>
            </Table.Row>
        );
    });

    return (
        <>
            <Button floated="right" positive size="small" onClick={() => onBulkEnrolment()}>
                Save changes
            </Button>

            <Divider hidden clearing/>

            { pupils.length > 0 &&
                <Table selectable compact>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell><Checkbox onClick={() => togglePupilsSelection()} checked={allPupilsSelected}/></Table.HeaderCell>
                            <Table.HeaderCell>Matriculation Number</Table.HeaderCell>
                            <Table.HeaderCell>Forename</Table.HeaderCell>
                            <Table.HeaderCell>Surname</Table.HeaderCell>
                            <Table.HeaderCell>Assigned Class</Table.HeaderCell>
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
