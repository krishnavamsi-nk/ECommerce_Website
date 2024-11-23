import axios from "axios";
const apiUrl = import.meta.env.VITE_BASE_URL;

export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axios.get(apiUrl + url);
    return data;
  } catch (error) {
    console.log("Fetch error:", error);

    // Check if the error is from the response (e.g., 404, 500) or a network issue
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        msg: error.response.data.msg || "An error occurred",
      };
    } else {
      return {
        success: false,
        status: null,
        msg: "Network error or server not reachable",
      };
    }
  }
};

export const fetchDataById = async (url, id) => {
  try {
    const { data } = await axios.get(apiUrl + url + id);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const postData = async (url, formData) => {
  console.log(url, formData, apiUrl);

  const { data } = await axios.post(apiUrl + url, formData);
  return data;
};

export const editData = async (url, updateData) => {
  try {
    const { data } = await axios.put(apiUrl + url, updateData);
    return data;
  } catch (error) {
    console.log("Error:", error);

    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        msg: error.response.data.msg || "An Error Occurred",
      };
    } else {
      return {
        success: false,
        status: null,
        msg: "Network Error or Server Not Reachable",
      };
    }
  }
};

export const deleteData = async (url, id) => {
  const { data } = await axios.delete(apiUrl + url + id);
  return data;
};

export const deleteImage = async (url, publicId) => {
  try {
    const { data } = await axios.delete(apiUrl + url, {
      data: {
        image: `${publicId}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error; // Propagate error if needed
  }
};

export const deleteDataAll = async (url) => {
  const { data } = await axios.delete(apiUrl + url);
  return data;
};
