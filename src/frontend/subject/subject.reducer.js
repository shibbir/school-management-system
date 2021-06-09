import Types from "./subject.types";

const initialState = {
    subject: null,
    subjects: []
};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case Types.GET_SUBJECTS_FULFILLED: {
            return {
                ...state,
                subjects: action.payload.data
            };
        }
        case Types.POST_SUBJECT_FULFILLED: {
            return { ...state, subjects: state.subjects.concat(action.payload.data) };
        }
        case Types.GET_SUBJECT_FULFILLED: {
            return { ...state, subject: action.payload.data };
        }
        case Types.PUT_SUBJECT_FULFILLED: {
            return { ...state, subjects: state.subjects.concat(action.payload.data) };
        }
    }
    return state;
}
