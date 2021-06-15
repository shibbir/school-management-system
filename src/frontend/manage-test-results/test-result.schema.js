import { object, mixed, number, string } from "yup";

export const testResultsImportSchema = object().shape({
    result: mixed()
        .required("This field must not be empty.")
});

export const testResultSchema = object().shape({
    pupil_id: string()
        .required("This field must not be empty."),
    grade: number()
        .required("This field must not be empty.")
});
