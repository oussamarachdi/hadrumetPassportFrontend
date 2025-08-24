/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { getAuthHeaders } from "./apiHelper";

interface category {
  id: string;
  label: string;
}

const useCategories = () => {
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState("");
  const [categories, setCategories] = useState<category[]>([]);

  useEffect(() => {
    // We define an async function inside useEffect to perform the data fetching
    const fetchContacts = async () => {
      setCatLoading(true); // Ensure loading is true at the start of the fetch
      setCatError("");
      try {
        const headers = getAuthHeaders();
        // As before, ensure the protocol (http://) is present
        const response = await axios.get(
          "http://localhost:3000/api/categories/",
          {
            headers: headers,
          }
        );

        if (response.status === 200) {
          console.log(response.data);
          setCategories(response.data);
        }
      } catch (error: any) {
        if (error.response) {
          // Server responded with a status code that falls out of the range of 2xx
          console.error("Error response data:", error.response.data);

          // Safely access the error message
          const errorMessage =
            error.response.data?.error ||
            error.response.data?.message ||
            "An unexpected error occurred.";

          setCatError(errorMessage);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Error request:", error.request);
          setCatError("Network error. Please check your connection.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
          setCatError("An error occurred. Please try again.");
        }
      } finally {
        setCatLoading(false);
      }
    };

    fetchContacts(); // Call the async function
  }, []);

  return { catLoading, catError, categories };
};

export default useCategories;
