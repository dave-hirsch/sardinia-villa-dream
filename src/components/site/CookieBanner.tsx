import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

const KEY = "msv-cookie-consent";

export function CookieBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = window.localStorage.getItem(KEY);
    if (!v) setVisible(true);
  }, []);

  const decide = (v: "accept" | "reject") => {
    window.localStorage.setItem(KEY, v);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50 bg-white ring-1 ring-black/10 p-6 shadow-xl">
      <p className="font-serif text-lg text-sea mb-2">{t("cookies.title")}</p>
      <p className="text-sm text-olive/80 leading-relaxed mb-4">{t("cookies.body")}</p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => decide("accept")}
          className="bg-sea text-sand px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-sea/90"
        >
          {t("cookies.accept")}
        </button>
        <button
          onClick={() => decide("reject")}
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-olive hover:text-sea px-3 py-2.5"
        >
          {t("cookies.reject")}
        </button>
        <Link to="/privacy" className="text-[11px] font-medium uppercase tracking-[0.2em] text-clay border-b border-clay pb-0.5">
          {t("cookies.learn")}
        </Link>
      </div>
    </div>
  );
}
