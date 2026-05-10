const KEY = "quiz_user_name";

export function getUserName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}

export function setUserName(name: string) {
  localStorage.setItem(KEY, name);
}

export function clearUser() {
  localStorage.removeItem(KEY);
}
