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
                if(x._id === action.payload.data._id) {
                    x.name = action.payload.data.name;
                }
                return x;
            });
            return { ...state, classes: classes };
        }
    }
    return state;
}
