import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import iziToast from "izitoast/dist/js/iziToast";
import { Button, Segment, Header, Icon, Modal, Grid, Message } from "semantic-ui-react";

import { login } from "../user.actions";
import { loginSchema } from "../user.schema";
import { TextInput } from "../../core/components/field-inputs.component";

export default function Login() {
    const dispatch = useDispatch();
    const [isForgotPasswordModalActive, setForgotPasswordModalActive] = useState(false);

    return (
        <>
            <Grid textAlign='center' style={{ height: "100vh" }} verticalAlign="middle">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2">
                        <div className="content">
                            <Icon name="graduation cap" size="big"/> Log-in to your account
                        </div>
                    </Header>

                    <Segment stacked textAlign="left">
                        <Formik
                            initialValues={{
                                username: "",
                                password: ""
                            }}
                            validationSchema={loginSchema}
                            onSubmit={(values, actions) => {
                                dispatch(login({
                                    username: values.username,
                                    password: values.password,
                                    grant_type: "password"
                                })).catch(function(err) {
                                    iziToast["error"]({
                                        timeout: 3000,
                                        title: err.response.status,
                                        message: err.response.data,
                                        position: "topRight"
                                    });
                                    actions.setSubmitting(false);
                                });
                            }}
                        >
                            <Form className="ui form">
                                <TextInput attributes={{
                                    name: "username",
                                    type: "email",
                                    icon: "user",
                                    placeholder: "Username",
                                    autoComplete: "username"
                                }}/>

                                <TextInput attributes={{
                                    name: "password",
                                    type: "password",
                                    icon: "lock",
                                    placeholder: "Password",
                                    autoComplete: "current-password"
                                }}/>

                                <Button fluid type="submit" size="large" color="teal">Login</Button>
                            </Form>
                        </Formik>
                    </Segment>
                    <Message>
                        <button className="ui primary tertiary button" onClick={() => setForgotPasswordModalActive(true)}>Forgot password?</button>
                    </Message>
                </Grid.Column>
            </Grid>

            <Modal dimmer size="tiny" open={isForgotPasswordModalActive}>
                <Modal.Header>Forgot your password?</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        Please get in touch with <a href="mailto:help@sms.com">help@sms.com</a> to reset your password.
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={() => setForgotPasswordModalActive(false)}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    );
}
