import React from "react";
import { useTranslation } from "react-i18next";
import "./Editor.css";

type Props = {
  lang: string;
};

export default function Editor(props: Props) {
  const { lang } = props;
  const { t } = useTranslation();

  return <div className="editor">hello</div>;
}
