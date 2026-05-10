export type ThemeId = "midnight" | "oled" | "cyberpunk" | "synthwave";

export const THEMES: { id: ThemeId; name: string; swatch: [string, string] }[] = [
  { id: "midnight", name: "Midnight", swatch: ["#5e6ad2", "#8b5cf6"] },
  { id: "oled", name: "OLED Neon", swatch: ["#22ee88", "#00bcd4"] },
  { id: "cyberpunk", name: "Cyberpunk", swatch: ["#ff2bd6", "#00f0ff"] },
  { id: "synthwave", name: "Synthwave", swatch: ["#ff5cad", "#7c3aed"] },
];

const KEY = "quiz_theme";

export function getStoredTheme(): ThemeId {
  if (typeof window === "undefined") return "midnight";
  const v = localStorage.getItem(KEY) as ThemeId | null;
  return v && THEMES.some((t) => t.id === v) ? v : "midnight";
}

export function setStoredTheme(id: ThemeId) {
  localStorage.setItem(KEY, id);
}

export function applyTheme(id: ThemeId) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", id);
}
