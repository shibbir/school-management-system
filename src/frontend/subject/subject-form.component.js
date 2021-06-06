import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Form, Formik } from "formik";
import { Divider, Button, Form as SemanticUIForm } from "semantic-ui-react";
import iziToast from "izitoast/dist/js/iziToast";
import { useSelector, useDispatch } from "react-redux";
import SubjectFormSchema from "./subject.schema";
import { createSubject, updateSubject, getSubject } from "./subject.actions";
import { getUsers } from "../user/user.actions";
import { TextInput, DropdownInput } from "../core/components/field-inputs.component";

function SubjectForm({ id , class_id } = props) {
    const dispatch = useDispatch();

    useEffect(() => {
        if(id) {
            dispatch(getSubject(id));
        }
        dispatch(getUsers("?role=teacher"));
    }, [id]);

    const subject = useSelector(state => state.subjectReducer.subject);
    const teachers = useSelector(state => state.userReducer.users);

    const teacherOptions = teachers.map(function(option) {
        return { key: option._id, value: option._id, text: `${option.forename} ${option.surname}` };
    });

    return (
        <Formik
            initialValues={{
                name: id && subject ? subject.name : "",
                class: class_id,
                teacher: subject ? subject.teacher : "",
            }}
            displayName="SubjectForm"
            enableReinitialize={true}
            validationSchema={SubjectFormSchema}
            onSubmit={(values, actions) => {
                if(id) {
                    dispatch(updateSubject(values, id)).then(function() {
                        iziToast["success"]({
                            timeout: 3000,
                            message: "Your changes are saved.",
                            position: "bottomRight"
                        });
                    });
                } else {
                    dispatch(createSubject(values)).then(function() {
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
                        value: formikProps.values.retailerId,
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

SubjectForm.propTypes = {
    id: PropTypes.string
};

export default SubjectForm;
