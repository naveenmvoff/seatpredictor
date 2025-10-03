import axios from "axios";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message?: string;
  user?: string;
  access?: string;
  refresh?: string;
}

export async function adminLogin(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/admin/login/",
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data; // { message, user, access, refresh }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
}
