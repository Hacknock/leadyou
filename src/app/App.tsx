import React from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import queryString from "query-string";
import { Header, DummyHeader } from "./header/Header";
import Top from "./top/Top";
import Editor from "./editor/Editor";
import Document from "./document/Document";
import Footer from "./footer/Footer";
import en from "../json/locales/en.json";
import { CatalogObject } from "./top/Catalog";
import catalogJSON from "../json/catalog.json";
import "./App.css";
import "./support/Marked.css";

i18n.use(initReactI18next).init({
  debug: true,
  resources: {
    en: { translation: en },
  },
  lng: "en",
  fallbackLng: "en",
  returnEmptyString: false,
});

export default function App() {
  const qs = queryString.parse(window.location.search);
  const scene = ((qs: queryString.ParsedQuery) => {
    if ("scene" in qs && qs.scene === "editor") {
      return "editor";
    } else if ("scene" in qs && qs.scene === "document") {
      return "document";
    } else {
      return "top";
    }
  })(qs);
  const pageID = "pageid" in qs && typeof qs.pageid === "string" ? qs.pageid : null;
  const owner = "owner" in qs && typeof qs.owner === "string" ? qs.owner : null;
  const repo = "repo" in qs && typeof qs.repo === "string" ? qs.repo : null;
  const autoFill = "autofill" in qs && typeof qs.autofill === "string" && qs.autofill === "true";
  const catalog = catalogJSON as CatalogObject;

  return (
    <div className="app">
      <Header />
      <DummyHeader />
      {scene === "top" && <Top catalog={catalog} />}
      {scene === "editor" && <Editor owner={owner} repo={repo} autoFill={autoFill} />}
      {scene === "document" && <Document pageID={pageID} />}
      <Footer generatedCount={catalog.totalCount} />
    </div>
  );
}
