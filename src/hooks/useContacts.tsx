/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState, useEffect } from "react";
import { getAuthHeaders } from "./apiHelper";

// The interface remains the same, which is great.
interface Contact {
  id: string;
  image: string;
  fullName: string;
  phone: string;
  facebook_link: string;
  role: string;
}

const useContacts = () => {
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  

  // Helper to map backend contact to frontend contact
  const toFrontend = (item: any): Contact => ({
    id: item.id,
    image: item.picture || "", // Map 'picture' from API to 'image' for frontend
    fullName: item.fullName,
    phone: item.phone ? String(item.phone) : "",
    facebook_link: item.facebookLink || "",
    role: item.role,
  });

  // useEffect will run once when the hook is first used, thanks to the empty dependency array [].
  useEffect(() => {
    // We define an async function inside useEffect to perform the data fetching
    const fetchContacts = async () => {
      setLoading(true); // Ensure loading is true at the start of the fetch
      setError("");
      try {
        const headers = getAuthHeaders();
        // As before, ensure the protocol (http://) is present
        const response = await axios.get(
          "http://localhost:3000/api/contacts",
          {
            headers: headers
          }
        );

        if (response.status === 200) {
          setContacts(response.data.map(toFrontend));
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

    fetchContacts(); // Call the async function
  }, []); 

  return {
    loading,
    error,
    contacts,
  };
};

export default useContacts;
