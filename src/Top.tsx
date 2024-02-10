import React from "react";
import { useTranslation } from "react-i18next";
import "./Top.css";

type Props = {
  lang: string;
};

export default function Top(props: Props) {
  const { lang } = props;
  const { t } = useTranslation();

  return <div className="top">hello</div>;
}
