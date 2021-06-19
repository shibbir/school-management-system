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
            return { ...state, classes: [action.payload.data].concat(state.classes) };
        }
        case Types.PATCH_CLASS_FULFILLED: {
            const classes = state.classes.map(function(x) {
                if(x.id === action.payload.data.id) {
                    x = { ...action.payload.data };
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
    }
    return state;
}
