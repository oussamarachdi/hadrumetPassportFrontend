/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // 1. IMPORT useAuth


const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [appId, setAppId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
     const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Reset error on new submission

        try {
            const response = await axios.post(
                "https://hadrumetpassportbackend.onrender.com/api/auth/login",
                {
                    appID: appId,
                    password: password
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );

            if (response.status === 200) {
                console.log(response.data);
                const { token,user } = response.data;
                
                localStorage.setItem("token", token);
                login(user); 
                navigate("/");
            }
        } catch (error: any) {
            if (error.response) {
                // Server responded with a status code that falls out of the range of 2xx
                console.error("Error response data:", error.response.data);
                
                // Safely access the error message
                const errorMessage = error.response.data?.error || error.response.data?.message || "An unexpected error occurred.";

                setError(errorMessage);

            } else if (error.request) {
                // The request was made but no response was received
                console.error("Error request:", error.request);
                setError("Network error. Please check your connection.");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        error,
        loading,
        handleSubmit,
        setAppId,
        setPassword
    };
};

export default useLogin;