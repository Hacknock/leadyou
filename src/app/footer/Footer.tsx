import React from "react";
import { useTranslation } from "react-i18next";
import "./Footer.css";

type Props = {
  generatedCount: number;
};

export default function Footer(props: Props) {
  const { t } = useTranslation();

  const anchor = (pageid: string, labelKey: string) => {
    return <a href={`?scene=document&pageid=${pageid}`}>{t(labelKey)}</a>;
  };

  return (
    <div className="footer">
      <div className="footer-child left-child">
        <div>
          <h1 className="title">{t("title")} </h1>
          <span className="counter">{`+${props.generatedCount}`}</span>
        </div>
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
        <p>
          <a href="https://hacknock.github.io/member.html">{t("contact")}</a>
        </p>
      </div>
    </div>
  );
}
