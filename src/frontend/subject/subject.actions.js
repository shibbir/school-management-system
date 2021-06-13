import axios from "axios";
import Types from "./subject.types";

export function getSubjects(class_id) {
    return {
        type: Types.GET_SUBJECTS,
        payload: axios({
            method: "get",
            url: `/api/classes/${class_id}/subjects`
        })
    };
}

export function createSubject(class_id, subject) {
    return {
        type: Types.POST_SUBJECT,
        payload: axios({
            method: "post",
            data: subject,
            url: `/api/classes/${class_id}/subjects`
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

export function updateSubject(id, subject) {
    return {
        type: Types.PATCH_SUBJECT,
        payload: axios({
            method: "patch",
            data: subject,
            url: `/api/subjects/${id}`
        })
    };
}

export function deleteSubject(id) {
    return {
        type: Types.DELETE_SUBJECT,
        payload: axios({
            method: "delete",
            url: `/api/subjects/${id}`
        })
    };
}

export function resetSubject() {
    return {
        type: Types.RESET_SUBJECT
    };
}
