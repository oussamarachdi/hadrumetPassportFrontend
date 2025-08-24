import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useAdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://hadrumetpassportbackend.onrender.com/api/admin/login",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem("adminToken", token);
        navigate("/dep/im/admin");
      }
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data?.error || error.response.data?.message || "An unexpected error occurred.";
        setError(errorMessage);
      } else if (error.request) {
        setError("Network error. Please check your connection.");
      } else {
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
    setUsername,
    setPassword,
  };
};

export default useAdminLogin;