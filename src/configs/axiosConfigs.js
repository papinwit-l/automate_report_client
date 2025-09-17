import axios from "axios";

let axiosInstance = null;

const createAxiosInstance = async () => {
  if (axiosInstance) return axiosInstance;

  try {
    const response = await fetch("/config.json");
    const config = await response.json();

    axiosInstance = axios.create({
      baseURL:
        config.API_BASE_URL ||
        "https://phpstack-1457287-5755937.cloudwaysapps.com",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.warn("Could not load config.json, using fallback URL");
    axiosInstance = axios.create({
      baseURL: "https://phpstack-1457287-5755937.cloudwaysapps.com",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return axiosInstance;
};

export default createAxiosInstance;
