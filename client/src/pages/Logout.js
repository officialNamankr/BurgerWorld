import { redirect, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/removeToken";
import { useEffect } from "react";
import { logoutUser } from "../store/auth-actions";
import { useDispatch } from "react-redux";


export const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const performLogout = async () => {
            dispatch(logoutUser());
            removeToken(); // Remove token after logout
            localStorage.clear();
            navigate('/'); // Navigate after logout
        };

        performLogout();
    }, [dispatch, navigate]);
    return null;

}