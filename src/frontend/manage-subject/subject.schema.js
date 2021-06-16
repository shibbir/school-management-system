import { string, object } from "yup";

export default object().shape({
    name: string()
        .min(2, "This field must be at least 2 characters long.")
        .max(50, "This field must be at most 50 characters long.")
        .required("This field must not be empty."),
    teacher_id: string()
        .required("This field must not be empty.")
});
