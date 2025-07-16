const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await fetch(
      "https://themutantschool-backend.onrender.com/api/institution/refresh-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!response.ok) {
      console.error("Failed to refresh token:", await response.text());
      return null;
    }

    const data = await response.json();

    if (data.accessToken) {
      localStorage.setItem("login-accessToken", data.accessToken);
      return data.accessToken;
    }

    return null;
  } catch (error) {
    console.error("Refresh token error:", error);
    return null;
  }
};
export default refreshAccessToken;