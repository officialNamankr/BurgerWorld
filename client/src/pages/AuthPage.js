import { json, redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import store from "../store/index";
import { authActions } from "../store/auth-slice";

export default function AuthPage() {
    return <AuthForm />; 
}

export async function action({ request }) {
    const searchParams = new URL(request.url).searchParams;

    const mode = searchParams.get("mode") || "login";
    console.log(searchParams.get("mode"));
    
    if (mode !== "login" && mode !== "signup") {
        throw json({ message: "Unsupported mode" }, { status: 400 });
    }

    const data = await request.formData();
    if(mode === "login") {
        const email = data.get("email");
    const password = data.get("password");
    const authData = {  
        email: email,
        password : password,
    }
        const response = await fetch("https://burger-world.com/api/users/" + mode, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(authData),
            });
    
        console.log(response);
        const resData = await response.json();
        console.log(resData);
        if (response.status === 422 || response.status === 401) {
            // return response;
            return json(resData, { status: response.status });
        }
        if (!response.ok) {
            throw json({ message: "Could not authenticate user." }, { status: 500 });
        }
    
        const token = resData.token;
        // const expiration = resData.expiration;
        localStorage.setItem("token", token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("role", resData.user.role);
        localStorage.setItem("email", resData.user.email);
        store.dispatch(authActions.login({isAuthenticated: true, user: resData.user.email, role: resData.user.role }));
        //localStorage.setItem("expiration", expiration);
        return redirect("/home");
    }else if(mode === "signup") {
        const email = data.get("email");
        const password = data.get("password");
        if( password !== data.get("passwordConfirm")) {
            return json( {errors: [{ message: "Passwords do not match" }], status: 422 });
        }
        const authData = {  
            email: email,
            password : password,
            name: data.get("name"),
            role:"CUSTOMER"
        }
        const response = await fetch("https://burger-world.com/api/users/" + mode, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(authData),
            });
    
        console.log(response);
        const resData = await response.json();
        console.log(resData);
        
        if (!response.ok) {
            throw json(resData, { status: response.status });
        }

        return redirect("/?mode=login");
    }

    
}