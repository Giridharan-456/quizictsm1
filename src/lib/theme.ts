export type ThemeId = "minimal" | "glass" | "material";

export const THEMES: { id: ThemeId; name: string; swatch: [string, string] }[] = [
  { id: "minimal", name: "Pure Minimal", swatch: ["#1a1a1a", "#10b981"] },
  { id: "glass", name: "Glass Premium", swatch: ["#10b981", "#0ea5e9"] },
  { id: "material", name: "Material You", swatch: ["#6ee7b7", "#2f4636"] },
];

const KEY = "quiz_theme";

export function getStoredTheme(): ThemeId {
  if (typeof window === "undefined") return "minimal";
  const v = localStorage.getItem(KEY) as ThemeId | null;
  return v && THEMES.some((t) => t.id === v) ? v : "minimal";
}

export function setStoredTheme(id: ThemeId) {
  localStorage.setItem(KEY, id);
}

export function applyTheme(id: ThemeId) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", id);
}
