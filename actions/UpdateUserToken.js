import {
    FETCH_USER_TOKEN
} from '../Constants'

export const fetchUserToken = (userToken, firstName, lastName, email) => ({
    type: FETCH_USER_TOKEN,
    payload: { userToken, firstName, lastName, email }
});