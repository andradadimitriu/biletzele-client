import * as Yup from "yup";

export const VALIDATION_KEYS = {
    EMAIL: "email",
    PASSWORD: "password",
    CONFIRM_PASSWORD: "confirmPassword"
};
const yupValidation = {
    email: Yup.string()
        .email("Must be a valid email.")
        .required("Email is required."),
    password: Yup.string()
        .required("Password is required.")
        //TODO check for each criteria
        .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*([^A-Za-z\d\s])).{6,}/,
            "Password must have: \n\t 6 characters or more \n\t 1 lower case letter \n\t 1 upper case letter \n\t 1 number \n\t 1 special character"),
    confirmPassword: Yup.string().required("Password must be confirmed.").oneOf([Yup.ref('password')], 'Passwords must match'),
};
export const getValidations = (...keys) => keys ? Object.fromEntries(
    keys.map(key => [key, yupValidation[key]])
) : yupValidation;