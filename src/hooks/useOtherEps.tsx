/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getAuthHeaders } from "./apiHelper";
import axios from "axios";

// Interface for the raw data coming from the API
interface ApiEp {
  fullName: string;
  phone: string;
  picture: string;
  nationality: string;
  programme:  string; 
}

export interface FrontendEp {
  fullName: string;
  phone: string;
  picture: string;
  nationality: string;
  programme: string; 
}

// --- Helper for Transformation ---
// A simple mapping object to make the code clean and easy to read.
const programmeMap: { [key: string]: string } = {
  "7": "Volunteering experience",
  "8": "Talent experience",
  "9": "Teaching experience",
};

const useOtherEps = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // The state will hold the transformed data
  const [eps, setEps] = useState<FrontendEp[]>([]);

  useEffect(() => {
    const fetchAndProcessContacts = async () => {
      setLoading(true);
      setError("");
      try {
        const headers = getAuthHeaders();
        // We expect the API to return data matching the ApiEp interface
        const response = await axios.get<ApiEp[]>(
          "http://localhost:3000/api/realizedEps",
          {
            headers: headers,
          }
        );

        if (response.status === 200) {
          // --- TRANSFORMATION LOGIC ---
          // Map over the raw API data and transform it into the structure we want.
          const transformedEps = response.data.map((ep) => ({
            ...ep, 
            programme: programmeMap[ep.programme] || "Unknown Programme",
          }));

          // Set the state with the newly transformed array
          setEps(transformedEps);
        }
      } catch (error: any) {
        if (error.response) {
          console.error("Error response data:", error.response.data);
          const errorMessage =
            error.response.data?.error ||
            error.response.data?.message ||
            "An unexpected error occurred.";
          setError(errorMessage);
        } else if (error.request) {
          console.error("Error request:", error.request);
          setError("Network error. Please check your connection.");
        } else {
          console.error("Error message:", error.message);
          setError("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessContacts();
  }, []); // The empty dependency array ensures this runs only once.

  return {
    loading,
    error,
    eps,
  };
};

export default useOtherEps;