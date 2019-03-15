import {
    UPDATE_VIDEO_TIME,
    UPDATE_VIDEO_PLAYING
} from '../Constants'

export const updateVideoTime = (videoURL, videoTime) => ({
    type: UPDATE_VIDEO_TIME,
    payload: { videoURL, videoTime }
});

export const updateVideoPlaying = (videoURL, videoPlaying) => ({
    type: UPDATE_VIDEO_PLAYING,
    payload: { videoURL, videoPlaying }
});