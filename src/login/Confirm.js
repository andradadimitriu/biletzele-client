import React, {useState} from "react";
import {Auth} from "aws-amplify";
import {useHistory} from "react-router-dom";
import {useAppContext} from "../libs/contextLib";
import Button from "react-bootstrap/Button";
import FormikForm from "../utils_components/FormikForm";
import * as yup from "yup";
import CustomisedAlert from "../utils_components/Alerts";

const codeSchemaMessage = "The confirmation code should be six digits."
const schema = yup.object().shape({
    confirmationCode: yup.number().required(codeSchemaMessage).test('len', codeSchemaMessage, code => code && code.toString().length === 6)
});
export default function Confirm({email, password}) {
    const {userHasAuthenticated} = useAppContext();
    const history = useHistory();
    const [emailResent, setEmailResent] = useState({resent: false, error: null});

    async function resendEmail() {
        try {
            await Auth.resendSignUp(email);
            setEmailResent({resent: true, error: null})

        } catch (e) {
            setEmailResent({resent: false, error: e})
        }
    }

    const handleConfirmationSubmit = async (values) => {
        await Auth.confirmSignUp(email, values.confirmationCode.trim());
        if (password) {
            await Auth.signIn(email, password);
            userHasAuthenticated(true);
        } else history.push("/login");
    }

    return <FormikForm
                schema={schema}
                submitHandler={handleConfirmationSubmit}
                fields={[{name: "confirmationCode", type: "tel", title: "Confirmation Code"}]}
                bottomDisplay={<>
                    <p className="help-block"> Please check your email for the code.
                        <Button variant="link" style={{margin: 0, padding: 0}} onClick={resendEmail}>Resend
                            email</Button>
                    </p>
                    {emailResent.resent &&
                    <CustomisedAlert type="success">
                        A new code has been sent to your email.
                    </CustomisedAlert>}
                    {emailResent.error && <CustomisedAlert type="danger">
                        Something went wrong when trying to resend code. Please try again.
                    </CustomisedAlert>}
                </>}
                submitButtonName="Verify"
            />;
}