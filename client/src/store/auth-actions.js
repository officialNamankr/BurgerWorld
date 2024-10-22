import { authActions } from "./auth-slice";
import { getToken } from "../utils/getToken";
import { redirect } from "react-router-dom";
export const fetchCurrentUser = () => {
    return async (dispatch) => {
        const token = getToken();
        if (!token) {
            dispatch(authActions.logout());
            return;
        }
        const email = localStorage.getItem("email");
        const role = localStorage.getItem("role");
        if(email && role) {
            dispatch(authActions.login({
                isAuthenticated: true,
                user: email,
                role: role,
            }));
            return;
        }
        console.log("fetchCurrentUser", token);
        
        const response = await fetch("https://burger-world.com/api/users/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Could not fetch user");
        }
        const data = await response.json();

        console.log(data);
        dispatch(authActions.login({
            isAuthenticated: true,
            user: data.email,
            role: data.role,
        }));

    };
}


export const logoutUser = () => {
    return async (dispatch) => {

        const token = getToken();
        if (!token) {
            dispatch(authActions.logout());
            return;
        }
        const response = await fetch("https://burger-world.com/api/users/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
            if (!response.ok) {
                throw new Error("Could not logout user");
            }
            //localStorage.removeItem("token");
            
        dispatch(authActions.logout());
    };
}