import { capitalize } from "lodash";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import iziToast from "izitoast/dist/js/iziToast";
import { useSelector, useDispatch } from "react-redux";
import { Divider, Button, Form as SemanticUIForm } from "semantic-ui-react";

import { createUserSchema } from "../user.schema";
import { createUser, updateUser, getUser } from "../user.actions";
import { TextInput, DropdownInput } from "../../core/components/field-inputs.component";

function UserForm({ id } = props) {
    const dispatch = useDispatch();

    useEffect(() => {
        if(id) {
            dispatch(getUser(id));
        }
    }, [id, dispatch]);

    const user = useSelector(state => state.userReducer.user);

    const roleOptions = ["admin", "teacher", "pupil"].map(function(option, index) {
        return { key: index, value: option, text: capitalize(option) };
    });

    return (
        <Formik
            initialValues={{
                forename: user ? user.forename : "",
                surname: user ? user.surname : "",
                username: user ? user.username : "",
                role: user ? user.role : "",
                password: "",
                confirm_password: ""
            }}
            displayName="UserForm"
            enableReinitialize={true}
            validationSchema={createUserSchema}
            onSubmit={(values, actions) => {
                if(id) {
                    dispatch(updateUser(id, values)).then(function() {
                        iziToast["success"]({
                            timeout: 3000,
                            message: "Your changes are saved.",
                            position: "topRight"
                        });
                    });
                } else {
                    dispatch(createUser(values)).then(function() {
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
                    <SemanticUIForm.Group widths="equal">
                        <TextInput attributes={{
                            type: "text",
                            name: "forename",
                            label: "Forename",
                            required: true
                        }}/>

                        <TextInput attributes={{
                            type: "text",
                            name: "surname",
                            label: "Surname",
                            required: true
                        }}/>
                    </SemanticUIForm.Group>

                    <SemanticUIForm.Group widths="equal">
                        <TextInput attributes={{
                            type: "email",
                            name: "username",
                            label: "Username",
                            required: true
                        }}/>

                        <DropdownInput attributes={{
                            value: formikProps.values.role,
                            name: "role",
                            placeholder: "Select Role",
                            label: "Role",
                            options: roleOptions,
                            onChange: (event, data) => {formikProps.setFieldValue(data.name, data.value)},
                            required: true
                        }}/>
                    </SemanticUIForm.Group>

                    <SemanticUIForm.Group widths="equal">
                        <TextInput attributes={{
                            type: "password",
                            name: "password",
                            label: "Password",
                            required: true
                        }}/>

                        <TextInput attributes={{
                            type: "password",
                            name: "confirm_password",
                            label: "Confirm Password",
                            required: true
                        }}/>
                    </SemanticUIForm.Group>

                    <Divider hidden/>
                    <Button type="submit" positive disabled={formikProps.isSubmitting}>Save changes</Button>
                    <Button type="reset" disabled={formikProps.isSubmitting}>Reset</Button>
                </Form>
            )}
        </Formik>
    );
}

export default UserForm;
