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

export function getSubject(class_id, subject_id) {
    return {
        type: Types.GET_SUBJECT,
        payload: axios({
            method: "get",
            url: `/api/classes/${class_id}/subjects/${subject_id}`
        })
    };
}

export function updateSubject(class_id, subject_id, subject) {
    return {
        type: Types.PATCH_SUBJECT,
        payload: axios({
            method: "patch",
            data: subject,
            url: `/api/classes/${class_id}/subjects/${subject_id}`
        })
    };
}

export function deleteSubject(class_id, subject_id) {
    return {
        type: Types.DELETE_SUBJECT,
        payload: axios({
            method: "delete",
            url: `/api/classes/${class_id}/subjects/${subject_id}`
        })
    };
}

export function archiveSubject(class_id, subject_id, status) {
    return {
        type: Types.ARCHIVE_SUBJECT,
        payload: axios({
            method: "patch",
            data: { status },
            url: `/api/classes/${class_id}/subjects/${subject_id}`
        })
    };
}

export function resetSubject() {
    return {
        type: Types.RESET_SUBJECT
    };
}
