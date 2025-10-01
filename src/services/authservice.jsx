// src/services/authService.js
export async function getCurrentUser() {
  try {
    const response = await fetch("http://localhost:5000/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include" // cookie session ikut
    });

    if (!response.ok) {
      throw new Error("Silahkan login dulu");
    }

    const data = await response.json();
    return data.user; // user info dari session
  } catch (error) {
    console.error("Error getCurrentUser:", error.message);
    return null;
  }
}

export async function updateUserProfile(userData) {
  try {
    const response = await fetch("http://localhost:5000/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      // Provide specific error messages based on status code
      if (response.status === 413) {
        throw new Error(error.message || 'File terlalu besar untuk diupload');
      } else if (response.status === 408) {
        throw new Error('Request timeout. Coba lagi dengan gambar yang lebih kecil.');
      } else if (response.status >= 500) {
        throw new Error('Server sedang bermasalah. Coba lagi nanti.');
      }
      throw new Error(error.message || "Gagal update profile");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updateUserProfile:", error.message);
    // Re-throw with additional context if it's a network error
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Koneksi bermasalah. Periksa internet Anda.');
    }
    throw error;
  }
}

export async function updateUserPassword(passwordData) {
  try {
    const response = await fetch("http://localhost:5000/api/auth/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(passwordData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Gagal update password");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updateUserPassword:", error.message);
    throw error;
  }
}

export async function logout() {
  try {
    const response = await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });
    
    if (response.ok) {
      // Redirect to homepage instead of login page
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Logout error:", error);
    // Even if there's an error, redirect to homepage
    window.location.href = "/";
  }
}