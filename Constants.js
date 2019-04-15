export const FETCH_USER_TOKEN = 'FETCH_USER_TOKEN';
export const UPDATE_USER_TOKEN = 'UPDATE_USER_TOKEN';
export const UPDATE_VIDEO_TIME = 'UPDATE_VIDEO_TIME';
export const UPDATE_VIDEO_PLAYING = 'UPDATE_VIDEO_PLAYING';
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';

export const DEBUG_MODE = __DEV__
export const FRONT_SERVICE_URL = DEBUG_MODE ? 'http://localhost:8080' : 'http://ec2-3-212-94-190.compute-1.amazonaws.com:8080';