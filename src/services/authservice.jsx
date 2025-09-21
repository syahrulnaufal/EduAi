// src/services/authService.js
export async function getCurrentUser() {
  try {
    const token = localStorage.getItem("token");
    console.log("Token dari localStorage:", token); // <-- log token

    const response = await fetch("http://localhost:5000/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: "include" // cookie session ikut
    });

    if (!response.ok) {
      throw new Error("Silahkan login dulu");
    }

    const data = await response.json();
    return data; // user info
  } catch (error) {
    console.error("Error getCurrentUser:", error.message);
    return null;
  }
}
