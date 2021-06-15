import React from "react";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import iziToast from "izitoast/dist/js/iziToast";
import { Divider, Button } from "semantic-ui-react";

import { testResultSchema } from "../test.schema";
import { uploadTestResults } from "../test.actions";
import { FileInput } from "../../core/components/field-inputs.component";

export default function ImportTestResults({ test_id }) {
    const dispatch = useDispatch();

    return (
        <>
            <Formik
                initialValues={{
                    result: ""
                }}
                displayName="TestForm"
                enableReinitialize={true}
                validationSchema={testResultSchema}
                onSubmit={(values, actions) => {
                    let form_data = new FormData();

                    if(values.result) {
                        form_data.append("result", values.result);
                        delete values.result;
                    }

                    dispatch(uploadTestResults(test_id, form_data)).then(function() {
                        iziToast["success"]({
                            timeout: 3000,
                            message: "Your changes are saved.",
                            position: "topRight"
                        });
                        actions.resetForm();
                    }).catch(function() {
                        iziToast["error"]({
                            timeout: 3000,
                            title: err.response.status,
                            message: err.response.data,
                            position: "topRight"
                        });
                    });

                    actions.setSubmitting(false);
                }}
            >
                {formikProps => (
                    <Form onSubmit={formikProps.handleSubmit} className="ui form">
                        <FileInput attributes={{
                            name: "result",
                            label: "Upload Result Sheet",
                            required: true,
                            info: "You can upload a CSV file of maximum 500 pupil's grade on each import.",
                            onChange: event => {formikProps.setFieldValue("result", event.currentTarget.files[0])}
                        }}/>

                        <Divider hidden/>
                        <Button type="submit" positive disabled={formikProps.isSubmitting}>Upload</Button>
                    </Form>
                )}
            </Formik>
        </>
    );
}
