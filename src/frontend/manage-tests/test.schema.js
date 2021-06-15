import { string, object, mixed } from "yup";

export const testSchema = object().shape({
    name: string()
        .min(2, "This field must be at least 2 characters long.")
        .max(30, "This field must be at most 50 characters long.")
        .required("This field must not be empty."),
    date: string()
        .required("This field must not be empty.")
});

export const testResultSchema = object().shape({
    result: mixed()
        .required("This field must not be empty.")
});
