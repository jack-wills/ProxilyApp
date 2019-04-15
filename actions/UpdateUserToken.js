import {
    FETCH_USER_TOKEN
} from '../Constants'

export const fetchUserToken = (userToken, name, email, picture) => ({
    type: FETCH_USER_TOKEN,
    payload: { userToken, name, email, picture }
});