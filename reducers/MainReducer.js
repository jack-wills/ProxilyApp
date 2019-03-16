import {combineReducers} from 'redux';
import {
    FETCH_USER_TOKEN,
    UPDATE_VIDEO_TIME,
    UPDATE_VIDEO_PLAYING,
} from '../Constants'

const INITAL_STATE = {
    userToken: '',
    video: {}
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
                isFacebook: action.payload.isFacebook,
            };
        case UPDATE_VIDEO_TIME:
            state.video
            return {
                ...state,
                video: {
                    [action.payload.videoURL]: {time: action.payload.videoTime},
                }
            };
        case UPDATE_VIDEO_PLAYING:
            state.video
            return {
                ...state,
                currentVideoPlaying: action.payload.videoURL
            };
        default:
            return state;
    }
}

export default combineReducers({
    main: mainReducer,
})