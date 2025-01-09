import { helpers } from "@vuelidate/validators";

export const validationRules = {
    required: helpers.withMessage("Este campo es obligatorio", (value) => !!value),
    email: helpers.withMessage("Ingrese un correo electrónico válido", (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ),
    minLength: (length) =>
        helpers.withMessage(
            `Debe tener al menos ${length} caracteres`,
            (value) => value?.length >= length
        ),
    validTelefono: helpers.withMessage(
        "El teléfono debe tener el formato ####-####",
        (value) => /^\d{4}-\d{4}$/.test(value)
    ),
    validDui: helpers.withMessage(
        "El DUI debe tener el formato ########-#",
        (value) => /^\d{8}-\d{1}$/.test(value)
    ),
};
