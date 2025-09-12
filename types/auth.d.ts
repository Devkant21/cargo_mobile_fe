export interface GoogleOAuthRequestBody {
  code: string;
}

export interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

export interface User {
  id: string;
  email: string;
  role: "dev" | "admin" | "user" | "driver";
  security_level: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface GoogleAuthResponse {
  message: string;
  user: {
    email: string;
    role?: "dev" | "admin" | "user" | "driver";
    name?: string | null;
    picture?: string | null;
  };
}

export interface JWTTokenPayload {
  id: string;
  email: string;
  role: "dev" | "admin" | "user" | "driver";
  iat?: number;
  exp?: number;
  exp?: number;
  iat?: number;
}
