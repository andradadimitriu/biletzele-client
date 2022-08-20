import React, {useState} from "react";
import {Auth} from "aws-amplify";
import Confirm from './Confirm';
import * as yup from "yup";
import {getValidations, VALIDATION_KEYS} from "../biletzele/utils/validations";
import FormikForm from "../utils_components/FormikForm";

const formSchema = yup.object().shape({
    ...getValidations(VALIDATION_KEYS.EMAIL,
        VALIDATION_KEYS.PASSWORD,
        VALIDATION_KEYS.CONFIRM_PASSWORD),
});

export default function Signup() {

    const [userCredentials, setUserCredentials] = useState(null);
    const [newUser, setNewUser] = useState(null);

    const handleSubmit = async (values) => {
        const userCredentials = {
            username: values.email,
            password: values.password,
        };
        const newUser = await Auth.signUp(userCredentials);
        setUserCredentials(userCredentials);
        setNewUser(newUser);
    };

    function renderForm() {
        const formFields = [
            {name: "email", type: "email", title: "Email"},
            {name: "password", type: "password", title: "Password"},
            {name: "confirmPassword", type: "password", title: "Confirm Password"}
        ];
        return <FormikForm schema={formSchema}
                           submitHandler={handleSubmit}
                           fields={formFields}
                           submitButtonName="Signup"
        />;
    }

    return newUser === null ? renderForm() :
                <Confirm email={userCredentials.username} password={userCredentials.password}/>;
}