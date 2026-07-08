import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "it", label: "IT" },
  { code: "fr", label: "FR" },
] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage ?? "en").slice(0, 2);

  return (
    <div className="flex gap-3 items-center">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => i18n.changeLanguage(l.code)}
          className={
            "text-[10px] font-medium uppercase tracking-[0.2em] transition-colors " +
            (current === l.code ? "text-sea" : "text-olive/40 hover:text-sea")
          }
          aria-label={`Switch to ${l.label}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
