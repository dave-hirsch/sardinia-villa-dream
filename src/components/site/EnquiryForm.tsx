import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { enquirySchema, type EnquiryInput, submitEnquiry } from "@/lib/enquiries";

const SERVICES = [
  "Private chef",
  "Boat trip",
  "Winery tour",
  "Babysitting",
  "Housekeeping",
  "Airport transfer",
] as const;

export function EnquiryForm({
  villaSlug,
  villaName,
  source,
}: {
  villaSlug?: string;
  villaName?: string;
  source: string;
}) {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2>(1);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const form = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema) as never,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date_from: "",
      date_to: "",
      flexible_dates: false,
      adults: 2,
      children: 0,
      budget: "" as unknown as number,
      preferred_area: "",
      villa_slug: villaSlug ?? "",
      services_needed: [],
      message: "",
      website: "",
    },
  });

  const onSubmit = async (values: EnquiryInput) => {
    setStatus("sending");
    try {
      await submitEnquiry(values, source);
      setStatus("success");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  const services = form.watch("services_needed");
  const toggleService = (s: string) => {
    const current = services ?? [];
    form.setValue(
      "services_needed",
      current.includes(s) ? current.filter((x) => x !== s) : [...current, s],
    );
  };

  if (status === "success") {
    return (
      <div className="text-center py-16">
        <p className="eyebrow mb-4">✓</p>
        <h3 className="font-serif text-3xl text-sea mb-3">{t("enquiry.successTitle")}</h3>
        <p className="text-olive/80 max-w-md mx-auto">{t("enquiry.successBody")}</p>
      </div>
    );
  }

  const inputCls =
    "w-full bg-transparent border-b border-black/15 py-2.5 text-sm focus:outline-none focus:border-clay transition-colors";
  const labelCls = "block text-[10px] font-medium uppercase tracking-[0.2em] text-olive/60 mb-1";

  const goNext = async () => {
    const ok = await form.trigger(["name", "email"]);
    if (ok) setStep(2);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {villaName && (
        <p className="text-sm text-olive/70">
          <span className="eyebrow mr-2">Villa</span>
          {villaName}
        </p>
      )}

      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...form.register("website")}
        className="absolute -left-[9999px] w-px h-px opacity-0"
        aria-hidden
      />

      {/* Step indicator */}
      <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em]">
        <span className={step === 1 ? "text-clay" : "text-olive/40"}>1 · {t("enquiry.step1")}</span>
        <span className={step === 2 ? "text-clay" : "text-olive/40"}>2 · {t("enquiry.step2")}</span>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className={labelCls}>{t("enquiry.name")}</label>
            <input {...form.register("name")} className={inputCls} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>{t("enquiry.email")}</label>
              <input type="email" {...form.register("email")} className={inputCls} />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>{t("enquiry.phone")}</label>
              <input {...form.register("phone")} className={inputCls} />
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={goNext}
              className="bg-sea text-sand px-8 py-3 text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-sea/90"
            >
              {t("enquiry.next")}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>{t("enquiry.dateFrom")}</label>
              <input type="date" {...form.register("date_from")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t("enquiry.dateTo")}</label>
              <input type="date" {...form.register("date_to")} className={inputCls} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-olive">
            <input type="checkbox" {...form.register("flexible_dates")} className="accent-clay" />
            {t("enquiry.flexible")}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className={labelCls}>{t("enquiry.adults")}</label>
              <input type="number" min={1} max={30} {...form.register("adults")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t("enquiry.children")}</label>
              <input type="number" min={0} max={30} {...form.register("children")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t("enquiry.budget")}</label>
              <input type="number" min={0} {...form.register("budget")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t("enquiry.area")}</label>
              <input {...form.register("preferred_area")} className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>{t("enquiry.services")}</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {SERVICES.map((s) => {
                const active = services?.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleService(s)}
                    className={
                      "text-[11px] uppercase tracking-[0.15em] px-3 py-1.5 border transition-colors " +
                      (active
                        ? "bg-sea text-sand border-sea"
                        : "border-black/15 text-olive hover:border-clay hover:text-clay")
                    }
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelCls}>{t("enquiry.message")}</label>
            <textarea
              {...form.register("message")}
              rows={4}
              className={inputCls + " resize-none"}
            />
          </div>

          {status === "error" && (
            <div className="border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm">
              <p className="font-medium text-destructive">{t("enquiry.errorTitle")}</p>
              <p className="text-destructive/80">{t("enquiry.errorBody")}</p>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-olive hover:text-sea"
            >
              ← {t("enquiry.back")}
            </button>
            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-clay text-sand px-8 py-3 text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-clay/90 disabled:opacity-60"
            >
              {status === "sending" ? t("enquiry.sending") : t("enquiry.submit")}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
