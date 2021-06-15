import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { format, parseISO } from "date-fns";
import iziToast from "izitoast/dist/js/iziToast";
import { Divider, Button } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";

import TestSchema from "../test.schema";
import { getTest, createTest, updateTest, resetTest } from "../test.actions";
import { TextInput } from "../../core/components/field-inputs.component";

function TestForm({ id, subject_id } = props) {
    const dispatch = useDispatch();

    useEffect(() => {
        if(id) {
            dispatch(getTest(id));
        } else {
            dispatch(resetTest());
        }
    }, [id]);

    const test = useSelector(state => state.testReducer.test);

    return (
        <Formik
            initialValues={{
                name: test ? test.name : "",
                date: test ? format(parseISO(test.date), "y-MM-d") : ""
            }}
            displayName="TestForm"
            enableReinitialize={true}
            validationSchema={TestSchema}
            onSubmit={(values, actions) => {
                if(id) {
                    dispatch(updateTest(id, values)).then(function() {
                        iziToast["success"]({
                            timeout: 3000,
                            message: "Your changes are saved.",
                            position: "topRight"
                        });
                    });
                } else {
                    dispatch(createTest(subject_id, values)).then(function() {
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

                    <TextInput attributes={{
                        type: "date",
                        name: "date",
                        label: "Test Date",
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

export default TestForm;
