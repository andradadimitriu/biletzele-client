import React, {useState} from "react";
import Form from 'react-bootstrap/Form';
import {Formik} from "formik";
import LoaderButton from "./LoaderButton";
import Alert from "./Alerts";

export default function FormikForm({schema, submitHandler, fields, bottomDisplay, submitButtonName}) {
    const [submitError, setSubmitError] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(values) {
        setIsLoading(true);
        try {
            await submitHandler(values);
        } catch (e) {
            setIsLoading(false);
            setSubmitError(e);
        }
    }

    return <div className="center-form">
        <Formik
            validationSchema={schema}
            onSubmit={onSubmit}
            initialValues={
                fields.reduce((values, fieldDetails) => {
                    values[fieldDetails.name] = fieldDetails.initialValue ? fieldDetails.initialValue : ""
                    return values;
                }, {})}
        >
            {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  values,
                  touched,
                  isValid,
                  errors,
              }) => (
                <Form onSubmit={handleSubmit}>
                    {fields.map((fieldDetails, key) =>
                        <Form.Group key={key} controlId={fieldDetails.name}>
                            {fieldDetails.title && <Form.Label>{fieldDetails.title}</Form.Label>}
                            <Form.Control
                                autoFocus={key === 0}
                                type={fieldDetails.type}
                                value={values[fieldDetails.name]}
                                onChange={handleChange}
                                name={fieldDetails.name}
                                onBlur={handleBlur}
                                isValid={touched[fieldDetails.name] && !errors[fieldDetails.name]}
                                isInvalid={touched[fieldDetails.name] && errors[fieldDetails.name]}
                            />
                            <Form.Control.Feedback type="invalid">
                                <div style={{whiteSpace: "pre-wrap"}}>
                                    {errors[fieldDetails.name]}
                                </div>
                            </Form.Control.Feedback>
                            {fieldDetails.bottomDisplay}
                        </Form.Group>
                    )}
                    {bottomDisplay}
                    {submitError && <Alert type="danger">{submitError}</Alert>}
                    <div className="centered-content">
                        <LoaderButton
                            disabled={!isValid}
                            type="submit"
                            isLoading={isLoading}
                        >
                            {submitButtonName}
                        </LoaderButton>
                    </div>
                </Form>)}
        </Formik>
    </div>;
}