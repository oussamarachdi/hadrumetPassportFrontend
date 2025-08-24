/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";
import { getAuthHeaders } from "./apiHelper";


interface Logistics {
  accommodation_provided: string;
  accommodation_covered: string;
  transportation_provided: string;
  transportation_covered: string;
  food_provided: string;
  food_covered: string;
  computer_provided: string;
  no_of_meals: string;
}

interface Opportunity {
  programmeId: string;
  description: string;
  company: string;
  placeId: string;
  logistics: Logistics;
  salary: number | null;
  duration: string;
}

interface UserProfile {
  applicationId: string;
  epId: string;
  fullName: string;
  email: string;
  role: string;
  password?: string; // It's good practice to make passwords optional as they shouldn't always be sent
  lc: string;
  mc: string;
  status: string;
  startDate: string;
  endDate: string;
  opportunity: Opportunity;
}


const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError("");
       const headers = getAuthHeaders();
      try {
        const response = await axios.get("http://localhost:3000/api/auth/me", {
          headers:headers,
        });

       
        if (response.status === 200 && response.data.user) {
        console.log(response.data.user);
          setProfile(response.data.user);
        } else {
          throw new Error("User data not found in response");
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

    fetchProfileData();
  }, []); 

  return { profile, loading, error };
};

export default useProfile;