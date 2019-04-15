import {combineReducers} from 'redux';
import {
    FETCH_USER_TOKEN,
    UPDATE_VIDEO_TIME,
    UPDATE_VIDEO_PLAYING,
    UPDATE_SETTINGS
} from '../Constants'

const INITAL_STATE = {
    userToken: '',
    settings: {},
    currentVideoPlaying: "",
};

const mainReducer = (state = INITAL_STATE, action) => {
    switch (action.type) {
        case FETCH_USER_TOKEN:
            return {
                ...state,
                userToken: action.payload.userToken,
                name: action.payload.name,
                email: action.payload.email,
                profilePicture: action.payload.picture,
            };
        case UPDATE_VIDEO_TIME:
            return {
                ...state,
                video: {
                    [action.payload.videoURL]: {time: action.payload.videoTime},
                }
            };
        case UPDATE_VIDEO_PLAYING:
            return {
                ...state,
                currentVideoPlaying: action.payload.videoURL
            };
        case UPDATE_SETTINGS:
            return {
                ...state,
                settings: action.payload.settings,
            };
        default:
            return state;
    }
}

export default combineReducers({
    main: mainReducer,
})