import axios from "axios";
import Types from "./subject.types";

export function getSubjects(query = "") {
    return {
        type: Types.GET_SUBJECTS,
        payload: axios({
            method: "get",
            url: `/api/subjects${query}`
        })
    };
}

export function createSubject(formData) {
    return {
        type: Types.POST_SUBJECT,
        payload: axios({
            method: "post",
            data: formData,
            url: "/api/subjects"
        })
    };
}

export function updateSubject(formData, id) {
    return {
        type: Types.PUT_SUBJECT,
        payload: axios({
            method: "put",
            data: formData,
            url: `/api/subjects/${id}`
        })
    };
}

export function getSubject(id) {
    return {
        type: Types.GET_SUBJECT,
        payload: axios({
            method: "get",
            url: `/api/subjects/${id}`
        })
    };
}
