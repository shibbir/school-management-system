import axios from "axios";
import Types from "./subject.types";

export function getSubjects() {
    return {
        type: Types.GET_SUBJECTS,
        payload: axios({
            method: "get",
            url: "/api/subjects"
        })
    };
}

export function getSubjects2(class_id) {
    return {
        type: Types.GET_SUBJECTS,
        payload: axios({
            method: "get",
            url: `/api/classes/${class_id}/subjects`
        })
    };
}

export function createSubject(subject) {
    return {
        type: Types.POST_SUBJECT,
        payload: axios({
            method: "post",
            data: subject,
            url: `/api/subjects`
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

export function getPupilGrades(id) {
    return {
        type: Types.GET_PUPIL_GRADES_BY_SUBJECT,
        payload: axios({
            method: "get",
            url: `/api/subjects/${id}/grades`
        })
    };
}
