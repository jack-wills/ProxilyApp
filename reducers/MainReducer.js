import {combineReducers} from 'redux';
import {
    FETCH_USER_TOKEN,
} from '../Constants'

const INITAL_STATE = {
    userToken: ''
};

const mainReducer = (state = INITAL_STATE, action) => {
    switch (action.type) {
        case FETCH_USER_TOKEN:
            return {
                ...state,
                userToken: action.payload.userToken,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                email: action.payload.email,
            };
        default:
            return state;
    }
}

export default combineReducers({
    main: mainReducer,
})