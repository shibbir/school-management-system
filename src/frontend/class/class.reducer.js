import Types from "./class.types";

const initialState = {
    program: null,
    classes: []
};

export default function reducer(state=initialState, action) {
    switch (action.type) {
        case Types.GET_CLASSES_FULFILLED: {
            return { ...state, classes: action.payload.data };
        }
        case Types.GET_CLASS_FULFILLED: {
            return { ...state, program: action.payload.data };
        }
        case Types.POST_CLASS_FULFILLED: {
            return { ...state, classes: state.classes.concat(action.payload.data) };
        }
        case Types.PATCH_CLASS_FULFILLED: {
            const classes = state.classes.map(function(x) {
                if(x.id === action.payload.data.id) {
                    x.name = action.payload.data.name;
                    x.updated_by = action.payload.data.updated_by;
                    x.updated_at = action.payload.data.updated_at;
                }
                return x;
            });
            return { ...state, classes, program: action.payload.data };
        }
        case Types.PATCH_PUPILS_ENROLMENT_FULFILLED: {
            const classes = state.classes.map(function(x) {
                if(x.id === action.payload.data.id) {
                    x.pupils = action.payload.data.pupils;
                }
                return x;
            });
            return { ...state, classes };
        }
        case Types.POST_CLASS_SUBJECT_FULFILLED: {
            const classes = state.classes.map(function(x) {
                if(x.id === action.payload.data.class_id) {
                    x.subjects = [action.payload.data].concat(x.subjects);
                }
                return x;
            });
            return { ...state, classes };
        }
        case Types.DELETE_CLASS_SUBJECT_FULFILLED: {
            const classes = state.classes.map(function(x) {
                if(x.id === action.payload.data.class_id) {
                    x.subjects = _.reject(x.subjects, { id: action.payload.data.subject_id })
                }
                return x;
            });
            return { ...state, classes };
        }
    }
    return state;
}
