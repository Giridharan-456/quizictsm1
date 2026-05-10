import { useEffect, useState } from "react";
import { Palette, Check } from "lucide-react";
import { THEMES, applyTheme, getStoredTheme, setStoredTheme, type ThemeId } from "@/lib/theme";

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ThemeId>("minimal");

  useEffect(() => {
    const t = getStoredTheme();
    setActive(t);
    applyTheme(t);
  }, []);

  const pick = (id: ThemeId) => {
    setActive(id);
    setStoredTheme(id);
    applyTheme(id);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change theme"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card backdrop-blur-md transition hover:border-[color:var(--ring)]"
      >
        <Palette className="h-4 w-4 text-foreground" />
      </button>

      {open && (
        <>
          <button
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-border bg-[color:var(--bg-elevated)] p-1.5 shadow-2xl backdrop-blur-xl">
            <div className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Theme
            </div>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => pick(t.id)}
                className="flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-sm transition hover:bg-[color:var(--accent)]"
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="h-6 w-6 shrink-0 rounded-md ring-1 ring-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]})`,
                    }}
                  />
                  <span className="font-medium">{t.name}</span>
                </span>
                {active === t.id && (
                  <Check className="h-4 w-4 text-[color:var(--primary)]" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
