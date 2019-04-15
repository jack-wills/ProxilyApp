import {
    UPDATE_SETTINGS,
} from '../Constants'

export const updateSettings = (settings) => ({
    type: UPDATE_SETTINGS,
    payload: { settings }
});
