import React, { useState, useEffect } from "react";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import queryString from "query-string";
import { Header, DummyHeader } from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import ja from "./json/locales/ja.json";
import en from "./json/locales/en.json";
import "./App.css";

i18n.use(initReactI18next).init({
  debug: true,
  resources: {
    ja: { translation: ja },
    en: { translation: en },
  },
  lng: "ja",
  fallbackLng: "en",
  returnEmptyString: false,
});

export default function App() {
  const qs = queryString.parse(window.location.search);
  const defaultLang = ((qs: queryString.ParsedQuery) => {
    if ("lang" in qs && qs.lang === "en") {
      return "en";
    }
    return "ja";
  })(qs);
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(defaultLang);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const onLangChange = () => {
    window.scrollTo(0, 0);
    const newLang = lang === "en" ? "ja" : "en";
    const url = new URL(window.location.toString());
    url.searchParams.set("lang", newLang);
    history.pushState({}, "", url);
    setLang(newLang);
  };

  return (
    <div className="app">
      <Header lang={lang} onLangChange={onLangChange} />
      <DummyHeader />
      <Content lang={lang} />
      <Footer />
    </div>
  );
}
