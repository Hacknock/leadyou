import React from "react";
import { useTranslation } from "react-i18next";
import "./Footer.css";

export default function Footer() {
  const { t } = useTranslation();

  const anchor = (pageid: string, labelKey: string) => {
    return <a href={`?scene=document&pageid=${pageid}`}>{t(labelKey)}</a>;
  };

  return (
    <div className="footer">
      <div className="footer-child left-child">
        <h1>
          {t("title")}
          <span id="counter">+0</span>
        </h1>
        <p>{t("copyright")}</p>
      </div>
      <div className="footer-child right-child-1">
        <p>{anchor("about-readme", "aboutReadme")}</p>
        <p>{anchor("how-to-use-generator", "howToUse")}</p>
        <p>{anchor("new-readme-format-proposal", "proposal")}</p>
        <p>{anchor("help", "help")}</p>
      </div>
      <div className="footer-child right-child-2">
        <p>{anchor("terms-of-service", "termsOfService")}</p>
        <p>{anchor("privacy-policy", "privacyPolicy")}</p>
        <p>{anchor("contact", "contact")}</p>
      </div>
    </div>
  );
}
