import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import iziToast from "izitoast/dist/js/iziToast";
import { Divider, Button } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import SubjectSchema from "./subject.schema";
import { getUsers } from "../user/user.actions";
import { createSubject, updateSubject, getSubject } from "./subject.actions";
import { TextInput, DropdownInput } from "../core/components/field-inputs.component";

function SubjectForm({ class_id, subject_id } = props) {
    const dispatch = useDispatch();

    useEffect(() => {
        if(class_id && subject_id) {
            dispatch(getSubject(class_id, subject_id));
        }
        dispatch(getUsers("?role=teacher"));
    }, [class_id, subject_id]);

    const subject = useSelector(state => state.subjectReducer.subject);
    const teachers = useSelector(state => state.userReducer.users);

    const teacherOptions = teachers.map(function(option) {
        return { key: option._id, value: option._id, text: `${option.forename} ${option.surname}` };
    });

    return (
        <Formik
            initialValues={{
                name: subject ? subject.name : "",
                teacher: subject ? subject.teacher : "",
            }}
            displayName="SubjectForm"
            enableReinitialize={true}
            validationSchema={SubjectSchema}
            onSubmit={(values, actions) => {
                if(subject_id) {
                    dispatch(updateSubject(class_id, subject_id, values)).then(function() {
                        iziToast["success"]({
                            timeout: 3000,
                            message: "Your changes are saved.",
                            position: "bottomRight"
                        });
                    });
                } else {
                    dispatch(createSubject(class_id, values)).then(function() {
                        iziToast["success"]({
                            timeout: 3000,
                            message: "Your changes are saved.",
                            position: "bottomRight"
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
                        value: formikProps.values.teacher,
                        name: "teacher",
                        placeholder: "Assign Teacher",
                        label: "Teacher",
                        options: teacherOptions,
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
