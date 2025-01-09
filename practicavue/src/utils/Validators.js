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
    validPassword: helpers.withMessage(
        (value) => {
            if (!value) return "Este campo es obligatorio.";
            if (value.length < 8) return "Clave menor a 8 caracteres.";
            if (value.length > 72) return "Clave mayor a 72 caracteres.";
            if (!/\W/.test(value)) return "Clave debe contener al menos un caracter especial.";
            if (!/\d/.test(value)) return "Clave debe contener al menos un dígito.";
            if (!/[a-z]/.test(value)) return "Clave debe contener al menos una letra en minúsculas.";
            if (!/[A-Z]/.test(value)) return "Clave debe contener al menos una letra en mayúsculas.";
            return "Clave válida.";
        },
        (value) => {
            // Devuelve true o false según los criterios de validación.
            return (
                value &&
                value.length >= 8 &&
                value.length <= 72 &&
                !/\s/.test(value) &&
                /\W/.test(value) &&
                /\d/.test(value) &&
                /[a-z]/.test(value) &&
                /[A-Z]/.test(value)
            );
        }
    ),
};
