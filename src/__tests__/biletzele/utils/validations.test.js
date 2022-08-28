import * as yup from "yup";
import {getValidations, VALIDATION_KEYS} from "../../../biletzele/utils/validations";


describe('yup schema validations', () => {
    const schema = yup.object().shape({
        ...getValidations(VALIDATION_KEYS.PASSWORD, VALIDATION_KEYS.CONFIRM_PASSWORD),
        password: yup.string().required()
    });
    test('password confirmation', async () => {
       expect(await schema.isValid({password: "a", confirmPassword: "a"})).toBeTruthy();
       expect(await schema.isValid({password: "a", confirmPassword: "b"})).toBeFalsy();
       expect(await schema.validate({password: "a", confirmPassword: "b"}))
       // expect(.toThrow(TypeError)
    });
});