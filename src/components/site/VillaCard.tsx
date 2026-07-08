import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { ImagePlaceholder } from "./ImagePlaceholder";


export interface VillaCardData {
  slug: string;
  name: string;
  location: string;
  sleeps: number;
  bedrooms: number;
  price_from: number;
  cover_image: string | null;
  tags: string[];
}

export function VillaCard({ villa, aspect = "aspect-[3/4]" }: { villa: VillaCardData; aspect?: string }) {
  const { t } = useTranslation();
  return (
    <Link to="/villas/$slug" params={{ slug: villa.slug }} className="group block">
      <div className={`${aspect} w-full bg-stone-100 overflow-hidden ring-1 ring-black/5`}>
        {villa.cover_image ? (
          <img
            src={villa.cover_image}
            alt={villa.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[900ms] ease-out"
          />
        ) : (
          <ImagePlaceholder />
        )}

      </div>
      <div className="mt-5 space-y-1">
        <div className="flex justify-between items-baseline gap-4">
          <h3 className="font-serif text-xl text-sea">{villa.name}</h3>
          <span className="text-sm font-medium text-clay whitespace-nowrap">
            Price upon request
          </span>
        </div>
        <p className="text-sm text-olive/70">
          {villa.location} · {t("villa.sleeps")} {villa.sleeps} · {villa.bedrooms} {t("villa.bedrooms").toLowerCase()}
        </p>
      </div>
    </Link>
  );
}
