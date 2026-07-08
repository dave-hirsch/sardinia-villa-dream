import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const linkClass =
  "text-[11px] font-medium uppercase tracking-[0.2em] text-olive hover:text-clay transition-colors";
const activeCls = "text-clay";

export function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-sand/85 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between gap-4">
        <nav className="hidden md:flex flex-1 gap-7 items-center">
          <Link to="/villas" className={linkClass} activeProps={{ className: `${linkClass} ${activeCls}` }}>
            {t("nav.villas")}
          </Link>
          <Link to="/destinations" className={linkClass} activeProps={{ className: `${linkClass} ${activeCls}` }}>
            {t("nav.destinations")}
          </Link>
          <Link to="/experiences" className={linkClass} activeProps={{ className: `${linkClass} ${activeCls}` }}>
            {t("nav.experiences")}
          </Link>
          <Link to="/guide" className={linkClass} activeProps={{ className: `${linkClass} ${activeCls}` }}>
            {t("nav.guide")}
          </Link>
        </nav>

        <Link to="/" className="flex-none">
          <span className="font-serif text-xl md:text-2xl italic tracking-tight text-sea">
            My Sardinian Villa
          </span>
        </Link>

        <div className="hidden md:flex flex-1 justify-end gap-7 items-center">
          <Link to="/about" className={linkClass} activeProps={{ className: `${linkClass} ${activeCls}` }}>
            {t("nav.about")}
          </Link>
          <Link to="/contact" className={linkClass} activeProps={{ className: `${linkClass} ${activeCls}` }}>
            {t("nav.contact")}
          </Link>
          <LanguageSwitcher />
        </div>

        <button
          aria-label="Menu"
          className="md:hidden flex-none text-sea"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/5 bg-sand">
          <div className="px-6 py-6 flex flex-col gap-5">
            <Link to="/villas" onClick={() => setOpen(false)} className={linkClass}>{t("nav.villas")}</Link>
            <Link to="/destinations" onClick={() => setOpen(false)} className={linkClass}>{t("nav.destinations")}</Link>
            <Link to="/experiences" onClick={() => setOpen(false)} className={linkClass}>{t("nav.experiences")}</Link>
            <Link to="/guide" onClick={() => setOpen(false)} className={linkClass}>{t("nav.guide")}</Link>
            <Link to="/about" onClick={() => setOpen(false)} className={linkClass}>{t("nav.about")}</Link>
            <Link to="/contact" onClick={() => setOpen(false)} className={linkClass}>{t("nav.contact")}</Link>
            <div className="pt-2"><LanguageSwitcher /></div>
          </div>
        </div>
      )}
    </header>
  );
}
