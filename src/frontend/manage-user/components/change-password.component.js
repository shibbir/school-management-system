import React from "react";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import iziToast from "izitoast/dist/js/iziToast";
import { Divider, Button } from "semantic-ui-react";

import { changePassword } from "../user.actions";
import { changePasswordSchema } from "../user.schema";
import { TextInput } from "../../core/components/field-inputs.component";

export default function ChangePassword() {
    const dispatch = useDispatch();

    return (
        <Formik
            initialValues={{
                current_password: "",
                new_password: "",
                confirm_new_password: ""
            }}
            displayName="ChangePassword"
            validationSchema={changePasswordSchema}
            onSubmit={(values, actions) => {
                dispatch(changePassword(values)).then(function() {
                    iziToast["success"]({
                        timeout: 3000,
                        message: "Password changed successfully.",
                        position: "topRight"
                    });
                }).catch(function(err) {
                    iziToast["error"]({
                        timeout: 3000,
                        title: err.response.status,
                        message: err.response.data,
                        position: "topRight"
                    });
                });

                actions.resetForm();
                actions.setSubmitting(false);
            }}
        >
            {formikProps => (
                <Form onSubmit={formikProps.handleSubmit} className="ui form">
                    <TextInput attributes={{
                        type: "password",
                        name: "current_password",
                        label: "Current password",
                        required: true,
                        autoComplete: "current-password"
                    }}/>

                    <TextInput attributes={{
                        type: "password",
                        name: "new_password",
                        label: "New password",
                        required: true,
                        autoComplete: "new-password"
                    }}/>

                    <TextInput attributes={{
                        type: "password",
                        name: "confirm_new_password",
                        label: "Confirm new password",
                        required: true,
                        autoComplete: "new-password"
                    }}/>

                    <Divider hidden/>
                    <Button type="submit" positive disabled={formikProps.isSubmitting}>Change password</Button>
                    <Button type="reset" disabled={formikProps.isSubmitting}>Reset</Button>
                </Form>
            )}
        </Formik>
    );
}
