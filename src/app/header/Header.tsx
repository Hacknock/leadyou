import React from "react";
import { useTranslation } from "react-i18next";
import "./Header.css";

export function Header() {
  const { t } = useTranslation();

  return (
    <div className="header">
      <div className="icon-container">
        <img className="icon" src={"images/icon-mini.png"} alt="leadyou" />
      </div>
      <h2
        className="title"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        {t("title")}
      </h2>
      <h3 className="sub-title">{t("subTitle")}</h3>
    </div>
  );
}

export function DummyHeader() {
  return <div className="dummy-header"></div>;
}
