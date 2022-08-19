import React, {useState} from "react";
import {Auth} from "aws-amplify";
import Form from 'react-bootstrap/Form';
import {useAppContext} from "../libs/contextLib";
import "../biletzele/game_room/Forms.css";
import * as yup from "yup";
import {getValidations, VALIDATION_KEYS} from "../biletzele/utils/validations";
import FormikForm from "../utils_components/FormikForm";

const formFields = [
    {name: "email", type: "email", title: "Email"},
    {name: "password", type: "password", title: "Password"}];
const formSchema = yup.object().shape({
    ...getValidations(VALIDATION_KEYS.EMAIL),
    password: yup.string().required()
});
export default function LoginForm(props) {
    const {userHasAuthenticated} = useAppContext();
    const [failedLogin, setFailedLogin] = useState(false);

    async function handleSubmit(values) {
        try {
            await Auth.signIn(values.email, values.password);
            userHasAuthenticated(true);
        } catch (e) {
            if (e.code === "UserNotConfirmedException") {
                props.setAuthDetails(values);
                props.setUserUnconfirmed(true);
            } else {
                setFailedLogin(true);
                throw e;
            }

        }
    }

    return (
        <div className="center-form">
            <FormikForm schema={formSchema}
                        submitHandler={handleSubmit}
                        fields={formFields}
                        bottomDisplay={failedLogin &&
                        <Form.Text className="text-danger">Incorrect login details.</Form.Text>}
                        submitButtonName="Login"
            />
        </div>
    );
}
