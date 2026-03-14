type JwtPayload = {
  iss: string;
  iat: number;
  exp: number;
  nbf: number;
  jti: string;
  sub: string;
  prv: string;
};

export function parseJWT(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(decoded)) as JwtPayload;
  } catch (error) {
    console.error("Invalid JWT token:", error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 * @param token - JWT token string
 * @returns true if token is expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }
  // Check if token is expired (with 30 second buffer)
  return Date.now() >= payload.exp * 1000 - 30000;
}

/**
 * Check if token should be refreshed (within 5 minutes of expiration)
 * @param token - JWT token string
 * @returns true if token should be refreshed
 */
export function shouldRefreshToken(token: string): boolean {
  const payload = parseJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }
  // Refresh if token expires in less than 5 minutes
  const fiveMinutesInMs = 5 * 60 * 1000;
  return Date.now() >= payload.exp * 1000 - fiveMinutesInMs;
}
