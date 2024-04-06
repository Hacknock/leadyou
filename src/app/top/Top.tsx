import React, { useState, useEffect, FormEventHandler } from "react";
import { useTranslation } from "react-i18next";
import Catalog, { CatalogObject } from "./Catalog";
import "./Top.css";

type Props = {
  catalog: CatalogObject;
};

export default function Top(props: Props) {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [autoFill, setAutoFill] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setDisabled(url.length <= 0);
  }, [url]);

  const validateURL = async () => {
    if (url.length === 0) {
      window.location.href = "?scene=editor";
      return;
    }
    const splitURL = url.split("/");
    if (!url.startsWith("https://github.com/") || splitURL.length < 5) {
      setShowAlert(true);
      return;
    }
    const owner = splitURL[3];
    const repo = splitURL[4];
    try {
      const requestURL = `https://api.github.com/repos/${owner}/${repo}/contributors`;
      const response = await fetch(requestURL, { mode: "cors" });
      if (response.ok) {
        window.location.href = `?scene=editor&owner=${owner}&repo=${repo}&autofill=${autoFill}`;
      } else {
        throw new Error("network response was not ok.");
      }
    } catch (error) {
      console.error(error);
      setShowAlert(true);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    validateURL();
  };

  return (
    <div className="top">
      <div className="top-banner">
        <img src="./images/leadyou-icon.png" />
        {t("title")}
      </div>
      <h3>{t("subTitle")}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          {showAlert && <p className="alert-message">{t("invalidRepository")}</p>}
          <input
            type="text"
            className="normal-repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t("repositoryPlaceholder") || undefined}
          />
        </div>
        <div className="checkbox-area">
          <input
            type="checkbox"
            checked={autoFill}
            onChange={(e) => setAutoFill(e.target.checked)}
            disabled={disabled}
          />
          <label htmlFor="auto-fill">{t("autoFill")}</label>
          <p className="checkbox-description">{t("autoFillExplain")}</p>
        </div>
        <input type="submit" value={t("next") || undefined} />
      </form>
      <Catalog catalog={props.catalog} />
    </div>
  );
}
