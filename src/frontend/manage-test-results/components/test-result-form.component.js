import { Form, Formik } from "formik";
import queryString from "query-string";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import iziToast from "izitoast/dist/js/iziToast";
import { Divider, Button } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";

import { getUsers } from "../../user/user.actions";
import { testResultSchema } from "../test-result.schema";
import { getSubject } from "../../subject/subject.actions";
import { TextInput, DropdownInput } from "../../core/components/field-inputs.component";
import { getTestResult, createTestResult, updateTestResult, resetTestResult } from "../test-result.actions";

function TestResultForm({ id, test_id } = props) {
    const dispatch = useDispatch();
    const location = useLocation();
    const params = queryString.parse(location.search);

    useEffect(() => {
        if(id) {
            dispatch(getTestResult(id));
        } else {
            dispatch(resetTestResult());
        }
    }, [id]);

    useEffect(() => {
        if(subject && subject.class_id) {
            dispatch(getUsers(`?role=pupil&class_id=${subject.class_id}`));
        }
    }, [subject]);

    useEffect(() => {
        dispatch(getSubject(params.subject_id));
    }, [location.search]);

    const test_result = useSelector(state => state.testResultReducer.test_result);
    const pupils = useSelector(state => state.userReducer.users);
    const subject = useSelector(state => state.subjectReducer.subject);

    const pupil_options = pupils.map(function(option) {
        return { key: option.id, value: option.id, text: `${option.forename} ${option.surname}` };
    });

    return (
        <Formik
            initialValues={{
                pupil_id: test_result ? test_result.pupil_id : "",
                grade: test_result ? test_result.grade : ""
            }}
            displayName="TestResultForm"
            enableReinitialize={true}
            validationSchema={testResultSchema}
            onSubmit={(values, actions) => {
                if(id) {
                    dispatch(updateTestResult(id, values)).then(function() {
                        iziToast["success"]({
                            timeout: 3000,
                            message: "Your changes are saved.",
                            position: "topRight"
                        });
                    });
                } else {
                    dispatch(createTestResult(test_id, values)).then(function() {
                        iziToast["success"]({
                            timeout: 3000,
                            message: "Your changes are saved.",
                            position: "topRight"
                        });
                        actions.resetForm();
                    }).catch(function(err) {
                        iziToast["error"]({
                            timeout: 3000,
                            title: err.response.status,
                            message: err.response.data,
                            position: "topRight"
                        });
                    });
                }

                actions.setSubmitting(false);
            }}
        >
            {formikProps => (
                <Form onSubmit={formikProps.handleSubmit} className="ui form">
                    <DropdownInput attributes={{
                        value: formikProps.values.pupil_id,
                        name: "pupil_id",
                        placeholder: "Select Pupil",
                        label: "Pupil",
                        options: pupil_options,
                        required: true,
                        disabled: !!id,
                        onChange: (event, data) => {formikProps.setFieldValue(data.name, data.value)}
                    }}/>

                    <TextInput attributes={{
                        type: "number",
                        name: "grade",
                        label: "Grade",
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

export default TestResultForm;
