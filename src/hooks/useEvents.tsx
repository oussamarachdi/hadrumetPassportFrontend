/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getAuthHeaders } from "./apiHelper";
import axios from "axios";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  dayTime: string;
  startDate: string;
  endDate: string;
  picture: string;
    eventType: string
}
const useEvents = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [events, setEvents] = useState<Event[]>([]);

   useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true); // Ensure loading is true at the start of the fetch
      setError("");
      try {
        const headers = getAuthHeaders();
        // As before, ensure the protocol (http://) is present
        const response = await axios.get(
          "https://hadrumetpassportbackend.onrender.com/api/events",
          {
            headers: headers
          }
        );

        if (response.status === 200) {
          console.log(response.data);
          setEvents(response.data);
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
    events
  };
};

export default useEvents;
