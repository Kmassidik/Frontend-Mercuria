let accessToken: string | null = null;

function setCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict; Secure`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict; Secure`;
}

export const getAccessToken = (): string | null => accessToken;
export const setAccessToken = (token: string): void => {
  accessToken = token;
};
export const getRefreshToken = (): string | null => getCookie("mercuria_rt");
export const setRefreshToken = (token: string): void =>
  setCookie("mercuria_rt", token, 7);

export const setTokens = (access: string, refresh: string): void => {
  accessToken = access;
  setCookie("mercuria_rt", refresh, 7);
};

export const clearTokens = (): void => {
  accessToken = null;
  deleteCookie("mercuria_rt");
};

export const hasRefreshToken = (): boolean => getCookie("mercuria_rt") !== null;
