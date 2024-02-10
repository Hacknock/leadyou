import React from "react";
import { useTranslation } from "react-i18next";
import "./Footer.css";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <div className="footer">
      <div className="footer-child left-child">
        <h1>
          LEADYOU<span id="counter">+0</span>
        </h1>
        <p>{t("copyright")}</p>
      </div>
      <div className="footer-child right-child-1">
        <p>
          <a href="?scene=document&pageid=about-readme">About README</a>
        </p>
        <p>
          <a href="?scene=document&pageid=how-to-use-generator">How to Use</a>
        </p>
        <p>
          <a href="?scene=document&pageid=new-readme-format-proposal">Proposal</a>
        </p>
        <p>
          <a href="?scene=document&pageid=help">Help</a>
        </p>
      </div>
      <div className="footer-child right-child-2">
        <p>
          <a href="?scene=document&pageid=terms-of-service">Terms of Service</a>
        </p>
        <p>
          <a href="?scene=document&pageid=privacy-policy">Privacy Policy</a>
        </p>
        <p>
          <a href="?scene=document&pageid=contact">Contact</a>
        </p>
      </div>
    </div>
  );
}
