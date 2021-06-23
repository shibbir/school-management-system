import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import iziToast from "izitoast/dist/js/iziToast";
import { Divider, Button } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";

import ClassSchema from "../class.schema";
import { createClass, updateClass, getClass } from "../class.actions";
import { TextInput } from "../../core/components/field-inputs.component";

function ClassForm({id} = props) {
    const dispatch = useDispatch();

    useEffect(() => {
        if(id) {
            dispatch(getClass(id));
        }
    }, [id, dispatch]);

    const program = useSelector(state => state.classReducer.program);

    return (
        <Formik
            initialValues={{
                name: program ? program.name : ""
            }}
            displayName="ClassForm"
            enableReinitialize={true}
            validationSchema={ClassSchema}
            onSubmit={(values, actions) => {
                if(id) {
                    dispatch(updateClass(id, values)).then(function() {
                        iziToast["success"]({
                            timeout: 3000,
                            message: "Your changes are saved.",
                            position: "topRight"
                        });
                    }).catch(function(err) {
                        iziToast["error"]({
                            timeout: 3000,
                            message: err ? err.response.data : "An error occurred. Please try again.",
                            position: "topRight"
                        });
                    });
                } else {
                    dispatch(createClass(values)).then(function() {
                        iziToast["success"]({
                            timeout: 3000,
                            message: "Your changes are saved.",
                            position: "topRight"
                        });
                        actions.resetForm();
                    }).catch(function(err) {
                        iziToast["error"]({
                            timeout: 3000,
                            message: err ? err.response.data : "An error occurred. Please try again.",
                            position: "topRight"
                        });
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
                    <Divider hidden/>
                    <Button type="submit" positive disabled={formikProps.isSubmitting}>Save changes</Button>
                    <Button type="reset" disabled={formikProps.isSubmitting}>Reset</Button>
                </Form>
            )}
        </Formik>
    );
}

export default ClassForm;
