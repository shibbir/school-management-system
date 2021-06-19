import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import iziToast from "izitoast/dist/js/iziToast";
import { Button, Segment, Header, Icon } from "semantic-ui-react";

import { login } from "../user.actions";
import { loginSchema } from "../user.schema";
import { TextInput } from "../../core/components/field-inputs.component";

export default function Login() {
    const dispatch = useDispatch();
    const [isForgotPasswordModalActive, setForgotPasswordModalActive] = useState(false);

    return (
        <div style={{paddingTop: "85px"}}>
            <div className="ui middle aligned center aligned grid">
                <div style={{maxWidth: "450px"}}>
                    <Header as="h2" className="center aligned">
                        <div className="content">
                            <Icon name="graduation cap" size="big"/> Log-in to your account
                        </div>
                    </Header>

                    <Segment className="stacked">
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
                                    icon: "mail",
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

                                <Button fluid type="submit" className="large teal">Login</Button>
                            </Form>
                        </Formik>
                        <button className="ui primary tertiary button" onClick={() => setForgotPasswordModalActive(true)}>Forgot password?</button>
                    </Segment>
                </div>
            </div>
        </div>
    );
}
