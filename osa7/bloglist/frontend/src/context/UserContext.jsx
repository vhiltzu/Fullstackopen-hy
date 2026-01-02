import { createContext } from 'react'
import { useReducer } from 'react'

import userSessionReducer from '../reducers/userSessionReducer'
import { setToken } from "../requests/blogs";

const UserContext = createContext()

export const UserContextProvider = (props) => {
    const getLoggedUser = () => {
        const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
        if (loggedUserJSON) {
            return JSON.parse(loggedUserJSON);
        }
        return null;
    }

    const [userSession, userSessionDispatch] = useReducer(userSessionReducer, getLoggedUser())

    const setUserSession = (user) => {
        localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
        setToken(user.token);
        userSessionDispatch({ type: "SET", payload: user })
    }

    const clearUserSession = () => {
        localStorage.removeItem("loggedBlogAppUser");
        setToken(null);
        userSessionDispatch({ type: "RESET" })
    }

    return (
        <UserContext.Provider value={{ userSession, setUserSession, clearUserSession }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContext