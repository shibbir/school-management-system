import { Form, Formik } from "formik";
import queryString from "query-string";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import iziToast from "izitoast/dist/js/iziToast";
import { Divider, Button } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";

import { getTestsBySubject } from "../../manage-tests/test.actions";
import { importTestResults } from "../test-result.actions";
import { testResultsImportSchema } from "../test-result.schema";
import { FileInput, DropdownInput } from "../../core/components/field-inputs.component";

export default function TestResultsImportForm({ test_id }) {
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        const params = queryString.parse(location.search);

        dispatch(getTestsBySubject(params.subject_id));
    }, [location.search]);

    const tests = useSelector(state => state.testReducer.tests);

    const test_options = tests.map(function(option) {
        return { key: option.id, value: option.id, text: option.name };
    });

    return (
        <Formik
            initialValues={{
                test_id,
                result: ""
            }}
            displayName="TestResultsImportForm"
            enableReinitialize={true}
            validationSchema={testResultsImportSchema}
            onSubmit={(values, actions) => {
                let form_data = new FormData();

                if(values.result) {
                    form_data.append("result", values.result);
                    delete values.result;
                }

                dispatch(importTestResults(test_id, form_data)).then(function() {
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
                    <DropdownInput attributes={{
                        value: formikProps.values.test_id,
                        name: "test_id",
                        placeholder: "Select Test",
                        label: "Test",
                        options: test_options,
                        required: true,
                        disabled: true,
                        onChange: (event, data) => {formikProps.setFieldValue(data.name, data.value)}
                    }}/>

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
    );
}
