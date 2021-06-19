import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import iziToast from "izitoast/dist/js/iziToast";
import { Divider, Button } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";

import SubjectSchema from "../subject.schema";
import { getUsers } from "../../manage-users/user.actions";
import { getClasses } from "../../manage-classes/class.actions";
import { TextInput, DropdownInput } from "../../core/components/field-inputs.component";
import { createSubject, updateSubject, getSubject, resetSubject } from "../subject.actions";

function SubjectForm({ id, class_id } = props) {
    const dispatch = useDispatch();

    useEffect(() => {
        if(id) {
            dispatch(getSubject(id));
        } else {
            dispatch(resetSubject());
        }
        dispatch(getUsers("?role=teacher"));
    }, [id]);

    const subject = useSelector(state => state.subjectReducer.subject);
    const teachers = useSelector(state => state.userReducer.users);

    const teacher_options = teachers.map(function(option) {
        return { key: option.id, value: option.id, text: `${option.forename} ${option.surname}` };
    });

    return (
        <Formik
            initialValues={{
                name: subject ? subject.name : "",
                teacher_id: subject ? subject.teacher_id : ""
            }}
            displayName="SubjectForm"
            enableReinitialize={true}
            validationSchema={SubjectSchema}
            onSubmit={(values, actions) => {
                if(id) {
                    dispatch(updateSubject(id, values)).then(function() {
                        iziToast["success"]({
                            timeout: 3000,
                            message: "Your changes are saved.",
                            position: "topRight"
                        });
                    });
                } else {
                    dispatch(createSubject(class_id, values)).then(function() {
                        dispatch(getClasses());

                        iziToast["success"]({
                            timeout: 3000,
                            message: "Your changes are saved.",
                            position: "topRight"
                        });
                        actions.resetForm();
                    });
                }

                actions.setSubmitting(false);
            }}
        >
            {formikProps => (
                <Form onSubmit={formikProps.handleSubmit} className="ui form">
                    <TextInput attributes={{
                        type: "text",
                        name: "name",
                        label: "Name",
                        required: true
                    }}/>

                    <DropdownInput attributes={{
                        value: formikProps.values.teacher_id,
                        name: "teacher_id",
                        placeholder: "Assign Teacher",
                        label: "Teacher",
                        options: teacher_options,
                        required: true,
                        onChange: (event, data) => {formikProps.setFieldValue(data.name, data.value)}
                    }}/>

                    <Divider hidden/>
                    <Button type="submit" positive disabled={formikProps.isSubmitting}>Save changes</Button>
                    <Button type="reset" disabled={formikProps.isSubmitting}>Reset</Button>
                </Form>
            )}
        </Formik>
    );
}

export default SubjectForm;
