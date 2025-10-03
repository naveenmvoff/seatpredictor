export const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() > payload.exp * 1000;
  } catch {
    return true;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  let accessToken = sessionStorage.getItem("access_token");

  if (!accessToken || isTokenExpired(accessToken)) {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      window.location.href = "/admin-login";
      return null;
    }

    const res = await fetch("http://127.0.0.1:8000/api/admin/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) {
      window.location.href = "/admin-login";
      return null;
    }

    const data = await res.json();
    accessToken = data.access;
    if (accessToken) {
      sessionStorage.setItem("access_token", accessToken);
    } else {
      window.location.href = "/admin-login";
      return null;
    }
  }

  return accessToken;
};

export const handleLogout = () => {
  sessionStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("username");
  window.location.href = "/admin-login";
};
