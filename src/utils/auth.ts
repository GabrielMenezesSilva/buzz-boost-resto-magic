// JWT Token utilities
const TOKEN_KEY = 'auth_token';

export const tokenStorage = {
  get: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  set: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  remove: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  exists: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const getTokenPayload = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};