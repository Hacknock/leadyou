import React from "react";
import { useTranslation } from "react-i18next";
import "./Header.css";

type Props = {
  lang: string;
  onLangChange: () => void;
};

export function Header(props: Props) {
  const { lang, onLangChange } = props;
  const { t } = useTranslation();

  return (
    <div className="header">
      <div className="icon-container">
        <img className="icon" src={"images/icon-mini.png"} alt="leadyou" />
      </div>
      <h2 className="title">LEADYOU</h2>
      <h3 className="subtitle">README Generator for OSS</h3>
      <h3 className="language" onClick={onLangChange}>
        {t("language")}
      </h3>
    </div>
  );
}

export function DummyHeader() {
  return <div className="dummy-header"></div>;
}
