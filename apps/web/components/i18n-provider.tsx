"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { DirectionProvider } from "@/components/ui/direction";
import i18n, { isRtlLocale } from "@/lib/i18n";

function applyDocumentLocale(locale: string) {
  document.documentElement.lang = locale;
  document.documentElement.dir = isRtlLocale(locale) ? "rtl" : "ltr";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");

  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved === "ckb" || saved === "en") {
      void i18n.changeLanguage(saved);
    }

    const markReady = () => setReady(true);
    if (i18n.isInitialized) markReady();
    else i18n.on("initialized", markReady);

    const apply = (locale: string) => {
      applyDocumentLocale(locale);
      setDirection(isRtlLocale(locale) ? "rtl" : "ltr");
    };
    apply(i18n.language);
    i18n.on("languageChanged", apply);

    return () => {
      i18n.off("initialized", markReady);
      i18n.off("languageChanged", apply);
    };
  }, []);

  if (!ready) return null;

  return (
    <I18nextProvider i18n={i18n}>
      <DirectionProvider direction={direction}>{children}</DirectionProvider>
    </I18nextProvider>
  );
}
