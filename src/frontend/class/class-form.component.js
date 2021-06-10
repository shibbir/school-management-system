import React, { useEffect } from "react";
import { Form, Formik } from "formik";
import { Divider, Button } from "semantic-ui-react";
import iziToast from "izitoast/dist/js/iziToast";
import { useSelector, useDispatch } from "react-redux";
import ClassSchema from "./class.schema";
import { createClass, updateClass, getClass } from "./class.actions";
import { TextInput } from "../core/components/field-inputs.component";

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
                    dispatch(updateClass(values, id)).then(function() {
                        iziToast["success"]({
                            timeout: 3000,
                            message: "Your changes are saved.",
                            position: "bottomRight"
                        });
                    });
                } else {
                    dispatch(createClass(values)).then(function() {
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
                    <Divider hidden/>
                    <Button type="submit" positive disabled={formikProps.isSubmitting}>Save changes</Button>
                    <Button type="reset" disabled={formikProps.isSubmitting}>Reset</Button>
                </Form>
            )}
        </Formik>
    );
}

export default ClassForm;
