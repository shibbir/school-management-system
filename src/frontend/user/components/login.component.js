import axios from "axios";
import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import iziToast from "izitoast/dist/js/iziToast";
import { Button, Segment, Header, Divider, Image, Modal, Message, Icon } from "semantic-ui-react";

import { login } from "../user.actions";
import { loginSchema } from "../user.schema";
import OAuthProviders from "./oauth-providers.component";
import { TextInput } from "../../core/components/field-inputs.component";

export default function Login() {
    const dispatch = useDispatch();

    return (
        <div style={{paddingTop: "85px"}}>
            <div className="ui middle aligned center aligned grid">
                <div>
                    <Header as="h2" className="teal center aligned">
                        <div className="content">
                            Log-in to your account
                        </div>
                    </Header>

                    <Segment className="stacked">
                        <Formik
                            initialValues={{
                                email: "",
                                password: ""
                            }}
                            validationSchema={loginSchema}
                            onSubmit={(values, actions) => {
                                dispatch(login({
                                    username: values.email,
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
                                    name: "email",
                                    type: "email",
                                    icon: "mail",
                                    placeholder: "Email address",
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
                    </Segment>

                    <OAuthProviders/>
                </div>
            </div>
        </div>
    );
}
