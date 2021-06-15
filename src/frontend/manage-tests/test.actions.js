import axios from "axios";
import Types from "./test.types";

export function getTestsBySubject(id) {
    return {
        type: Types.GET_TESTS,
        payload: axios({
            method: "get",
            url: `/api/subjects/${id}/tests`
        })
    };
}

export function createTest(subject_id, data) {
    return {
        type: Types.POST_TEST,
        payload: axios({
            method: "post",
            data,
            url: `/api/subjects/${subject_id}/tests`
        })
    };
}

export function getTest(id) {
    return {
        type: Types.GET_TEST,
        payload: axios({
            method: "get",
            url: `/api/tests/${id}`
        })
    };
}

export function updateTest(id, data) {
    return {
        type: Types.PATCH_TEST,
        payload: axios({
            method: "patch",
            data,
            url: `/api/tests/${id}`
        })
    };
}

export function getTestResultsByTest(test_id) {
    return {
        type: Types.GET_TEST_RESULTS,
        payload: axios({
            method: "get",
            url: `/api/tests/${test_id}/results`
        })
    };
}

export function uploadTestResults(test_id, form_data) {
    return {
        type: Types.POST_TEST_RESULTS,
        payload: axios({
            method: "post",
            url: `/api/tests/${test_id}/results`,
            data: form_data
        })
    };
}
