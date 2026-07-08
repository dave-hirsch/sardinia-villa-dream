import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-sand pt-20 pb-10 border-t border-black/5 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="space-y-5 max-w-sm">
            <Link to="/" className="font-serif text-3xl italic text-sea">My Sardinian Villa</Link>
            <p className="text-sm text-olive/70 leading-relaxed">{t("footer.tagline")}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-20">
            <div className="space-y-4">
              <span className="eyebrow">{t("footer.explore")}</span>
              <ul className="space-y-2 text-sm text-olive">
                <li><Link to="/villas" className="hover:text-sea">{t("nav.villas")}</Link></li>
                <li><Link to="/destinations" className="hover:text-sea">{t("nav.destinations")}</Link></li>
                <li><Link to="/experiences" className="hover:text-sea">{t("nav.experiences")}</Link></li>
                <li><Link to="/guide" className="hover:text-sea">{t("nav.guide")}</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <span className="eyebrow">{t("footer.company")}</span>
              <ul className="space-y-2 text-sm text-olive">
                <li><Link to="/about" className="hover:text-sea">{t("nav.about")}</Link></li>
                <li><Link to="/list-your-property" className="hover:text-sea">{t("nav.listProperty")}</Link></li>
                <li><Link to="/contact" className="hover:text-sea">{t("nav.contact")}</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <span className="eyebrow">{t("footer.legal")}</span>
              <ul className="space-y-2 text-sm text-olive">
                <li><Link to="/privacy" className="hover:text-sea">{t("footer.privacy")}</Link></li>
                <li><Link to="/faq" className="hover:text-sea">{t("footer.faq")}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-black/5 gap-6">
          <LanguageSwitcher />
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-olive/40 text-center">
            © {new Date().getFullYear()} My Sardinian Villa. {t("footer.rights")}
          </span>
        </div>
      </div>
    </footer>
  );
}
