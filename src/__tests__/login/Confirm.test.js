// import React, {useState} from "react";
// import {Auth} from "aws-amplify";
// import {useHistory} from "react-router-dom";
// import LoaderButton from "../utils_components/LoaderButton";
// import {useAppContext} from "../libs/contextLib";
// import {onError} from "../libs/errorLib";
// import Button from "react-bootstrap/Button";
// import {Alert} from "react-bootstrap";
// import FormikForm from "../utils_components/FormikForm";
// import * as yup from "yup";
// const codeSchemaMessage = "The confirmation code should be six digits."
// const schema = yup.object().shape({
//     confirmationCode: yup.string().required(codeSchemaMessage).matches(/^(\d+){6,}$/, codeSchemaMessage)
// });
// export default function Confirm({email, password}) {
//     const {userHasAuthenticated} = useAppContext();
//     const [isLoading, setIsLoading] = useState(false);
//     const [emailResent, setEmailResent] = useState({resent: false, error: null});
//
//     async function resendEmail() {
//         try {
//             await Auth.resendSignUp(email);
//             setEmailResent({resent: true, error: null})
//
//         } catch (e) {
//             setEmailResent({resent: false, error: e})
//         }
//     }
//
//     const handleConfirmationSubmit = async (values) => {
//         setIsLoading(true);
//
//         try {
//             await Auth.confirmSignUp(email, values.confirmationCode);
//             if (password) {
//                 await Auth.signIn(email, password);
//                 userHasAuthenticated(true);
//             } else history.push("/login");
//
//         } catch (e) {
//             onError(e);
//             setIsLoading(false);
//         }
//     }
//
//     return (
//         <div className="Signup">
//             <FormikForm
//                 schema={schema}
//                 submitHandler={handleConfirmationSubmit}
//                 fields={[{name: "confirmationCode", type: "tel", title: "Confirmation Code"}]}
//                 bottomDisplay={<>
//                     <p className="help-block"> Please check your email for the code.
//                         <Button variant="link" style={{margin: 0, padding: 0}} onClick={resendEmail}>Resend
//                             email</Button>
//                     </p>
//                     {emailResent.resent &&
//                     <Alert variant="success" className="p-1" style={{fontSize: "0.8rem"}}>
//                         A new code has been sent to your email.
//                     </Alert>}
//                     {emailResent.error && <Alert variant="danger" className="p-1" style={{fontSize: "0.8rem"}}>
//                         Something went wrong when trying to resend code. Please try again.
//                     </Alert>}</>}
//                 buttonCreator={(isValid) => <LoaderButton
//                     block
//                     type="submit"
//                     isLoading={isLoading}
//                     disabled={!isValid}
//                 >
//                     Verify
//                 </LoaderButton>}
//             />
//
//         </div>
//     );
// }