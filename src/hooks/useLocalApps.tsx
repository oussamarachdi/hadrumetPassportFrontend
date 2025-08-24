/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useEffect, useState } from "react";
import { getAuthHeaders } from "./apiHelper";
import axios from "axios";
interface App {
  id: string;
  name: string;
  androidLink: string;
  iosLink: string;
  picture: string;
}

const useLocalApps = () => {
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState("");
  const [apps, setApps] = useState<App[]>([]);

  useEffect(() => {
    // We define an async function inside useEffect to perform the data fetching
    const fetchContacts = async () => {
      setLoading(true); // Ensure loading is true at the start of the fetch
      setError("");
      try {
        const headers = getAuthHeaders();
        const response = await axios.get(
          "https://hadrumetpassportbackend.onrender.com/api/localApps",
          {
            headers: headers
          }
        );

        if (response.status === 200) {
          console.log(response.data);
          setApps(response.data);
        }
      } catch (error: any) {
            if (error.response) {
                console.error("Error response data:", error.response.data);
                const errorMessage = error.response.data?.error || error.response.data?.message || "An unexpected error occurred.";

                setError(errorMessage);

            } else if (error.request) {
                console.error("Error request:", error.request);
                setError("Network error. Please check your connection.");
            } else {
                console.error('Error message:', error.message);
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    fetchContacts(); 
  }, []);
  return {
    loading,
    error,
    apps
  };
};

export default useLocalApps;
