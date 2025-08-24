/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";
import { getAuthHeaders } from "./apiHelper";

// --- INTERFACES ---

// Interface for a single place object coming from your API
interface ApiPlace {
  id: string;
  name: string;
  category_id: string; // e.g., "cafes", "restaurants"
  location: string;
  description: string;
  phone: string;
  google_maps_url: string;
  picture: string;
}

// Interfaces that your frontend components expect (from your original appData.ts)
// We'll rename them slightly to avoid confusion
export interface FrontendElement {
  id: string;
  slug: string;
  title: string;
  image: string;
  speciality: string;
  description: string;
  location: string;
  working_time: string; // Your API doesn't provide this, so we'll use a default
  phone?: string;
  delivery?: boolean; // Your API doesn't provide this
  type?: string;
}

export interface FrontendCategory {
  id: string; // We'll use the category_id as the ID
  name: string;
  slug: string;
  elements: FrontendElement[];
}

// --- HELPER FUNCTIONS ---

// Creates a URL-friendly slug from a string (e.g., "Kahwa Arbi" -> "kahwa-arbi")
const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\\-]+/g, "") // Remove all non-word chars
    .replace(/\\-\\-+/g, "-"); // Replace multiple - with single -

// Capitalizes the first letter of a string (e.g., "cafes" -> "Cafes")
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const usePlaces = () => {
  const [categories, setCategories] = useState<FrontendCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAndProcessPlaces = async () => {
      const headers = getAuthHeaders();
      try {
        const API_URL = "https://hadrumetpassportbackend.onrender.com";
        const response = await axios.get<ApiPlace[]>(`${API_URL}/api/places/`, {
          headers: headers,
        });
        const apiPlaces = response.data;

        const groupedByCategory: Record<string, FrontendCategory> = {};

        apiPlaces.forEach((place) => {
          const categorySlug = place.category_id;

          // If we haven't seen this category yet, create its entry
          if (!groupedByCategory[categorySlug]) {
            groupedByCategory[categorySlug] = {
              id: categorySlug,
              slug: categorySlug,
              name: capitalize(categorySlug.replace("_", " ")), // "coffee_shops" -> "Coffee shops"
              elements: [],
            };
          }

          // Map the API place to the structure the frontend component expects
          const frontendElement: FrontendElement = {
            id: place.id,
            slug: slugify(place.name), // Create a slug from the place name
            title: place.name,
            image: place.picture,
            description: place.description,
            location: place.google_maps_url,
            phone: place.phone,
            // Add default values for fields not in your API response
            speciality: "N/A",
            working_time: "09:00 - 22:00",
            delivery: false,
          };

          // Add the transformed element to the correct category
          groupedByCategory[categorySlug].elements.push(frontendElement);
        });

        // Convert the grouped object back into an array
        const processedData = Object.values(groupedByCategory);
        setCategories(processedData);
      } catch (error: any) {
        if (error.response) {
          // Server responded with a status code that falls out of the range of 2xx
          console.error("Error response data:", error.response.data);

          // Safely access the error message
          const errorMessage =
            error.response.data?.error ||
            error.response.data?.message ||
            "An unexpected error occurred.";

          setError(errorMessage);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Error request:", error.request);
          setError("Network error. Please check your connection.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
          setError("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessPlaces();
  }, []);

  return { categories, loading, error };
};

export default usePlaces;
