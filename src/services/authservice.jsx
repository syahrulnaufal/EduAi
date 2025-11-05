// export async function getCurrentUser() {
//   try {
//     const response = await fetch("http://localhost:5000/api/auth/me", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       credentials: "include" // cookie session ikut
//     });

//     if (!response.ok) {
//       throw new Error("Silahkan login dulu");
//     }

//     const data = await response.json();
//     return data.user; // user info dari session
//   } catch (error) {
//     console.error("Error getCurrentUser:", error.message);
//     return null;
//   }
// }


// export async function updateUserProfile(userData) {
//   try {
//     const response = await fetch("http://localhost:5000/api/auth/profile", {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       credentials: "include",
//       body: JSON.stringify(userData)
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       // Provide specific error messages based on status code
//       if (response.status === 413) {
//         throw new Error(error.message || 'File terlalu besar untuk diupload');
//       } else if (response.status === 408) {
//         throw new Error('Request timeout. Coba lagi dengan gambar yang lebih kecil.');
//       } else if (response.status >= 500) {
//         throw new Error('Server sedang bermasalah. Coba lagi nanti.');
//       }
//       throw new Error(error.message || "Gagal update profile");
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error updateUserProfile:", error.message);
//     // Re-throw with additional context if it's a network error
//     if (error.name === 'TypeError' && error.message.includes('fetch')) {
//       throw new Error('Koneksi bermasalah. Periksa internet Anda.');
//     }
//     throw error;
//   }
// }

// export async function updateUserPassword(passwordData) {
//   try {
//     const response = await fetch("http://localhost:5000/api/auth/password", {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       credentials: "include",
//       body: JSON.stringify(passwordData)
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || "Gagal update password");
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error updateUserPassword:", error.message);
//     throw error;
//   }
// }

// export async function logout() {
//   try {
//     // 🔥 hapus data di browser
//     localStorage.removeItem("user");
//     sessionStorage.clear();

//     // 🔥 coba hapus session di backend (kalau masih pakai express-session)
//     const response = await fetch("http://localhost:5000/api/auth/logout", {
//       method: "POST",
//       credentials: "include", // kirim cookie biar session ikut
//     });

//     if (!response.ok) {
//       console.warn("Logout server gagal atau session sudah hilang.");
//     }
//   } catch (error) {
//     console.error("Logout error:", error);
//   } finally {
//     // ✅ selalu redirect meskipun server gagal
//     window.location.href = "/login";
//   }
// }



// ✅ 1. Tentukan API_URL secara dinamis
// VITE_API_URL akan dibaca dari file .env
// Jika tidak ada, ia akan memakai 'http://localhost:5000' sebagai fallback
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = process.env.VITE_API_URL || 'http://localhost:5000';


export async function getCurrentUser() {
  try {
    // ✅ 2. Ganti URL
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include" 
    });

    if (!response.ok) {
      throw new Error("Silahkan login dulu");
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error getCurrentUser:", error.message);
    return null;
  }
}


export async function updateUserProfile(userData) {
  try {
    // ✅ 2. Ganti URL
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
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
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Koneksi bermasalah. Periksa internet Anda.');
    }
    throw error;
  }
}

export async function updateUserPassword(passwordData) {
  try {
    // ✅ 2. Ganti URL
    const response = await fetch(`${API_URL}/api/auth/password`, {
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
    localStorage.removeItem("user");
    sessionStorage.clear();

    // ✅ 2. Ganti URL
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      console.warn("Logout server gagal atau session sudah hilang.");
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    window.location.href = "/login";
  }
}