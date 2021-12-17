import { authService } from "myFirebase";
import React from "react";
import { useState } from "react";


const AuthForm = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");


    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email") {
            setEmail(value);
        } else if(name === "password") {
            setPassword(value);
        }
    }


    const onSubmit = async(event) => {
        event.preventDefault();
        try {
            let data;
            if(newAccount) {
                // Create New Account
                data = await authService.createUserWithEmailAndPassword(email, password);
            } else {
                // Log In
                data = await authService.signInWithEmailAndPassword(email, password);
            }
            console.log(data);
        } catch(error) {
            setError(error.message);
        }
    }

    // 회원가입 or 로그인 토글
    const toggleAccount = () => {
        setNewAccount((prev) => !prev);
    }

    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input 
                    type="text" 
                    placeholder="Email" 
                    required 
                    value={email} 
                    name="email"
                    onChange={onChange}
                    className="authInput"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    required 
                    value={password}
                    name="password"
                    onChange={onChange}
                    className="authInput"
                />
                <input 
                    type="submit" 
                    value={newAccount ? "Create Account" : "LogIn"} 
                    className="authInput authSubmit"    
                />
                {error && <span className="authError">{error}</span>}
            </form>
                <span onClick={toggleAccount} className="authSwitch">
                    {newAccount ? "Login" : "Create Account"}
                </span>
            </>
    );

}

export default AuthForm;
