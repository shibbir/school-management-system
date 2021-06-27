import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import fileDownload from "js-file-download";
import { useParams } from "react-router-dom";
import iziToast from "izitoast/dist/js/iziToast";
import { Divider, Button, Icon } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";

import { getTestsBySubject } from "../../manage-tests/test.actions";
import { importTestResults } from "../test-result.actions";
import { testResultsImportSchema } from "../test-result.schema";
import { FileInput, DropdownInput } from "../../core/components/field-inputs.component";

export default function TestResultsImportForm({ test_id }) {
    const dispatch = useDispatch();
    const { subject_id } = useParams();

    useEffect(() => {
        dispatch(getTestsBySubject(subject_id));
    }, [subject_id]);

    const tests = useSelector(state => state.testReducer.tests);

    const test_options = tests.map(function(option) {
        return { key: option.id, value: option.id, text: option.name };
    });

    const downloadSampleGradesImportFile = function() {
        axios.get(`/api/tests/${test_id}/download-sample-batch-grade-file`, {
            responseType: "blob",
        }).then(res => {
            fileDownload(res.data, "sample-batch-grade-file.csv");
        }).catch(err => {
            iziToast["error"]({
                timeout: 3000,
                message: "An error occurred. Please try again.",
                position: "topRight"
            });
        });
    };

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
                        label: "Result Sheet",
                        required: true,
                        info: "Please upload a CSV file containing the grades. Max file size is 2 MB.",
                        onChange: event => {formikProps.setFieldValue("result", event.currentTarget.files[0])}
                    }}/>

                    <span onClick={() => downloadSampleGradesImportFile()} style={{textDecoration: "underline", cursor: "pointer"}}>
                        <Icon name="download"/>
                        Download a sample CSV file for this subject
                    </span>

                    <Divider hidden/>
                    <Button type="submit" positive disabled={formikProps.isSubmitting}>Upload For Batch Grading</Button>
                </Form>
            )}
        </Formik>
    );
}
