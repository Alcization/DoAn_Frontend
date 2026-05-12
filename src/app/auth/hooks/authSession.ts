import { buildApiUrl } from "@/services/api-config";

export interface AuthResponsePayload {
  accessToken?: string;
  refreshToken?: string;
  roles?: string[];
  user?: unknown;
  message?: string;
}

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
export const GOOGLE_AUTH_ENDPOINT = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENDPOINT || "/auth/google";

export const isGoogleAuthConfigured = Boolean(GOOGLE_CLIENT_ID);

export const getGoogleAuthUrl = () => buildApiUrl(GOOGLE_AUTH_ENDPOINT);

export const persistAuthSession = (data: AuthResponsePayload) => {
  if (typeof window === "undefined") {
    return;
  }

  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }

  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  if (data.roles) {
    localStorage.setItem("roles", JSON.stringify(data.roles));
  }
};

export const getRedirectPathByRoles = (roles: string[] = []) => {
  if (roles.includes("moderator")) {
    return "/normal/business/page?tab=home";
  }

  if (roles.includes("admin")) {
    return "/government/page?tab=dashboard";
  }

  if (roles.includes("user")) {
    return "/normal/personal/page?tab=home";
  }

  return "/auth/login";
};

// Đã cập nhật thành accessToken
export const signInWithGoogleAccessToken = async (accessToken: string) => {
  const response = await fetch(getGoogleAuthUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // SỬA Ở ĐÂY: Thay đổi key từ 'token' thành 'accessToken'
    body: JSON.stringify({ accessToken: accessToken }), 
  });

  const data = (await response.json().catch(() => ({}))) as AuthResponsePayload;

  if (!response.ok) {
    throw new Error(data.message || "Đăng nhập Google thất bại. Vui lòng thử lại sau.");
  }

  return data;
};